package com.azm.apihub.integrations.digitalsignature.utils;

import com.azm.apihub.integrations.digitalsignature.services.DigitalSignatureService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.Objects;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;

import javax.xml.bind.DatatypeConverter;

@UtilityClass
@Slf4j
public class DigitalSignatureUtils {

    public boolean verifyRequestSignature(String signatureBase64, Object request, DigitalSignatureService digitalSignatureService) throws Exception {
        byte[] requestSignature = Base64.getDecoder().decode(signatureBase64);
        String requestData = convertToJsonString(request);

        if (digitalSignatureService.verify(requestData.getBytes(), requestSignature)) {
            log.info("Provided request signature is valid");
            return true;
        }
        log.info("Provided request signature is not valid");
        return false;
    }

    public <T> T getCustomObject(Object request, Class<T> clazz) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return mapper.convertValue(request, clazz);
    }

    public String convertToJsonString(Object request) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
//        mapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
        String requestData = "";
        try {
            requestData = mapper.writeValueAsString(request);
        } catch (Exception e) {
            log.error("Exception occurred during verifying request signature: "+e.getMessage());
            return "";
        }
        return requestData;
    }

    public PublicKey parsePublicKey(String fileType, byte[] data) throws  Exception {
        PublicKey publicKey;

        switch (fileType) {
            case "pem" -> {
                log.info("Executing PEM verification");
                publicKey = getPublicKeyFromPem(data);
            }
            case "csr" -> {
                log.info("Executing CSR verification");
                publicKey = getPublicKeyFromCSR(data);
            }
            default -> {
                log.info("Executing CERTIFICATE verification");
                publicKey = getPublicKeyFromCertificate(data);
            }
        }

        return publicKey;
    }

    public PublicKey getPublicKeyFromPem(byte[] byteData) throws Exception {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(byteData);

        PEMParser pemParser = new PEMParser(new InputStreamReader(inputStream))) {
            Object object = pemParser.readObject();
            pemParser.close();

            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("UAPI");
            if (object instanceof org.bouncycastle.cert.X509CertificateHolder certificateHolder) {
                SubjectPublicKeyInfo publicKeyInfo = certificateHolder.getSubjectPublicKeyInfo();
                return new JcaPEMKeyConverter().getPublicKey(publicKeyInfo);
            }
            return converter.getPublicKey((SubjectPublicKeyInfo) object);
        }
    }

    public static PublicKey getPublicKeyFromCSR(byte[] csrBytes) throws Exception {

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(csrBytes);
             PEMParser pemParser = new PEMParser(new InputStreamReader(inputStream))) {

            Object parsedObject = pemParser.readObject();
            if (parsedObject instanceof PKCS10CertificationRequest) {
                PKCS10CertificationRequest csr = (PKCS10CertificationRequest) parsedObject;

                SubjectPublicKeyInfo publicKeyInfo = csr.getSubjectPublicKeyInfo();
                return new JcaPEMKeyConverter().getPublicKey(publicKeyInfo);
            }
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("UAPI");
            return converter.getPublicKey((SubjectPublicKeyInfo) parsedObject);
        }
    }

    public PublicKey getPublicKeyFromCertificate(byte[] certificateByteData) throws Exception {
        try {
            var pemCertificate = convertToPem(certificateByteData);

            return getPublicKeyFromPem(pemCertificate);
        } catch (CertificateException e) {
            log.error("Some exception occurred while getting public key from certificate file: "+e.getMessage());
        }
        return null;
    }

    public byte[] convertToPem(byte[] certificateByteData) throws Exception {
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        X509Certificate certificate = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(certificateByteData));

        // Write the certificate in PEM format
        ByteArrayOutputStream pemStream = new ByteArrayOutputStream();
        try (Writer writer = new OutputStreamWriter(pemStream, StandardCharsets.US_ASCII)) {
            writer.write("-----BEGIN CERTIFICATE-----\n");
            writer.write(Base64.getMimeEncoder().encodeToString(certificate.getEncoded()));
            writer.write("\n-----END CERTIFICATE-----\n");
        }

        return pemStream.toByteArray();
    }

    public PrivateKey readPrivateKey(String keyFilePath) throws Exception {
        try (FileReader reader = new FileReader(keyFilePath);
             PEMParser pemParser = new PEMParser(reader)) {

            Object object = pemParser.readObject();

            if (object instanceof PEMKeyPair) {
                PrivateKeyInfo privateKeyInfo = ((PEMKeyPair) object).getPrivateKeyInfo();

                return new JcaPEMKeyConverter().getPrivateKey(privateKeyInfo);
            } else if (object instanceof PrivateKey) {
                return (PrivateKey) object;
            }

            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("UAPI");
            return converter.getPrivateKey((PrivateKeyInfo) object);
        }
    }
}
