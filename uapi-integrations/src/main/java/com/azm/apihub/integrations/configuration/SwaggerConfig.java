package com.azm.apihub.integrations.configuration;

import com.azm.apihub.integrations.edaat.models.invoice.InvoiceRequest;
import com.azm.apihub.integrations.edaat.models.invoice.InvoiceResponse;
import com.azm.apihub.integrations.etimad.exceptions.ErrorResponse;
import com.azm.apihub.integrations.etimad.models.contractsFroBanks.ContractsForBanksResponse;
import com.azm.apihub.integrations.etimad.models.detailedSalaryCertificates.DetailedSalaryCertificatesResponse;
import com.azm.apihub.integrations.simah.ce.models.response.ConsumerEnquiryResponse;
import com.azm.apihub.integrations.simah.ce.models.request.ConsumerEnquiryRequest;
import com.azm.apihub.integrations.tcc.addressById.models.AddressByIdResponse;
import com.azm.apihub.integrations.tcc.mobileNumberVerification.models.MobileNumberVerficationResponse;
import com.azm.apihub.integrations.utils.IntegrationConstants;
import com.azm.apihub.integrations.wathq.attorney.models.InfoSuccessResponse;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.AddressDetailsResponse;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.fullInfo.FullInfoResponse;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.info.CommercialRegistrationBasicDataResponse;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.managers.ManagersRespons;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.owners.OwnerResponse;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.related.Related;
import com.azm.apihub.integrations.wathq.commercialRegistration.models.status.StatusResponse;
import com.azm.apihub.integrations.wathq.companyContracts.models.info.ContractInfoSuccessResponse;
import com.azm.apihub.integrations.wathq.companyContracts.models.lookup.LookupResponse;
import com.azm.apihub.integrations.wathq.companyContracts.models.managementInfo.ManagementSuccessResponse;
import com.azm.apihub.integrations.wathq.companyContracts.models.managerInfo.ManagerSuccessResponse;
import com.azm.apihub.integrations.wathq.realestate.models.DeedSuccessResponse;
import com.azm.apihub.integrations.yakeen.models.NonSaudiByIqamaResponse;
import com.azm.apihub.integrations.yakeen.models.PersonNationalAddressInfo;
import com.azm.apihub.integrations.yakeen.models.SaudiByNinData;
import com.azm.apihub.integrations.yakeen.models.VisitorByVisaResponse;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.ArraySchema;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
public class SwaggerConfig {

    private @Value("${swagger.server.url}")  String serverUrl;

    @Bean
    public GroupedOpenApi simahOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.simah"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.SIMAH)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/simah/**", "/v1/simah-lookup/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("SIMAH OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi wathqRealEstateOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.wathq.realestate"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.WATHQ_REAL_ESTATE)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/ministry-of-justice/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("WATHQ OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi wathqAttorneyOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.wathq.attorney"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.WATHQ_ATTORNEY)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/ministry-of-justice/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("WATHQ OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi tccMobileNumberVerificationOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.tcc.mobileNumberVerification"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.TCC_MOBILE_NUMBER_VERIFICATION)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/sdaia/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("TCC Mobile number verification OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi tccAddressByIdOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.tcc.addressById"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.TCC_ADDRESS_BY_ID)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/sdaia/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("TCC Address By Id OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi commercialRegistrationOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.wathq.commercialRegistration"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.COMMERCIAL_REGISTRATION)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/ministry-of-commerce/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();

