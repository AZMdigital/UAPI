package com.azm.apihub.backend.notifications.scheduler;

import com.azm.apihub.backend.companies.enums.AccountType;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.consumption.models.ConsumptionInvoiceRequest;
import com.azm.apihub.backend.consumption.models.ServiceConsumptionDetailResponse;
import com.azm.apihub.backend.consumption.models.ServiceConsumptionResponse;
import com.azm.apihub.backend.consumption.repository.ServiceConsumptionHistoryRepository;
import com.azm.apihub.backend.consumption.services.ConsumptionService;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyRep;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ScheduledTasks {

    private final ConsumptionService consumptionService;
    private final CompanyRepository companyRepository;
    private final ServiceConsumptionHistoryRepository serviceConsumptionHistoryRepository;
    private final EmailTemplateBuilder emailTemplateBuilder;

    @Autowired
    public ScheduledTasks(ConsumptionService consumptionService,
                          CompanyRepository companyRepository, ServiceConsumptionHistoryRepository serviceConsumptionHistoryRepository,
                          EmailTemplateBuilder emailTemplateBuilder) {
        this.consumptionService = consumptionService;
        this.companyRepository = companyRepository;
        this.serviceConsumptionHistoryRepository = serviceConsumptionHistoryRepository;
        this.emailTemplateBuilder = emailTemplateBuilder;
    }

//    @Scheduled(cron = "0 0/1 * * * ?")  //Every 1 Minute
    @Scheduled(cron = "${notifications.invoice-schedule}")
    public void sendExportHistoryLogs() {
        var start = System.currentTimeMillis();
        log.info("Send invoice notifications Started @ : {}", Instant.now());
        log.info("Getting all users from database");

        List<Company> companies = companyRepository.findAllByIsDeletedFalseAndAccountTypeOrderByIdDesc(AccountType.MAIN.name());

        LocalDate currentDate = LocalDate.now();
        LocalDate lastMonthDate = currentDate.minusMonths(1);

        int lastMonth = lastMonthDate.getMonthValue();
        int year = lastMonthDate.getYear();

        if(companies != null && !companies.isEmpty()) {
            companies.forEach(company -> {
                CompanyRep companyRep = company.getCompanyRep();
                String sendToEmail = companyRep.getEmail();
                Long companyId = company.getId();
                log.info("Generating invoice for user: {}", sendToEmail);
                ServiceConsumptionDetailResponse consumptionDetails = consumptionService.getConsumptionDetails(companyId, lastMonth, year, null);

                if(consumptionDetails != null) {
                    log.info("Sending invoice to user: {}", sendToEmail);
                    emailTemplateBuilder.buildConsumptionInvoiceEmail(
                            consumptionDetails,
                            "consumption_invoice_template.html", currentDate.toString(), sendToEmail);
                    log.info("Invoice is sent to user: {}", companyRep.getEmail());
                }
            });
        }

        var end = System.currentTimeMillis();
        var timeTook = end - start;
        log.info("Send Invoice Notifications Took {}s", timeTook);
    }

//    @Scheduled(cron = "0 0/1 * * * ?")  //Every 1 Minute
    @Scheduled(cron = "${notifications.generate-invoice-schedule}")
    public void generateInvoiceForLastMonth() {
        var start = System.currentTimeMillis();
        log.info("Job: Generating invoices for last month Started @ : {}", Instant.now());


        LocalDate currentDate = LocalDate.now();
        LocalDate lastMonthDate = currentDate.minusMonths(1);

//        int lastMonth = 10;
        int lastMonth = lastMonthDate.getMonthValue();
        int year = lastMonthDate.getYear();

        log.info("job: Getting accounts to generate invoices");
        List<Long> companyIds = serviceConsumptionHistoryRepository.findDistinctCompanyIds(year, lastMonth);

        if(companyIds != null && !companyIds.isEmpty()) {
            log.info("Job: Got {} accounts", companyIds.size());
            companyIds.forEach(companyId -> {
                log.info("Job: Getting consumption due amount for company {} for period {}-{}", companyId, lastMonth, year);
                List<ServiceConsumptionResponse> dueAmounts = consumptionService.getConsumptionListing(companyId, lastMonth, year);
                if(dueAmounts != null && !dueAmounts.isEmpty()) {
                    List<ServiceConsumptionResponse> filteredDueAmounts = dueAmounts.stream()
                            .filter(response -> !response.getInvoiceGenerated())
                            .toList();

                    if(!filteredDueAmounts.isEmpty()) {
                        log.info("Job: Generating invoice for company {} for period {}-{}", companyId, lastMonth, year);
                        consumptionService.generateInvoiceForCompany(companyId, new ConsumptionInvoiceRequest(lastMonth, year, BigDecimal.valueOf(filteredDueAmounts.get(0).getDueAmount())));
                        log.info("Job: Invoice generated for company {} for period {}-{}", companyId, lastMonth, year);
                    }
                } else {
                    log.info("Job: No consumption found for this company {} for period {}-{} to generate invoice", companyId, lastMonth, year);
                }
            });
        }

        var end = System.currentTimeMillis();
        var timeTook = end - start;
        log.info("Job: Generating invoices for last month Ended @ : {} and took {}", Instant.now(), timeTook);
    }

//    @Scheduled(cron = "0 0/1 * * * ?")  //Every 1 Minute
    @Scheduled(cron = "${notifications.prepaid-update-consumption-schedule}")
    public void updatePrepaidRangesConsumptionForLastMonth() {
        var start = System.currentTimeMillis();
        log.info("Prepaid-Job: Updating prepaid consumption for ranges in selected packages for last month Started @ : {}", Instant.now());

        LocalDate currentDate = LocalDate.now();
        LocalDate lastMonthDate = currentDate.minusMonths(1);

//        int lastMonth = 10;
        int lastMonth = lastMonthDate.getMonthValue();
        int year = lastMonthDate.getYear();

        log.info("Prepaid-Job: Getting accounts to update prepaid consumption ranges in selected packages");
        List<Long> companyIds = serviceConsumptionHistoryRepository.findDistinctCompanyIds(year, lastMonth);

        if(companyIds != null && !companyIds.isEmpty()) {
            log.info("Prepaid-Job: Got {} accounts", companyIds.size());
            companyIds.forEach(companyId -> {
                log.info("Prepaid-Job: Updating consumption in selected packages for company {} for period {}-{}", companyId, lastMonth, year);
                consumptionService.updateCompanyPackageSelectedRangesConsumption(companyId, year, lastMonth);
            });
        }

        var end = System.currentTimeMillis();
        var timeTook = end - start;
        log.info("Prepaid-Job: Updating prepaid consumption for ranges for last month Ended @ : {} and took {}", Instant.now(), timeTook);
    }
}
