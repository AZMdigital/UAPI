package com.azm.apihub.backend.notifications.emailTemplateBuilder;

import com.azm.apihub.backend.consumption.models.ServiceConsumptionDetail;
import com.azm.apihub.backend.consumption.models.ServiceConsumptionDetailResponse;
import com.azm.apihub.backend.entities.CompanyRep;
import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.invoices.enums.SlipStatus;
import com.azm.apihub.backend.notifications.ResetPassword.services.EmailService;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmailTemplateBuilder {

    private @Value("${notifications.operation-email}") String operationEmail;
    private @Value("${notifications.operation-mobile-number}") String operationMobileNumber;
    private @Value("${notifications.name}") String companyName;
    private @Value("${notifications.dev-portal-url}") String developerPortalUrl;
    private @Value("${notifications.admin-portal-url}") String adminPortalUrl;
    private final EmailService emailService;

    @Autowired
    public EmailTemplateBuilder(EmailService emailService) {
        this.emailService = emailService;
    }

    public Map<String, String> buildUserDataMap(User user, String baseUrl, String token, String password) {
        String resetUrl = "";
        String setPasswordUrl = "";
        if(token != null) {
            resetUrl = baseUrl + "reset-password/token=" + token + "&email=" + user.getEmail();
            setPasswordUrl = baseUrl + "set-password/token=" + token + "&email=" + user.getEmail();
        }

        return Map.ofEntries(
                Map.entry("first_name", user.getFirstName()),
                Map.entry("last_name", user.getLastName()),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("username", user.getUsername()),
                Map.entry("email", user.getEmail()),
                Map.entry("password", password != null ? password : ""),
                Map.entry("password_reset_link", resetUrl),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber),
                Map.entry("Your_company_name", companyName),
                Map.entry("password_set_link", setPasswordUrl)

        );
    }

    public Map<String, String> buildUserForReactivation(User user, String url) {
        return Map.ofEntries(
                Map.entry("first_name", user.getFirstName()),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("last_name", user.getLastName()),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber),
                Map.entry("Your_company_name", companyName)
        );
    }

    public Map<String, String> buildConsumptionNotificationMap(CompanyRep companyRep, String packageType, Double consumptionPercentage) {
        return Map.ofEntries(
                Map.entry("first_name", companyRep.getFirstName()),
                Map.entry("last_name", companyRep.getLastName()),
                Map.entry("package_type", packageType),
                Map.entry("consumption", consumptionPercentage.toString()),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber)
        );
    }

    public Map<String, String> buildInvoiceTemplate(String issueDate, String invoiceNumber, ServiceConsumptionDetailResponse consumptionDetails) {

        StringBuilder tableRows = new StringBuilder();
        Double totalAmount = 0.0;
        Long totalTransactions = 0L;
        if(consumptionDetails.getServiceConsumptionDetailList() != null && !consumptionDetails.getServiceConsumptionDetailList().isEmpty()) {
            for (ServiceConsumptionDetail detail : consumptionDetails.getServiceConsumptionDetailList()) {
                tableRows.append("<tr>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getServiceCode()).append("</span></td>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getServiceName()).append("</span></td>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getSuccessTransaction()).append("</span></td>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getFailedTransactions()).append("</span></td>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getTotalTransactions()).append("</span></td>");
                tableRows.append("<td><span style=\"color: steelblue;\">").append(detail.getTotalAmount()).append(" SAR</span></td>");
                tableRows.append("</tr>");
                totalAmount += detail.getTotalAmount();
                totalTransactions += detail.getTotalTransactions();
            }
        }

        LocalDate paymentDate = LocalDate.of(consumptionDetails.getYear(), consumptionDetails.getMonth(), 1);

        String from = paymentDate.toString();
        String to = paymentDate.plusMonths(1).toString();
        String maxPayDate = paymentDate.plusMonths(1).plusDays(15).toString();
        Map<String, String> dataMap = new HashMap<>();

        dataMap.put("payment_date", maxPayDate);
        dataMap.put("url_link", adminPortalUrl);
        dataMap.put("account_name", consumptionDetails.getAccountName());
        dataMap.put("due_month", Month.of(consumptionDetails.getMonth()).toString());
        dataMap.put("from_date", from);
        dataMap.put("to_date", to);
        dataMap.put("issue_date", issueDate);
        dataMap.put("invoice_number", invoiceNumber);
        dataMap.put("total_amount", totalAmount.toString());
        dataMap.put("max_pay_date", maxPayDate);
        dataMap.put("consumed_transactions", totalTransactions.toString());
        dataMap.put("remaining_transactions", consumptionDetails.getPackageRemaining().toString());
        dataMap.put("dynamic_rows_placeholder", tableRows.toString());
        dataMap.put("total_invoice", totalAmount.toString());
        dataMap.put("operation_email", operationEmail);
        dataMap.put("finance_email", operationEmail);
        dataMap.put("operation_mobile_number", operationMobileNumber);
        dataMap.put("finance_mobile_number", operationMobileNumber);
        dataMap.put("Your_company_name", companyName);

        return dataMap;
    }

    public Map<String, String> buildPackageActivationMap(HashMap<String, String> userDataMap, String packageType, String  packageName) {
        return Map.ofEntries(
                Map.entry("first_name", userDataMap.get("firstName")),
                Map.entry("last_name", userDataMap.get("lastName")),
                Map.entry("package_type", packageType),
                Map.entry("package_name", packageName),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber)
        );
    }

    public Map<String, String> buildSlipStatusMap(HashMap<String, String> userDataMap, String invoiceId, String slipStatus) {
        return Map.ofEntries(
                Map.entry("first_name", userDataMap.get("firstName")),
                Map.entry("last_name", userDataMap.get("lastName")),
                Map.entry("slip_status", slipStatus),
                Map.entry("invoice_number", invoiceId),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber)
        );
    }

    public Map<String, String> buildInvoiceTaxMap(HashMap<String, String> userDataMap, String invoiceId) {
        return Map.ofEntries(
                Map.entry("first_name", userDataMap.get("firstName")),
                Map.entry("last_name", userDataMap.get("lastName")),
                Map.entry("invoice_number", invoiceId),
                Map.entry("url_link", developerPortalUrl),
                Map.entry("operation_email", operationEmail),
                Map.entry("operation_mobile_number", operationMobileNumber)
        );
    }

    public void buildConsumptionInvoiceEmail(ServiceConsumptionDetailResponse consumptionDetails,
                                             String filenameWithExtension, String invoiceIssueDate, String sendToEmail) {
        Map<String, String> invoiceMap = buildInvoiceTemplate(invoiceIssueDate, "01", consumptionDetails);
        String emailBody = buildEmail(invoiceMap, filenameWithExtension);

        String subject = consumptionDetails.getAccountName()+" Consumption Monthly Invoice of UAPI - "+consumptionDetails.getMonth()+"-"+consumptionDetails.getYear();
        emailService.sendEmail(sendToEmail, subject, emailBody);
    }


    public void sendUpdateUserProfileEmail(User user, String filenameWithExtension) {
        Map<String, String> userData = buildUserDataMap(user, developerPortalUrl, null, null);
        String emailBody = buildEmail(userData, filenameWithExtension);

        emailService.sendEmail(user.getEmail(), "Update User's profile", emailBody);
    }

    public void sendAddUserEmail(String password, User user, String filenameWithExtension) {
        Map<String, String> userData = buildUserDataMap(user, developerPortalUrl, null, password);
        String emailBody = buildEmail(userData, filenameWithExtension);

        emailService.sendEmail(user.getEmail(), "Welcome to UAPI!", emailBody);
    }

    public void sendResetPasswordEmail(String baseUrl, String token, User user, String filenameWithExtension) {
        Map<String, String> userData = buildUserDataMap(user, developerPortalUrl, token, null);
        String emailBody = buildEmail(userData, filenameWithExtension);

        emailService.sendEmail(user.getEmail(), "Forgot Password", emailBody);
    }

    public void sendSetPasswordEmail(String token, User user, String filenameWithExtension) {
        Map<String, String> userData = buildUserDataMap(user, developerPortalUrl, token, null);
        String emailBody = buildEmail(userData, filenameWithExtension);
        emailService.sendEmail(user.getEmail(), "Welcome to UAPI!", emailBody);
    }

    public void sendReActivationEmail(User user, String filenameWithExtension) {
        Map<String, String> userData = buildUserForReactivation(user, developerPortalUrl);
        String emailBody = buildEmail(userData, filenameWithExtension);
        emailService.sendEmail(user.getEmail(), "UAPI - Your Developer Portal Has Been Reactivated!", emailBody);
    }
    public void sendUpdatePasswordEmail(User user, String password, String filenameWithExtension) {
        Map<String, String> userData = buildUserDataMap(user, developerPortalUrl, null, password);
        String emailBody = buildEmail(userData, filenameWithExtension);

        emailService.sendEmail(user.getEmail(), "Credentials Changed", emailBody);
    }

    public void sendConsumptionUsageNotification(CompanyRep companyRep, String packageType, Double consumptionPercentage,
                                                 String filenameWithExtension) {
        String annualSubject = "UAPI Annual Subscription Tier - "+consumptionPercentage+"% Consumption Alert";
        String serviceSubject = "UAPI Service Bundle Consumption Alert ("+consumptionPercentage+"% Consumed)";
        Map<String, String> consumptionData = buildConsumptionNotificationMap(companyRep, packageType, consumptionPercentage);
        String emailBody = buildEmail(consumptionData, filenameWithExtension);

        emailService.sendEmail(companyRep.getEmail(), Objects.equals(packageType, PackageType.ANNUAL.name()) ? annualSubject : serviceSubject, emailBody);
    }

    public void sendPackageActivationEmail(HashMap<String, String> userDataMap, String packageType, String packageName, String filenameWithExtension) {
        Map<String, String> userData = buildPackageActivationMap(userDataMap, packageType, packageName);
        String emailBody = buildEmail(userData, filenameWithExtension);

        var annualPackageSubject = "UAPI - Annual Subscription Tier Activation";
        var servicePackageSubject = "UAPI - Service Bundle Activation";

        emailService.sendEmail(userDataMap.get("email"), Objects.equals(packageType, PackageType.ANNUAL.name()) ? annualPackageSubject : servicePackageSubject, emailBody);
    }

    public void sendInvoiceSlipStatusEmail(HashMap<String, String> userDataMap, String invoiceId, String invoiceStatus, String filenameWithExtension) {
        Map<String, String> userData = buildSlipStatusMap(userDataMap, invoiceId, invoiceStatus);
        String emailBody = buildEmail(userData, filenameWithExtension);

        var slipStatusAccepted = "Accepted Bank Transfer Slip";
        var slipStatusRejected = "Reject Bank Transfer Slip";

        emailService.sendEmail(userDataMap.get("email"), invoiceStatus.equals(SlipStatus.ACCEPTED.name()) ? slipStatusAccepted : slipStatusRejected, emailBody);
    }

    public void sendProvideTaxInvoiceEmail(HashMap<String, String> userDataMap, String filenameWithExtension) {
        Map<String, String> userData = Map.ofEntries(
                Map.entry("first_name", userDataMap.get("firstName")),
                Map.entry("last_name", userDataMap.get("lastName")));

        String emailBody = buildEmail(userData, filenameWithExtension);
        emailService.sendEmail(userDataMap.get("email"), "Upload Tax Invoice", emailBody);
    }

    public void sendInvoiceTaxEmail(HashMap<String, String> userDataMap, String invoiceId, String filenameWithExtension) {
        Map<String, String> userData = buildInvoiceTaxMap(userDataMap, invoiceId);
        String emailBody = buildEmail(userData, filenameWithExtension);

        var invoiceTaxSubject = "UAPI - Invoice tax is updated";

        emailService.sendEmail(userDataMap.get("email"),invoiceTaxSubject, emailBody);
    }

    public String buildEmail(Map<String, String> userData, String fileNameWithExtension) {
        String emailTemplate = loadTemplateFromFile(fileNameWithExtension);
        try {
            for (Map.Entry<String, String> entry : userData.entrySet()) {
                String placeholder = "[" + entry.getKey() + "]";
                String replacement = entry.getValue();
                emailTemplate = emailTemplate.replace(placeholder, replacement);
            }
        } catch (Exception e) {
            log.error("Error building email template: "+e.getMessage());
        }

        return emailTemplate;
    }

    private String loadTemplateFromFile(String templateName) {
        String emailTemplate = "";
        InputStream is = EmailTemplateBuilder.class.getResourceAsStream("/raw/templates/"+templateName);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            emailTemplate =  reader.lines().collect(Collectors.joining(System.lineSeparator()));
        }
        return emailTemplate;
    }

    private String parseDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d-M-yyyy");

        try {
            LocalDate date = LocalDate.parse(dateString, formatter);
            return date.toString();
        } catch (Exception e) {
            log.error("Error parsing date: " + e.getMessage());
        }
        return "";
    }
}
