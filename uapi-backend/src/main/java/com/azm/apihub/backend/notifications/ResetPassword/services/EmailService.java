package com.azm.apihub.backend.notifications.ResetPassword.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate;
    private @Value("${notifications.send-test}") Boolean sendTestMail;
    private @Value("${notifications.send-notifications}") Boolean sendNotifications;
    private @Value("${notifications.send-test-email-to}") String sendTestMailTo;
    private @Value("${notifications.mail.from}") String fromEmail;
    private @Value("${notifications.mail.api-url}") String mailApiUrl;
    private @Value("${notifications.mail.api-key}") String mailApiKey;

    @Autowired
    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendEmail(String toEmail, String subject, String body) {
        if (sendNotifications) {
            String toEmailAddress = sendTestMail ? sendTestMailTo : toEmail;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Zoho-enczapikey " + mailApiKey);

            Map<String, Object> payload = Map.of(
                    "from", Map.of("address", fromEmail),
                    "to", new Map[]{Map.of("email_address", Map.of("address", toEmailAddress))},
                    "subject", subject,
                    "htmlbody", body
            );
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(mailApiUrl, HttpMethod.POST, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("Email sent to: {}", toEmailAddress);
                } else {
                    log.error("Error while sending email: {}", response.getBody());
                }
            } catch (Exception e) {
                log.error("Error while sending email: {}", e.getMessage());
            }
        }
    }
}
