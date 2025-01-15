package com.azm.apihub.integrations.digitalsignature.services;

public interface DigitalSignatureService {
    public byte[] sign(byte[] data) throws Exception;
    public boolean verify(byte[] data, byte[] signedData) throws Exception;
}