        log.info("Commercial Registration OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi companyContractsOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.wathq.companyContracts"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.COMPANY_CONTRACTS)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/ministry-of-commerce/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Company Contracts OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi nationalAddressOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.wathq.nationalAddress"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.NATIONAL_ADDRESS)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/saudi-post/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("National Address OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi yakeenOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.yakeen"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.YAKEEN)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/elm/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Yakeen OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi etimadOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.etimad"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.ETIMAD)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/ncgr/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Etimad OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi mofeedOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.masdr.mofeed"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.MOFEED)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/gosi/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Mofeed OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi akeedOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.masdr.akeed"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.AKEED)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/gosi/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Akeed OpenApi configured: " + groupedOpenApi.getGroup());

        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi tccFingerprintVerificationOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.tcc.fingerprintVerification"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.TCC_FINGERPRINT_VERIFICATION)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/sdaia/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("TCC Fingerprint verification OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi tccNafathOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.tcc.nafath"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.TCC_NAFATH)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/sdaia/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("TCC Nafath OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi unifonicOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.unifonic"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.UNIFONIC)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/unifonic/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Unifonic OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi msegatOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.msegat"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.MSEGAT)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/msegat/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Msegat OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi edaatOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.edaat"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.SADAD)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/sadad/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Edaat OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi leanOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.lean"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.LEAN_OPEN_BANKING)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/lean/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("LEAN OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi deewanSmsOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.deewan"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.DEEWAN)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/deewan/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Deewan Sms OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi ContractsOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.contracts"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.CONTRACTS)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/contracts/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Contracts OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi AbyanOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.abyan"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.ABYAN)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/abyan/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Abyan OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi NeotekOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.neotek"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.NEOTEK_OPEN_BANKING)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/neotek/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Neotek OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public GroupedOpenApi deewanConversationOpenApi() {
        String[] packagesToScan = new String[]{"com.azm.apihub.integrations.deewan.conversation"};
        GroupedOpenApi groupedOpenApi =
                GroupedOpenApi.builder()
                        .group(IntegrationConstants.SwaggerConstants.DEEWAN_CONVERSATION)
                        .packagesToScan(packagesToScan)
                        .pathsToMatch("/v1/deewan-conversation/**")
                        .addOperationCustomizer(customHeadersOperation())
                        .build();
        log.info("Deewan Conversation OpenApi configured: " + groupedOpenApi.getGroup());
        return groupedOpenApi;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl(serverUrl);

        OpenAPI openApi = new OpenAPI().servers(List.of(server));

        // List each group response together
        List<Class<?>> classList = new ArrayList<>(
                Arrays.asList(
                        // Commercial registration
                        AddressDetailsResponse.class,
                        OwnerResponse.class,
                        FullInfoResponse.class,
                        ManagersRespons.class,
                        CommercialRegistrationBasicDataResponse.class,
                        StatusResponse.class,
                        Related.class,

                        // Company contracts
                        LookupResponse.class,
                        ContractInfoSuccessResponse.class,
                        ManagerSuccessResponse.class,
                        ManagementSuccessResponse.class,

                        // Wathq attorney
                        InfoSuccessResponse.class,

                        // Simah
                        ConsumerEnquiryResponse.class,
                        ConsumerEnquiryRequest.class,

                        // Wathq real estate
                        DeedSuccessResponse.class,

                        // Tcc address by ID
                        AddressByIdResponse.class,

                        // Tcc mobile number verification
                        MobileNumberVerficationResponse.class,


                        // Yakeen
                        PersonNationalAddressInfo.class,
                        SaudiByNinData.class,
                        NonSaudiByIqamaResponse.class,
                        VisitorByVisaResponse.class,

                        // Etimad Contracts for bank
                        ContractsForBanksResponse.class,
                        ErrorResponse.class,
                        DetailedSalaryCertificatesResponse.class,

                        //  Sadad Invoice
                        InvoiceRequest.class,
                        InvoiceResponse.class
                )
        );

        buildSchemas(openApi, classList);

        // Add the security scheme
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .name("API-KEY")
                .in(SecurityScheme.In.HEADER)
                .description("Enter your API key");

        openApi.getComponents().addSecuritySchemes("API-KEY_AUTHENTICATION", securityScheme);
        openApi.addSecurityItem(new SecurityRequirement().addList("API-KEY_AUTHENTICATION"));

        return openApi;
    }

    private void buildSchemas(OpenAPI openApi, List<Class<?>> classList) {

        Components components = new Components();
        for (Class<?> clazz : classList) {
            // Create the schema for the class
            Schema schema = createSchema(clazz);

            // Add the created schema in the OpenAPI components using the class name
            components.addSchemas(clazz.getSimpleName(), schema);
        }

        openApi.setComponents(components);
    }

    private static Schema createSchema(Class<?> clazz) {
        ObjectSchema schema = new ObjectSchema();

        // Get the fields of the class
        Field[] fields = clazz.getDeclaredFields();

        // Initialize a list to keep track of which fields are marked as required.
        List<String> requiredProperties = new ArrayList<>();

        // Iterate over the fields and add them to the schema
        for (Field field : fields) {
            String fieldName = field.getName();
            Class<?> fieldType = field.getType();

            Schema<?> fieldSchema;  // This is the schema for the current field

            // there is 3 main cases of field type
            // List, custom object and otherwise
            if (fieldType.isAssignableFrom(List.class)) {
                // Fetch the actual type of items in the list using generics
                Type genericType = field.getGenericType();

                if (genericType instanceof ParameterizedType) {
                    ParameterizedType type = (ParameterizedType) genericType;
                    Type[] typeArguments = type.getActualTypeArguments();

                    if (typeArguments.length > 0) {
                        // Get the first type parameter (e.g., Url from List<Url>)
                        Class<?> typeArgClass = (Class<?>) typeArguments[0];

                        // Create a schema for the type parameter
                        Schema<?> itemSchema = createSchema(typeArgClass);
                        fieldSchema = new ArraySchema().items(itemSchema);
                    } else {
                        fieldSchema = new StringSchema(); // Default to String as a fallback
                    }
                } else {
                    fieldSchema = new StringSchema(); // Default to String as a fallback
                }
            } else if (isNestedClass(fieldType)) {
                fieldSchema = createSchema(fieldType);
            } else {
                fieldSchema = new StringSchema(); // Default to String for non-list, non-nested classes
            }

            // Continue with processing the @Schema annotation
            // We handled here description, example, required and maxLength
            io.swagger.v3.oas.annotations.media.Schema fieldAnnotation = field.getAnnotation(io.swagger.v3.oas.annotations.media.Schema.class);
            if (fieldAnnotation != null) {
                if (!fieldAnnotation.description().isEmpty()) {
                    fieldSchema.setDescription(fieldAnnotation.description());
                }
                if (!fieldAnnotation.example().isEmpty()) {
                    fieldSchema.setExample(fieldAnnotation.example());
                }

                if (fieldAnnotation.required()) {
                    requiredProperties.add(fieldName);
                }

                int maxLengthValue = fieldAnnotation.maxLength();
                if (maxLengthValue != Integer.MAX_VALUE) {
                    fieldSchema.setMaxLength(maxLengthValue);
                }
            }

            // Add the field schema to the main schema
            schema.addProperties(fieldName, fieldSchema);
        }

        if (!requiredProperties.isEmpty()) {
            schema.setRequired(requiredProperties);
        }
        return schema;
    }

    private static boolean isNestedClass(Class<?> clazz) {
        return clazz.getName().contains("com.azm.apihub.integrations");
    }

    public OperationCustomizer customHeadersOperation() {
        return (Operation operation, HandlerMethod handlerMethod) -> {
            // Define a custom header and to the operation
            operation.addParametersItem(
                    new Parameter()
                            .in(ParameterIn.HEADER.toString())
                            .schema(new StringSchema())
                            .name(IntegrationConstants.CUSTOM_HEADERS_KEY)
                            .description("Custom Headers (Optional) - e.g: {\"key1\": \"value1\", \"key2\": \"value2\"}")
                            .required(false)
            );
            return operation;
        };
    }

}