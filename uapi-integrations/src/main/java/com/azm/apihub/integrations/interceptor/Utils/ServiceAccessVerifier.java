package com.azm.apihub.integrations.interceptor.Utils;

import com.azm.apihub.integrations.baseServices.BackendService;
import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.baseServices.models.*;
import com.azm.apihub.integrations.baseServices.models.Package;
import com.azm.apihub.integrations.baseServices.models.enums.PackagePeriod;
import com.azm.apihub.integrations.baseServices.models.enums.PackageStatus;
import com.azm.apihub.integrations.baseServices.models.enums.PackageType;
import com.azm.apihub.integrations.baseServices.models.enums.PricingType;
import com.azm.apihub.integrations.configuration.dto.CompanyAccountType;
import com.azm.apihub.integrations.exceptions.BadRequestException;
import com.azm.apihub.integrations.exceptions.ForbiddenException;
import com.azm.apihub.integrations.exceptions.UnAuthorizedException;
import com.azm.apihub.integrations.interceptor.enums.ServiceType;
import com.azm.apihub.integrations.interceptor.enums.TransactionStatus;
import com.azm.apihub.integrations.tcc.nafath.models.NafathLoginCallbackRequestData;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.StringTokenizer;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ServiceAccessVerifier {
    private final BackendService backendService;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private static final int[] THRESHOLDS = {50, 80, 90, 95, 100};
    private @Value("${notifications.send-consumption-notifications}") Boolean sendConsumptionNotifications;


    @Autowired
    public ServiceAccessVerifier(BackendService backendService) {
        this.backendService = backendService;
    }

    private List<CompanyPackageSelected> getCompanySelectedPackages (Long companyId, Long mainAccountId, String accountType, Boolean useMainAccountBundle) {
        List<CompanyPackageSelected> selectedPackages;
        if(Objects.equals(accountType, CompanyAccountType.SUB.name()) && useMainAccountBundle)
            selectedPackages = backendService.getSelectedCompanyPackages(mainAccountId);
        else
            selectedPackages = backendService.getSelectedCompanyPackages(companyId);

        return selectedPackages;
    }

    public void checkIfServiceIsEligibleToMakeCall(Company company, Service service, Boolean isPostpaid, Boolean useClientCredentials) {
        List<CompanyPackageSelected> selectedPackages = getCompanySelectedPackages(company.getId(), company.getMainAccountId(), company.getAccountType(), company.getUseMainAccountBundles());

        SubscribedServiceResponse subscribedServiceResponse;
        if(Objects.equals(company.getAccountType(), CompanyAccountType.SUB.name()))
            subscribedServiceResponse = backendService.checkIfServiceIsSubscribedByCompany(company.getMainAccountId(), service.getId());
        else
            subscribedServiceResponse = backendService.checkIfServiceIsSubscribedByCompany(company.getId(), service.getId());


        if(!subscribedServiceResponse.getIsServiceSubscribed())
            throw new ForbiddenException("Service is not allowed for this company, Please allow the service from admin portal before making the call");

        IsServiceHeadSubscribe isServiceHeadSubscribe = backendService.checkIfServiceHeadIsSubscribedByCompany(company.getId(), service.getServiceHeadId());

        if(!isServiceHeadSubscribe.getIsSubscribed())
            throw new ForbiddenException("Service is not subscribed by this company, Please subscribe the service from service listing on portal before making the call");

        if(service.getIsActive() == null || !service.getIsActive())
            throw new BadRequestException("Service is inactive, please activate the service first.");

        if(selectedPackages != null && !selectedPackages.isEmpty()) {
            boolean isEligibleAnnualBundle = false;
            boolean isEligibleServiceBundle = false;
            boolean isValidServicePricing = false;

            if(service.getPricing() == null)
                throw new BadRequestException("Pricing cannot be null for this service");

            List<CompanyPackageSelected> sortedPackageList = selectedPackages.stream()
                    .sorted(Comparator.comparing(CompanyPackageSelected::getActivationDate))
                    .toList();

            double totalPackageAllowedAmount = sortedPackageList.stream()
                    .filter(packageSelected -> packageSelected.getCPackage().getPackageType() == PackageType.SERVICES)
                    .mapToDouble(packageSelected -> packageSelected.getCPackage().getPricePerPeriod())
                    .sum();

            double totalSelectedPackageConsumption = sortedPackageList.stream()
                    .mapToDouble(packageSelected -> packageSelected.getPriceConsumption())
                    .sum();


            checkIfPackageIsActiveAndValidActivationDate(sortedPackageList, isPostpaid, useClientCredentials);

            Instant currentTime = Instant.now();
            for (CompanyPackageSelected selectedPackage : sortedPackageList) {
                Package cPackage = selectedPackage.getCPackage();
                Instant packageActivationTime = selectedPackage.getActivationDate().toInstant();

                if (!isEligibleAnnualBundle && cPackage.getPackageType() == PackageType.ANNUAL
                        && cPackage.getIsActive()
                        && currentTime.isAfter(packageActivationTime)
                        && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod())) {

                    var remainingTransactions = cPackage.getTransactionLimit() - selectedPackage.getTransactionConsumption();

                    if(remainingTransactions > 0) {
                        if(selectedPackage.getPackageStatus() != PackageStatus.ACTIVE)
                            throw new BadRequestException("The Annual package payment is pending, Please pay your package payment to activate your Annual package");

                        HttpStatus status = backendService.updateSelectedPackageConsumption(selectedPackage.getId(), selectedPackage.getTransactionConsumption() + 1, selectedPackage.getPriceConsumption());

                        if (status == HttpStatus.CREATED) {
                            isEligibleAnnualBundle = true;

                            var currentTransactions = selectedPackage.getTransactionConsumption() + 1;
                            var annualPercentageUtilized = (Double.parseDouble(currentTransactions+"") / Double.parseDouble(cPackage.getTransactionLimit().toString())) * 100;

                            log.info("Annual Consumption usage percentage = {}%", annualPercentageUtilized);

                            sendNotificationUsageAlert(company.getId(), cPackage.getPackageType().name(), Double.parseDouble(annualPercentageUtilized+""), selectedPackage.getId());

                            continue;
                        }
                    }
                }

                if (cPackage.getPackageType() == PackageType.SERVICES) {
                    var fixedAndTierSuccessPrice = getTierAndFixPrice(company.getId(), service, cPackage.getPricePerPeriod(), selectedPackage.getPriceConsumption(),
                            200, totalPackageAllowedAmount, totalSelectedPackageConsumption);

                    var tierConsumption = fixedAndTierSuccessPrice.getLeft();
                    var fixedConsumption = fixedAndTierSuccessPrice.getRight();

                    if ((service.getPricingType() == PricingType.RANGES && tierConsumption < 0)
                            || (service.getPricingType() == PricingType.FIXED && fixedConsumption < 0))
                        continue;

                    if (!isEligibleServiceBundle && cPackage.getIsActive()
                            && currentTime.isAfter(packageActivationTime)
                            && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod())
                            && cPackage.getPricePerPeriod() > 0
                            && (tierConsumption >= 0 || fixedConsumption >= 0)) {

                        if(selectedPackage.getPackageStatus() == PackageStatus.ACTIVE)
                            isEligibleServiceBundle = true;
                    }

                    if (!isValidServicePricing
                            && cPackage.getIsActive()
                            && currentTime.isAfter(packageActivationTime)
                            && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod())
                            && (service.getPricingType() == PricingType.FIXED && service.getPricing().getFixedSuccessPrice() != null
                            || service.getPricingType() == PricingType.RANGES && service.getPricing().getPricingTiers() != null)) {

                        if(selectedPackage.getPackageStatus() == PackageStatus.ACTIVE)
                            isValidServicePricing = true;
                    }
                }
            }

            // Check if no annual package with a positive transaction limit was found
            if (!isEligibleAnnualBundle)
                throw new BadRequestException("The annual subscription tier is fully consumed, no sufficient balance to call the service.");

            // Check if no service bundle with a positive transaction limit was found
            if(!isPostpaid && !useClientCredentials) {
                if (!isEligibleServiceBundle)
                    throw new BadRequestException("The Service bundle payment is pending or The service bundle is fully consumed, no sufficient balance to call the service.");

                // Check if no service with a correct pricing type was found
                if (!isValidServicePricing)
                    throw new BadRequestException("Service pricing type is not correct or not configured properly");
            }
        } else {
            throw new BadRequestException("Please subscribe to any Annual package first to start exploring the services. Thank you.");
        }

    }

    private void sendNotificationUsageAlert(Long companyId, String packageType, Double utilizedConsumption, Long companyPackageSelectedId) {
        if(sendConsumptionNotifications) {
            Runnable task = () -> {
                try {
                    for (int threshold : THRESHOLDS) {
                        if (utilizedConsumption >= threshold && utilizedConsumption < threshold + 5) {
                            backendService.sendConsumptionUsageAlert(companyId, packageType, utilizedConsumption, companyPackageSelectedId);
                            break;
                        }
                    }
                } catch (Exception e) {
                    log.error("Error occurred while sending consumption usage alert: {}", e.getMessage());
                }
            };
            executorService.submit(task);
        }
    }


    private Pair<Double, Double> getTierAndFixPrice(Long companyId, Service service, Double packagePrice, Double consumption,
                                                    int status, Double totalPackageAllowedAmount, Double totalSelectedPackageConsumption) {
        double tierSuccessPrice = -1;
        double fixSuccessPrice = -1;

        var serviceConsumptionAmount = backendService.getServiceConsumptionAmountFromHistory(companyId, service.getId(), ServiceType.PREPAID.name());
        if(service.getPricingType() == PricingType.RANGES) {
            var tierPrice = calculateTierPrice(status, service.getPricing());
            tierSuccessPrice = totalPackageAllowedAmount - (serviceConsumptionAmount.doubleValue() + tierPrice);
        }
        else if(service.getPricingType() == PricingType.FIXED) {
            var fixPrice = calculateFixedPrice(status, service.getPricing());
            fixSuccessPrice = totalPackageAllowedAmount - (totalSelectedPackageConsumption + fixPrice + serviceConsumptionAmount.doubleValue());
        }

        return Pair.of(tierSuccessPrice, fixSuccessPrice);
    }

    private Pair<Double, Double> getTierAndFixPrice(Long companyId, Service service, Double packagePrice, Double consumption, int status, Double totalPackageAllowedAmount) {
        double tierSuccessPrice = -1;
        double fixSuccessPrice = -1;

        if(service.getPricingType() == PricingType.RANGES) {
            var serviceConsumptionAmount = backendService.getServiceConsumptionAmountFromHistory(companyId, service.getId(), ServiceType.PREPAID.name());
            var tierPrice = calculateTierPrice(status, service.getPricing());
            tierSuccessPrice = totalPackageAllowedAmount - (serviceConsumptionAmount.doubleValue() + tierPrice);
        }
        else if(service.getPricingType() == PricingType.FIXED) {
            var fixPrice = calculateFixedPrice(status, service.getPricing());
            fixSuccessPrice = packagePrice - (consumption + fixPrice);
        }

        return Pair.of(tierSuccessPrice, fixSuccessPrice);
    }

    public Long deductServicePrice(Service service, int status, long companyId, Boolean useClientCredentials,
                                   String companyName, String companyUnifiedNationalNumber, String errorCode, String errorDescription,
                                   Long mainAccountId, String accountType, Boolean useMainAccountBundles) {
        List<CompanyPackageSelected> selectedPackages = getCompanySelectedPackages(companyId, mainAccountId, accountType, useMainAccountBundles);
        List<CompanyPackageSelected> sortedPackageList = selectedPackages.stream()
                .sorted(Comparator.comparing(CompanyPackageSelected::getActivationDate))
                .toList();

        double totalPackageAllowedAmount = sortedPackageList.stream()
                .filter(packageSelected -> packageSelected.getCPackage().getPackageType() == PackageType.SERVICES)
                .mapToDouble(packageSelected -> packageSelected.getCPackage().getPricePerPeriod())
                .sum();

        AtomicReference<Boolean> isEligibleServiceBundle = new AtomicReference<>(false);

        Long selectedPackageId = null;
        double oldPackageRemainingAmount = 0;
        Instant currentTime = Instant.now();
        for(CompanyPackageSelected selectedPackage: sortedPackageList) {
            Package cPackage = selectedPackage.getCPackage();
            Pricing pricing = service.getPricing();
            Instant packageActivationTime = selectedPackage.getActivationDate().toInstant();

            if(pricing != null && cPackage.getPackageType() == PackageType.SERVICES) {
                selectedPackageId = selectedPackage.getId();
                var fixedAndTierSuccessPrice = getTierAndFixPrice(companyId, service, cPackage.getPricePerPeriod(), selectedPackage.getPriceConsumption(), status, totalPackageAllowedAmount);
                var tierConsumption = fixedAndTierSuccessPrice.getLeft();
                var fixedConsumption = fixedAndTierSuccessPrice.getRight();

                if((service.getPricingType() == PricingType.RANGES && tierConsumption < 0)
                        || (service.getPricingType() == PricingType.FIXED && fixedConsumption < 0)) {

                    oldPackageRemainingAmount += (cPackage.getPricePerPeriod() - selectedPackage.getPriceConsumption());

                    if(oldPackageRemainingAmount > 0 && service.getPricingType() == PricingType.FIXED) {
                        selectedPackage.setPriceConsumption(cPackage.getPricePerPeriod());
                        HttpStatus httpStatus = backendService.updateSelectedPackageConsumption(selectedPackage.getId(), selectedPackage.getTransactionConsumption(), selectedPackage.getPriceConsumption());
                        if (httpStatus == HttpStatus.CREATED)
                            log.info("Consumption Price from old package is successfully updated");
                    }
                    continue;
                }

                if(!isEligibleServiceBundle.get()
                        && (tierConsumption >= 0 || fixedConsumption >= 0)
                        && cPackage.getIsActive()
                        && currentTime.isAfter(packageActivationTime)
                        && selectedPackage.getPackageStatus() == PackageStatus.ACTIVE
                        && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod())) {

                    selectedPackageId = selectedPackage.getId();

                    if (!pricing.getIsTier()) {  //Fixed pricing
                        var calculatedFixedPrice = calculateFixedPrice(status, pricing);
                        selectedPackage.setPriceConsumption(selectedPackage.getPriceConsumption() + calculatedFixedPrice - oldPackageRemainingAmount);

                        HttpStatus httpStatus = backendService.updateSelectedPackageConsumption(selectedPackage.getId(),
                                selectedPackage.getTransactionConsumption(), selectedPackage.getPriceConsumption());
                        if (httpStatus == HttpStatus.CREATED) {
                            log.info("Consumption Price for selected package is successfully added");
                            isEligibleServiceBundle.set(true);
                            oldPackageRemainingAmount = 0;

                            var servicePercentageUtilized = (selectedPackage.getPriceConsumption() / cPackage.getPricePerPeriod()) * 100;
                            log.info("Service Consumption usage percentage = {}%", servicePercentageUtilized);

                            sendNotificationUsageAlert(companyId, cPackage.getPackageType().name(), servicePercentageUtilized, selectedPackageId);
                        }

                    } else {    // Tier Pricing
                        addTransactionConsumptionHistory(service, companyId, status, true, ServiceType.PREPAID,
                                false, useClientCredentials, selectedPackageId, companyName, companyUnifiedNationalNumber,
                                errorCode, errorDescription, status, mainAccountId, accountType, useMainAccountBundles);
                        isEligibleServiceBundle.set(true);
                        oldPackageRemainingAmount = 0;
                        log.info("Tier Consumption is successfully added in consumption history");
                    }

                }
            }
        }

        if(!isEligibleServiceBundle.get())
            throw new BadRequestException("The service bundle is fully consumed, no sufficient balance to call the service.");

        return selectedPackageId;
    }

    public void addTransactionConsumptionHistory(Service service, long companyId, int status, boolean isTier,
                                                 ServiceType serviceType, boolean isMockup,
                                                 boolean clientCredentialUsed, Long companyPackageSelectedId,
                                                 String companyName, String companyUnifiedNationalNumber, String errorCode,
                                                 String errorDescription, Integer responseCode, Long mainAccountId,
                                                 String accountType, Boolean useMainAccountBundles) {
        double calculatedPrice = isTier ? calculateTierPrice(status, service.getPricing()) : calculateFixedPrice(status, service.getPricing());

        backendService.addTransactionConsumptionHistory(companyId, service.getId(), BigDecimal.valueOf(calculatedPrice),
                isTier, isSuccess(status) ? TransactionStatus.SUCCESS: TransactionStatus.FAILED, serviceType, isMockup,
                clientCredentialUsed, companyPackageSelectedId, service.getPricing().getId(), companyName, companyUnifiedNationalNumber,
                service.getName(), service.getServiceCode(), errorCode, errorDescription, responseCode,
                mainAccountId, accountType, useMainAccountBundles);
    }

    private double calculateTierPrice(int status, Pricing pricing) {
        List<PricingTier> pricingTiers = pricing.getPricingTiers();

        if(pricingTiers != null && !pricingTiers.isEmpty()) {
            // Sort the pricing tiers based on pricing
            List<PricingTier> sortedPricingTiers = pricingTiers.stream()
                    .sorted(Comparator.comparing(PricingTier::getPrice))
                    .toList();

            double calculatedTierPrice = sortedPricingTiers.get(0).getPrice();

            if (!isSuccess(status)) {
                calculatedTierPrice = calculateFailurePrice(pricing, calculatedTierPrice);
            }
            return calculatedTierPrice;
        }
        return 0;
    }

    private double calculateFixedPrice(int status, Pricing pricing) {
        double calculatedFixedPrice = 0;

        if (isSuccess(status)) {
            if(pricing.getFixedSuccessPrice() != null) {
                calculatedFixedPrice = pricing.getFixedSuccessPrice();
            }
        } else {
            calculatedFixedPrice = calculateFailurePrice(pricing, pricing.getFixedSuccessPrice());
        }
        return calculatedFixedPrice;
    }

    private double calculateFailurePrice(Pricing pricing, double successPrice) {
        double calculatedPricePerPeriod = 0;

        var failurePrice = pricing.getFixedFailurePrice();
        var failurePricePercentage = pricing.getFailurePricePercentage();

        if(failurePrice != null && failurePrice > 0) {
            calculatedPricePerPeriod = failurePrice;
        } else if(failurePricePercentage != null && failurePricePercentage > 0) {
            calculatedPricePerPeriod = (successPrice * failurePricePercentage) / 100;
        }
        return calculatedPricePerPeriod;
    }

    private boolean isSuccess(int status) {
        return status >= 200 && status < 300;
    }

    private void checkIfPackageIsActiveAndValidActivationDate(List<CompanyPackageSelected> packages, Boolean isPostpaid, Boolean useClientCredentials) {
        Instant currentTime = Instant.now();

        // Filter the list to get only active packages
        List<CompanyPackageSelected> activePackages = packages.stream()
                .filter(selectedPackage -> selectedPackage.getCPackage().getIsActive())
                .toList();

        // Check if there are any active annual packages
        if (activePackages.stream().noneMatch(selectedPackage -> selectedPackage.getCPackage().getPackageType() == PackageType.ANNUAL)) {
            throw new BadRequestException("The annual subscription tier is not active");
        }

        // Check if there are any active service packages
        if(!isPostpaid && !useClientCredentials) {
            if (activePackages.stream().noneMatch(selectedPackage -> selectedPackage.getCPackage().getPackageType() == PackageType.SERVICES)) {
                throw new BadRequestException("The service bundle is not active");
            }
        }


        // Check if there are any valid annual packages
        if (activePackages.stream().filter(selectedPackage -> selectedPackage.getCPackage().getPackageType() == PackageType.ANNUAL).noneMatch(selectedPackage -> {
            Package cPackage = selectedPackage.getCPackage();
            Instant packageActivationTime = selectedPackage.getActivationDate().toInstant();
            return currentTime.isAfter(packageActivationTime)
                    && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod());
        })) {
            throw new BadRequestException("The annual package period is not valid or expired, please renew your package or select a new package");
        }

        // Check if there are any valid service packages
        if(!isPostpaid && !useClientCredentials) {
            if (activePackages.stream().filter(selectedPackage -> selectedPackage.getCPackage().getPackageType() == PackageType.SERVICES).noneMatch(selectedPackage -> {
                Package cPackage = selectedPackage.getCPackage();
                Instant packageActivationTime = selectedPackage.getActivationDate().toInstant();
                return currentTime.isAfter(packageActivationTime)
                        && checkIfPackagePeriodIsValid(packageActivationTime, cPackage.getPackagePeriod());
            })) {
                throw new BadRequestException("The service package period is not valid or expired, please renew your package or select a new package");
            }
        }

    }

    private boolean checkIfPackagePeriodIsValid(Instant packageActivationTime, PackagePeriod packagePeriod) {
        Instant currentTime = Instant.now();

        long daysDifference = Duration.between(packageActivationTime, currentTime).toDays();

        if (packagePeriod == PackagePeriod.MONTHLY && daysDifference <= 30)
            return true;

        if (packagePeriod == PackagePeriod.QUARTERLY && daysDifference <= 90)
            return true;

        return packagePeriod == PackagePeriod.YEARLY && daysDifference <= 365;
    }


}
