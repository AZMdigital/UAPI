package com.azm.apihub.integrations.utils;

public class IntegrationConstants {

    public static final String SIMAH_SERVICES = "Simah Services";
    public static final String WATHQ_ATTORNEY_SERVICE = "Power Of Attorney Services";
    public static final String WATHQ_REAL_ESTATE_SERVICE = "Real Estates Deeds Services";
    public static final String ADDRESS_BY_ID_SERVICE = "Address By ID Service";
    public static final String MOBILE_NUMBER_VERIFICATION_SERVICE = "Mobile number verification service";
    public static final String NAFATH_SERVICES = "Nafath services";
    public static final String FINGERPRINT_VERIFICATION_SERVICE = "Fingerprint verification service";
    public static final String CR_COMMERCIAL_REGISTRATION_SERVICE = "Commercial Registration Services";
    public static final String COMPANY_CONTRACTS_SERVICES = "Article of Association";
    public static final String NATIONAL_ADDRESS_SERVICES = "National Address";
    public static final String YAKEEN_SERVICE = "Yakeen Service";
    public static final String ETIMAD_SERVICE = "Etimad Service";
    public static final String MOFEED_SERVICE = "Mofeed Services";
    public static final String AKEED_SERVICE = "Akeed Services";
    public static final String UNIFONIC_SERVICE = "Unifonic Services";
    public static final String MSEGAT_SERVICE = "Msegat Services";
    public static final String EDAAT_SERVICE = "Edaat Services";
    public static final String LEAN_SERVICE = "LEAN Services";
    public static final String DEEWAN_SMS_SERVICE = "Deewan Sms Services";
    public static final String DEEWAN_CONVERSATION_SERVICE = "Deewan Conversation Services";
    public static final String CONTRACTS_SERVICE = "Contracts Services";
    public static final String ABYAN_SERVICE = "Abyan Services";
    public static final String NEOTEK_SERVICE = "Neotek Services";

    public static final String CUSTOM_HEADERS_KEY = "custom-headers";

    public static class SwaggerConstants {
        public static final String SIMAH = "simah";
        public static final String WATHQ_REAL_ESTATE = "wathqRealEstate";
        public static final String WATHQ_ATTORNEY = "wathqAttorney";
        public static final String TCC_MOBILE_NUMBER_VERIFICATION = "tccMnv";
        public static final String TCC_FINGERPRINT_VERIFICATION = "tccFingerprint";
        public static final String TCC_NAFATH = "nafath";
        public static final String TCC_ADDRESS_BY_ID = "tccAddressById";
        public static final String COMMERCIAL_REGISTRATION = "commercialRegistration";
        public static final String COMPANY_CONTRACTS = "companyContracts";
        public static final String NATIONAL_ADDRESS = "nationalAddress";
        public static final String YAKEEN = "yakeen";
        public static final String ETIMAD = "etimad";
        public static final String MOFEED = "mofeed";
        public static final String AKEED = "akeed";
        public static final String UNIFONIC = "unifonic";
        public static final String MSEGAT = "msegat";
        public static final String SADAD = "sadad";
        public static final String LEAN_OPEN_BANKING = "leanOpenBanking";
        public static final String DEEWAN = "deewan";
        public static final String DEEWAN_CONVERSATION = "deewanConversation";
        public static final String CONTRACTS = "contracts";
        public static final String ABYAN = "abyan";
        public static final String NEOTEK_OPEN_BANKING = "neotekOpenBanking";

    }

    public static class HeaderConstants {
        public static final String CREDENTIALS_WITH_APP_SECRETS = "CREDENTIALS_WITH_APP_SECRETS";
        public static final String BASIC_CREDENTIALS = "BASIC_CREDENTIALS";
        public static final String BEARER_TOKEN = "BEARER_TOKEN";
        public static final String APP_ID = "app-id";
        public static final String APP_KEY = "app-key";
        public static final String USERNAME = "Username";
        public static final String PASSWORD = "Password";
        public static final String API_KEY = "apiKey";
        public static final String AUTHORIZATION = "Authorization";
    }

    public static class UAPIErrorCodes {
        private static final String ERROR_PREFIX = "UAPI-";
        public static final String U_API_BAD_REQUEST = ERROR_PREFIX+"400";
        public static final String U_API_UNAUTHORIZED = ERROR_PREFIX+"401";
        public static final String U_API_HTTP_CLIENT_ERROR = ERROR_PREFIX+"402";
        public static final String U_API_FORBIDDEN = ERROR_PREFIX+"403";
        public static final String U_API_NOT_FOUND = ERROR_PREFIX+"404";
        public static final String U_API_INTERNAL_SERVER_ERROR = ERROR_PREFIX+"500";
    }
}
