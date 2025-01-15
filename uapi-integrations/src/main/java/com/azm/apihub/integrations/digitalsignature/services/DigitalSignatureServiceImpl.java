package com.azm.apihub.integrations.digitalsignature.services;

import com.azm.apihub.integrations.baseServices.BaseService;
import com.azm.apihub.integrations.digitalsignature.utils.DigitalSignatureUtils;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DigitalSignatureServiceImpl extends BaseService implements DigitalSignatureService {

    private static final String KEYSTORE_PATH = "certificates/keystore.p12";
    private static final String KEYSTORE_PASSWORD = "123456";
    private static final String KEY_ALIAS = "uapikey";

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void init() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        try (InputStream in = this.getClass().getClassLoader().getResourceAsStream(KEYSTORE_PATH)) {
            if (in == null) {
                throw new IOException("Keystore file not found");
            }
            keyStore.load(in, KEYSTORE_PASSWORD.toCharArray());
        }

        privateKey = (PrivateKey) keyStore.getKey(KEY_ALIAS, KEYSTORE_PASSWORD.toCharArray());
    }

    @Override
    public byte[] sign(byte[] data) throws Exception {
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(data);
        return signature.sign();
    }

    @Override
    public boolean verify(byte[] data, byte[] signedData) throws Exception {
        com.azm.apihub.integrations.baseServices.dto.PublicKey publicKeyResult = getPublicKey();
        publicKey = DigitalSignatureUtils.parsePublicKey(publicKeyResult.getFileType(), publicKeyResult.getPublicKey());
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(data);
        return signature.verify(signedData);
    }
}
