package com.azm.apihub.integrations.digitalsignature.enums;


import com.azm.apihub.integrations.abyan.models.CompanySearchRequest;
import com.azm.apihub.integrations.abyan.models.SearchRequest;
import com.azm.apihub.integrations.abyan.models.SearchResultDetailRequest;
import com.azm.apihub.integrations.contracts.models.UpdateContractStatusRequest;
import com.azm.apihub.integrations.contracts.models.UploadContractRequest;
import com.azm.apihub.integrations.contracts.models.UploadContractWithSanadRequest;
import com.azm.apihub.integrations.deewan.conversation.models.ConversationSendMediaMessageRequest;
import com.azm.apihub.integrations.deewan.conversation.models.ConversationSendMessageRequest;
import com.azm.apihub.integrations.deewan.conversation.models.ConversationSendMessageResponse;
import com.azm.apihub.integrations.deewan.models.DeewanSendSmsRequestBody;
import com.azm.apihub.integrations.deewan.models.DeewanSendSmsResponse;
import com.azm.apihub.integrations.edaat.models.invoice.InvoiceRequest;
import com.azm.apihub.integrations.lean.models.AccountVerificationRequest;
import com.azm.apihub.integrations.lean.models.AccountVerificationResponse;
import com.azm.apihub.integrations.msegat.models.MsegatRequest;
import com.azm.apihub.integrations.simah.ce.models.request.ConsumerEnquiryRequest;
import com.azm.apihub.integrations.tcc.addressById.models.AddressByIdRequest;
import com.azm.apihub.integrations.tcc.fingerprintVerification.models.FingerprintVerificationRequest;
import com.azm.apihub.integrations.tcc.mobileNumberVerification.models.MobileNumberVerificationRequest;
import com.azm.apihub.integrations.tcc.nafath.models.NafathLoginRequest;

public enum ApiTag {
    SIMAH_CONSUMER_ENQUIRY(ConsumerEnquiryRequest.class),
    TCC_ADDRESS_BY_ID(AddressByIdRequest.class),
    TCC_FINGERPRINT_VERIFICATION(FingerprintVerificationRequest.class),
    TCC_NAFATH_LOGIN(NafathLoginRequest.class),
    TCC_VERIFY_MOBILE(MobileNumberVerificationRequest.class),
    MSEGAT_SEND_SMS(MsegatRequest.class),
    EDAAT_INVOICE(InvoiceRequest.class),
    LEAN_OPEN_BANKING(AccountVerificationRequest.class),
    DEEWAN_SMS(DeewanSendSmsRequestBody.class),
    DEEWAN_CONVERSATION(ConversationSendMessageRequest.class),
    DEEWAN_CONVERSATION_MEDIA(ConversationSendMediaMessageRequest.class),
    CONTRACTS_UPLOAD_CONTRACT(UploadContractRequest .class),
    CONTRACTS_UPLOAD_CONTRACT_WITH_SANAD(UploadContractWithSanadRequest.class),
    CONTRACTS_UPDATE_STATUS(UpdateContractStatusRequest.class),
    ABYAN_POST_SEARCH(SearchRequest.class),
    ABYAN_SEARCH_RESULT_DETAILS(SearchResultDetailRequest.class),
    ABYAN_POST_COMPANY_SEARCH(CompanySearchRequest.class),
    ABYAN_ONLINE_REQUEST_DETAILS(SearchResultDetailRequest.class);

    private Class<?> clazz;

    ApiTag(Class<?> clazz) {
        this.clazz = clazz;
    }

    public Class<?> getAssociatedClass() {
        return this.clazz;
    }
}