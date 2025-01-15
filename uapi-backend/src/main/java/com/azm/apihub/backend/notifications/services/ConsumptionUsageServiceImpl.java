package com.azm.apihub.backend.notifications.services;

import com.azm.apihub.backend.companies.repository.CompanyPackageSelectedRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyPackageSelected;
import com.azm.apihub.backend.entities.CompanyRep;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class ConsumptionUsageServiceImpl implements ConsumptionUsageService {
    private final EmailTemplateBuilder emailTemplateBuilder;
    private final CompanyRepRepository companyRepRepository;
    private final CompanyRepository companyRepository;
    private final CompanyPackageSelectedRepository companyPackageSelectedRepository;

    @Autowired
    public ConsumptionUsageServiceImpl(EmailTemplateBuilder emailTemplateBuilder,
                                       CompanyRepRepository companyRepRepository,
                                       CompanyRepository companyRepository,
                                       CompanyPackageSelectedRepository companyPackageSelectedRepository) {
        this.emailTemplateBuilder = emailTemplateBuilder;
        this.companyRepRepository = companyRepRepository;
        this.companyRepository = companyRepository;
        this.companyPackageSelectedRepository = companyPackageSelectedRepository;
    }

    @Override
    public void sendConsumptionUsageNotification(Long companyId, String packageType, Double consumptionPercentage, Long companyPackageSelectedId) {
        if (consumptionPercentage >= 50 && consumptionPercentage < 55) {
            sendAlert(companyId, companyPackageSelectedId, 50D, packageType, "consumption_notification_template_50.html");
        }
        else if (consumptionPercentage >= 80 && consumptionPercentage < 85) {
            sendAlert(companyId, companyPackageSelectedId, 80D, packageType, "consumption_notification_template_80_95.html");
        }
        else if (consumptionPercentage >= 90 && consumptionPercentage < 93) {
            sendAlert(companyId, companyPackageSelectedId, 90D, packageType, "consumption_notification_template_80_95.html");
        }
        else if (consumptionPercentage >= 95 && consumptionPercentage < 98) {
            sendAlert(companyId, companyPackageSelectedId, 95D, packageType, "consumption_notification_template_80_95.html");
        }
        else if (consumptionPercentage == 100) {
            sendAlert(companyId, companyPackageSelectedId, 100D, packageType, "consumption_notification_template_100.html");
        }
    }

    private void sendAlert(Long companyId, Long companyPackageSelectedId, Double consumption, String packageType, String consumption_email_template) {
        Optional<Company> optionalCompany = companyRepository.findByIdAndIsDeletedFalse(companyId);
        if(optionalCompany.isEmpty())
            throw new BadRequestException("Consumption Alert => Company does not exist");

        Optional<CompanyPackageSelected> optionalCompanyPackageSelected = companyPackageSelectedRepository.findByIdAndCompanyId(companyPackageSelectedId, companyId);
        if(optionalCompanyPackageSelected.isEmpty())
            throw new BadRequestException("Consumption Alert => Company package does not exist");

        Optional<CompanyRep> optionalCompanyRep = companyRepRepository.findById(optionalCompany.get().getCompanyRep().getId());

        if(optionalCompanyRep.isEmpty())
            throw new BadRequestException("Consumption Alert => There is no company representative");

        CompanyRep companyRep = optionalCompanyRep.get();


        CompanyPackageSelected companyPackageSelected = optionalCompanyPackageSelected.get();

        if(companyPackageSelected.getEmailSentThreshold() == null
                && companyPackageSelected.getEmailSentAt() == null) {
            saveAlertAndSendEmail(consumption, packageType, consumption_email_template, companyPackageSelected, companyRep);
        } else if(companyPackageSelected.getEmailSentThreshold() != null
                && companyPackageSelected.getEmailSentThreshold() != consumption.intValue()) {
            saveAlertAndSendEmail(consumption, packageType, consumption_email_template, companyPackageSelected, companyRep);
        } else {
            LocalDateTime emailSentAtLocalDateTime = companyPackageSelected.getEmailSentAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // Check if email was sent more than 1 month ago
            if (ChronoUnit.MONTHS.between(emailSentAtLocalDateTime, LocalDateTime.now()) >= 1) {
                saveAlertAndSendEmail(consumption, packageType, consumption_email_template, companyPackageSelected, companyRep);
            }
        }
    }

    private void saveAlertAndSendEmail(Double consumption, String packageType, String consumption_email_template,
                                       CompanyPackageSelected companyPackageSelected, CompanyRep companyRep) {
        companyPackageSelected.setEmailSentThreshold(consumption.intValue());
        companyPackageSelected.setEmailSentAt(Timestamp.from(Instant.now()));
        companyPackageSelectedRepository.save(companyPackageSelected);

        log.info("Sending consumption alert of {} package of usage {}% to {}", packageType, consumption, companyRep.getEmail());
        emailTemplateBuilder.sendConsumptionUsageNotification(companyRep, packageType, consumption,
                consumption_email_template);
    }
}
