package com.azm.apihub.backend.companies.services;

import com.azm.apihub.backend.attachments.models.AttachmentDTO;
import com.azm.apihub.backend.attachments.repository.AttachmentRepository;
import com.azm.apihub.backend.audit.enums.ApiHubActions;
import com.azm.apihub.backend.audit.enums.ApiHubModules;
import com.azm.apihub.backend.audit.services.AuditLogsService;
import com.azm.apihub.backend.companies.enums.AccountType;
import com.azm.apihub.backend.companies.models.*;
import com.azm.apihub.backend.companies.repository.AccountServiceHeadSubscriptionRepository;
import com.azm.apihub.backend.companies.repository.ApiKeyRepository;
import com.azm.apihub.backend.companies.repository.CompanyPackageAllowedRepository;
import com.azm.apihub.backend.companies.repository.CompanyPackageSelectedRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.companies.repository.CompanyServiceRepository;
import com.azm.apihub.backend.companyAttachment.repository.CompanyAttachmentRepository;
import com.azm.apihub.backend.entities.*;
import com.azm.apihub.backend.entities.Address;
import com.azm.apihub.backend.entities.CompanyRep;
import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.packages.repository.PackageRepository;
import com.azm.apihub.backend.services.repository.ServiceHeadRepository;
import com.azm.apihub.backend.users.models.UserDetails;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.UnAuthorizedException;
import com.azm.apihub.backend.invoices.repository.InvoiceRepository;
import com.azm.apihub.backend.invoices.services.InvoiceService;
import com.azm.apihub.backend.logging.services.CompanyServiceProviderLoggingService;
import com.azm.apihub.backend.lookups.repository.LookupValueRepository;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import com.azm.apihub.backend.users.models.UserRequest;
import com.azm.apihub.backend.users.repository.UserRepository;
import com.azm.apihub.backend.users.services.UserService;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.function.Predicate.not;

@Slf4j
@Service
public class CompanyServiceImpl implements CompanyService{

    private final ModelMapper modelMapper;
    private final CompanyRepository companyRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;
    private final EmailTemplateBuilder emailTemplateBuilder;
    private final ServiceHeadRepository serviceHeadRepository;
    private final AccountServiceHeadSubscriptionRepository accountServiceHeadSubscriptionRepository;


    private final CompanyServiceRepository companyServiceRepository;

    private final CompanyPackageAllowedRepository companyPackageAllowedRepository;

    private final CompanyPackageSelectedRepository companyPackageSelectedRepository;
    private final LookupValueRepository lookupValueRepository;
    private final UserService userService;
    private final PackageRepository packageRepository;
    AttachmentRepository attachmentRepository;
    InvoiceService invoiceService;
    InvoiceRepository invoiceRepository;
    CompanyAttachmentRepository companyAttachmentRepository;

    private final CompanyServiceProviderLoggingService companyServiceProviderLoggingService;

    private final AuditLogsService auditLogsService;

    private final String BAD_REQUEST_COMPANY_DOES_NOT_EXIST = "Company does not exist";
    private final String BAD_REQUEST_COMPANY_ALREADY_EXIST = "Company already exists";
    private final String BAD_REQUEST_PACKAGE_DOES_NOT_EXIST = "Package does not exist";

    @Value("${company.apikey.validity}")
    private long apiKeyValidity;

    @Autowired
    public CompanyServiceImpl(CompanyRepository companyRepository,
                              UserRepository userRepository,
                              LookupValueRepository lookupValueRepository,
                              UserService userService,
                              ApiKeyRepository apiKeyRepository,
                              CompanyServiceRepository companyServiceRepository,
                              CompanyServiceProviderLoggingService companyServiceProviderLoggingService,
                              CompanyPackageAllowedRepository companyPackageAllowedRepository,
                              CompanyPackageSelectedRepository companyPackageSelectedRepository,
                              EmailTemplateBuilder emailTemplateBuilder,
                              InvoiceService invoiceService,
                              CompanyAttachmentRepository companyAttachmentRepository,
                              AttachmentRepository attachmentRepository,
                              InvoiceRepository invoiceRepository,
                              ServiceHeadRepository serviceHeadRepository,
                              AccountServiceHeadSubscriptionRepository accountServiceHeadSubscriptionRepository,
                              PackageRepository packageRepository,
                              AuditLogsService auditLogsService) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.apiKeyRepository = apiKeyRepository;
        this.lookupValueRepository = lookupValueRepository;
        this.companyServiceRepository = companyServiceRepository;
        this.companyServiceProviderLoggingService = companyServiceProviderLoggingService;
        this.modelMapper = new ModelMapper();
        this.emailTemplateBuilder = emailTemplateBuilder;
        this.modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        this.companyPackageAllowedRepository = companyPackageAllowedRepository;
        this.companyPackageSelectedRepository = companyPackageSelectedRepository;
        this.invoiceService = invoiceService;
        this.attachmentRepository = attachmentRepository;
        this.companyAttachmentRepository = companyAttachmentRepository;
        this.invoiceRepository = invoiceRepository;
        this.serviceHeadRepository = serviceHeadRepository;
        this.accountServiceHeadSubscriptionRepository = accountServiceHeadSubscriptionRepository;
        this.packageRepository = packageRepository;
        this.auditLogsService = auditLogsService;
    }

    @Override
    public List<Company> getCompanies(UUID requestId, Long mainAccountId, String query, String accountType) {
        List<Company> companies;
        if (query != null && !query.isEmpty()) {
            if(mainAccountId != null)
                companies = companyRepository.getSearchedSubAccountByCompanyId(query, mainAccountId);
            else
                companies = companyRepository.getSearchedCompanies(query);
        } else {
            if(mainAccountId != null)
                companies = companyRepository.findAllByMainAccountIdAndIsDeletedFalseOrderByIdDesc(mainAccountId);
            else
                companies = companyRepository.findAllByIsDeletedFalseAndAccountTypeOrderByIdDesc(accountType != null ? accountType: AccountType.MAIN.name());
        }

        // Fetch attachments for each company and map to DTO
        companies.forEach(company -> {
            List<Object[]> attachmentData = companyAttachmentRepository.findCompanyAttachmentByCompanyId(company.getId());
            List<AttachmentDTO> attachmentDTOs = attachmentData.stream()
                    .map(data -> mapCompanyAttachmentToDTO(data))
                    .collect(Collectors.toList());
            company.setAttachmentDTOList(attachmentDTOs);
            setSuperAdminInCompanyResponse(company);
        });

        return companies;
    }

    @Override
    public Company getCompanyById(UUID requestId, Long mainAccountId, Long companyId) {
        Company company;

        if(mainAccountId != null)
            company = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId)
                .orElseThrow(() -> new ForbiddenException("You can only get account details for your account"));
        else
            company = companyRepository.findByIdAndIsDeletedFalse(companyId)
                    .orElseThrow(() -> new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST));

        List<Object[]> attachmentData = companyAttachmentRepository.findCompanyAttachmentByCompanyId(companyId);

        List<AttachmentDTO> attachmentDTOs = attachmentData.stream()
                .map(data -> mapCompanyAttachmentToDTO(data))
                .collect(Collectors.toList());

        company.setAttachmentDTOList(attachmentDTOs);


        return setSuperAdminInCompanyResponse(company);
    }

    private Company setSuperAdminInCompanyResponse(Company company) {
        Optional<User> userOptional = userRepository.getSuperAdminUsersByCompanyId(company.getId());

        if(userOptional.isPresent()) {
            userOptional.get().setCompany(null);
            company.setSuperAdmin(userOptional.get());
        }

        return company;
    }

    private AttachmentDTO mapCompanyAttachmentToDTO(Object[] data) {
        AttachmentDTO attachmentDTO = new AttachmentDTO();
        attachmentDTO.setId((Long) data[0]);
        attachmentDTO.setName((String) data[1]);
        attachmentDTO.setDescription((String) data[2]);

        // Convert Timestamp to LocalDateTime
        attachmentDTO.setUpdatedAt((Timestamp) data[3]);
        attachmentDTO.setCreatedAt((Timestamp) data[4]);

        attachmentDTO.setAttachmentType((AttachmentType) data[5]);
        return attachmentDTO;
    }


    private Company createCompany(UUID requestId, Long mainAccountId, CompanyRequest companyRequest) {

        Timestamp now = Timestamp.from(Instant.now());

        List<Company> existingCompany = companyRepository.findByCompanyNameOrCompanyEmailOrCompanyWebsiteOrUnifiedNationalNumberOrTaxNumberOrCommercialRegistry(
                companyRequest.getCompanyName().trim(), companyRequest.getCompanyEmail().trim(), companyRequest.getCompanyWebsite().trim(),
                companyRequest.getUnifiedNationalNumber(), companyRequest.getTaxNumber(),
                companyRequest.getCommercialRegistry()
        );

        if(!existingCompany.isEmpty())
            throw new BadRequestException(BAD_REQUEST_COMPANY_ALREADY_EXIST);

        Company company = convertToEntity(companyRequest);

        company.setAccountType(AccountType.MAIN.name());
        company.setAccountKey(requestId.toString());
        company.setSector(getLookupValue(companyRequest.getSectorId(), "Sector"));

        Address address = modelMapper.map(companyRequest.getAddress(), Address.class);
        address.setCity(getLookupValue(companyRequest.getAddress().getCityId(), "City"));
        address.setCreatedAt(now);
        address.setUpdatedAt(now);
        company.setAddress(address);

        CompanyRep companyRep = modelMapper.map(companyRequest.getCompanyRep(), CompanyRep.class);
        companyRep.setCity(getLookupValue(companyRequest.getCompanyRep().getCityId(), "Company Rep City"));
        companyRep.setCreatedAt(now);
        company.setCompanyRep(companyRep);

        company.setCreatedAt(now);
        company.setUpdatedAt(now);
        company.setIsActive(companyRequest.getIsActive() != null ? companyRequest.getIsActive() : true);
        company.setIsDeleted(false);
        company.setAllowPostpaidPackages(companyRequest.getAllowPostpaidPackages() != null ? companyRequest.getAllowPostpaidPackages() : true);
        company.setServicesPostpaidSubscribed(false);
        company.setUseMainAccountBundles(false);

        if(mainAccountId != null) {
            company.setAccountType(AccountType.SUB.name());
            company.setMainAccountId(mainAccountId);
            company.setSubAccountTypeDesc(companyRequest.getSubAccountDescription());
            company.setUseMainAccountBundles(companyRequest.getUseMainAccountBundles());
        }

        Company savedCompany = companyRepository.save(company);

        UserRequest userRequest = modelMapper.map(companyRequest.getUser(), UserRequest.class);
        userRequest.setUsername(companyRequest.getUser().getUsername().trim());
        userRequest.setIsActive(true);
        userRequest.setIsDeleted(false);
        userRequest.setCompanyId(savedCompany.getId());

        User user = userService.createUser(requestId, userRequest, true);
        savedCompany.setUsers(Arrays.asList(user));

        companyServiceRepository.saveAll(companyRequest.getServices().stream().map(ser -> {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = userDetails.getUsername();
            com.azm.apihub.backend.entities.CompanyService companyService = new com.azm.apihub.backend.entities.CompanyService();
            com.azm.apihub.backend.entities.Service service = new com.azm.apihub.backend.entities.Service();
            service.setId(ser);
            companyService.setCreatedAt(Timestamp.from(Instant.now()));
            companyService.setUpdatedAt(Timestamp.from(Instant.now()));
            companyService.setCreatedBy(username);
            companyService.setCompany(savedCompany);
            companyService.setService(service);
            return companyService;
        }).collect(Collectors.toList()));

        List<Long> packages = new ArrayList<>();
        packages.addAll(companyRequest.getAllowedAnnualPackages());
        packages.addAll(companyRequest.getAllowedServicesPackages());

        companyPackageAllowedRepository.saveAll(packages.stream().map(pac -> {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = userDetails.getUsername();
            CompanyPackageAllowed companyPackageAllowed = new CompanyPackageAllowed();
            Package _Package = new Package();
            _Package.setId(pac);
            companyPackageAllowed.setCreatedAt(Timestamp.from(Instant.now()));
            companyPackageAllowed.setUpdatedAt(Timestamp.from(Instant.now()));
            companyPackageAllowed.setCreatedBy(username);
            companyPackageAllowed.setCompany(savedCompany);
            companyPackageAllowed.setAPackage(_Package);
            return companyPackageAllowed;
        }).collect(Collectors.toList()));

        if(companyRequest.getServiceProvidersForLogging() != null && !companyRequest.getServiceProvidersForLogging().isEmpty())
            companyServiceProviderLoggingService.createLogs(savedCompany, companyRequest.getServiceProvidersForLogging());

        String newCompanyJson = savedCompany.convertToJson();
        saveAuditLog(company.getId(), company.getCompanyName(), newCompanyJson, newCompanyJson, "Created new company", ApiHubActions.CREATE.name());

        return savedCompany;
    }

    private Company updateCompany(UUID requestId, Long mainAccountId, Long companyId, CompanyUpdateRequest companyRequest) {
        Optional<Company> optionalCompany;
        if(mainAccountId != null)
            optionalCompany = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId);
        else
            optionalCompany = companyRepository.findById(companyId);

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            String oldCompanyJson = company.convertToJson();

            company.setCompanyName(companyRequest.getCompanyName().trim());
            company.setCompanyWebsite(companyRequest.getCompanyWebsite().trim());
            company.setCompanyEmail(companyRequest.getCompanyEmail().trim());
            company.setTaxNumber(companyRequest.getTaxNumber());
            company.setCommercialRegistry(companyRequest.getCommercialRegistry());
            company.setUnifiedNationalNumber(companyRequest.getUnifiedNationalNumber());

            Boolean isActiveStatus = companyRepository.getActiveStatus(company.getId());
            if(companyRequest.getIsActive() != null) {
                company.setIsActive(companyRequest.getIsActive());
                if(company.getIsActive() && !isActiveStatus)
                {
                    List<User> reActivationUser = userRepository.getReactivationUser(company.getId());
                    reActivationUser.forEach(it -> emailTemplateBuilder.sendReActivationEmail(it, "account_reactivation_template.html"));
                }
            }
            company.setAllowPostpaidPackages(companyRequest.getAllowPostpaidPackages() != null ? companyRequest.getAllowPostpaidPackages() : true);
            company.setUpdatedAt(Timestamp.from(Instant.now()));
            company.setIssueDate(Timestamp.valueOf(companyRequest.getIssueDate().atStartOfDay()));
            company.setExpiryDate(Timestamp.valueOf(companyRequest.getExpiryDate().atStartOfDay()));

            if(companyRequest.getIssueDateHijri() != null) {
                company.setIssueDateHijri(Timestamp.valueOf(companyRequest.getIssueDate().atStartOfDay()));
            }

            if(companyRequest.getExpiryDateHijri() != null) {
                company.setExpiryDateHijri(Timestamp.valueOf(companyRequest.getExpiryDate().atStartOfDay()));
            }

            company.setSector(getLookupValue(companyRequest.getSectorId(), "Sector"));

            // Address Update
            company.getAddress().setSecondaryNumber(companyRequest.getAddress().getSecondaryNumber());
            company.getAddress().setCity(getLookupValue(companyRequest.getAddress().getCityId(), "City"));
            company.getAddress().setCountry(companyRequest.getAddress().getCountry());
            company.getAddress().setBuildingNumber(companyRequest.getAddress().getBuildingNumber());
            company.getAddress().setDistrict(companyRequest.getAddress().getDistrict());
            company.getAddress().setPostalCode(companyRequest.getAddress().getPostalCode());
            company.getAddress().setUpdatedAt(Timestamp.from(Instant.now()));

            // Company rep update
            company.getCompanyRep().setCity(getLookupValue(companyRequest.getCompanyRep().getCityId(), "Company Rep City"));
            company.getCompanyRep().setFirstName(companyRequest.getCompanyRep().getFirstName());
            company.getCompanyRep().setLastName(companyRequest.getCompanyRep().getLastName());
            company.getCompanyRep().setMobile(companyRequest.getCompanyRep().getMobile());
            company.getCompanyRep().setEmail(companyRequest.getCompanyRep().getEmail());
            company.getCompanyRep().setNationalId(companyRequest.getCompanyRep().getNationalId());

            companyServiceRepository.deleteAllServicesByCompanyId(company.getId());
            companyServiceRepository.saveAll(companyRequest.getServices().stream().map(ser -> {
                UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                String username = userDetails.getUsername();
                com.azm.apihub.backend.entities.CompanyService companyService = new com.azm.apihub.backend.entities.CompanyService();
                com.azm.apihub.backend.entities.Service service = new com.azm.apihub.backend.entities.Service();
                service.setId(ser);
                companyService.setCreatedAt(Timestamp.from(Instant.now()));
                companyService.setUpdatedAt(Timestamp.from(Instant.now()));
                // @todo Should be updated when we fix this for all
                companyService.setCreatedBy(username);
                companyService.setCompany(company);
                companyService.setService(service);
                return companyService;
            }).collect(Collectors.toList()));

            List<Long> packages = new ArrayList<>();
            packages.addAll(companyRequest.getAllowedAnnualPackages());
            packages.addAll(companyRequest.getAllowedServicesPackages());

            companyPackageAllowedRepository.deleteAllPackagesByCompanyId(company.getId());
            companyPackageAllowedRepository.saveAll(packages.stream().map(pac -> {
                UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                String username = userDetails.getUsername();
                CompanyPackageAllowed companyPackageAllowed = new CompanyPackageAllowed();
                Package _package = new Package();
                _package.setId(pac);
                companyPackageAllowed.setCreatedAt(Timestamp.from(Instant.now()));
                companyPackageAllowed.setUpdatedAt(Timestamp.from(Instant.now()));
                // Should be updated when we fix this for all
                companyPackageAllowed.setCreatedBy(username);
                companyPackageAllowed.setCompany(company);
                companyPackageAllowed.setAPackage(_package);
                return companyPackageAllowed;
            }).collect(Collectors.toList()));

            if (companyRequest.getUseMainAccountBundles() != null) {
                company.setUseMainAccountBundles(companyRequest.getUseMainAccountBundles());
            }
            company.setSubAccountTypeDesc(companyRequest.getSubAccountDescription());

            Company updatedCompany = companyRepository.save(company);

            companyServiceProviderLoggingService.updateLogs(updatedCompany, companyRequest.getServiceProvidersForLogging());

            Optional<User> adminUsersOptional = userRepository.getSuperAdminUsersByCompanyId(company.getId());

            if(adminUsersOptional.isPresent()) {
                User adminUser = adminUsersOptional.get();
                adminUser.setFirstName(companyRequest.getUser().getFirstName());
                adminUser.setLastName(companyRequest.getUser().getLastName());
                adminUser.setNationalId(companyRequest.getUser().getNationalId());
                adminUser.setContactNo(companyRequest.getUser().getContactNo());

                userRepository.save(adminUser);
            }

            String updatedCompanyJson = updatedCompany.convertToJson();
            saveAuditLog(company.getId(), company.getCompanyName(), oldCompanyJson, updatedCompanyJson, "Updated Company details", ApiHubActions.UPDATE.name());

            return updatedCompany;
        }
        throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);
    }

    private void saveAuditLog(Long companyId, String companyName, String oldCompanyJson, String updatedCompanyJson, String tag, String action) {
        auditLogsService.saveAuditLogs(companyId, companyName, ApiHubModules.COMPANY.name(), oldCompanyJson, updatedCompanyJson, tag, "", action);
    }

    @Override
    public void deleteCompany(UUID requestId, Long mainAccountId, Long companyId) {
        Optional<Company> optionalCompany;
        if(mainAccountId != null)
            optionalCompany = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId);
        else
            optionalCompany = companyRepository.findByIdAndIsDeletedFalse(companyId);

        if(optionalCompany.isPresent()) {
            String oldCompanyJson = optionalCompany.get().convertToJson();
            List<User> companyUsers = userRepository.findAllByCompanyIsNotNullAndCompanyIsAndIsDeletedFalse(optionalCompany.get());
            if(companyUsers != null && !companyUsers.isEmpty()) {
                companyUsers.forEach(it -> userService.deleteUser(optionalCompany.get().getId(), it.getId(), false));
            }
            companyRepository.softDeleteById(companyId, Timestamp.from(Instant.now()));

            saveAuditLog(companyId, optionalCompany.get().getCompanyName(), oldCompanyJson, oldCompanyJson, "Deleted Company", ApiHubActions.DELETE.name());
        }
        else
            throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);
    }

    @Override
    public Optional<ApiKey> findApiKey(UUID requestId, Long companyId) {
        return apiKeyRepository.findByCompanyId(companyId);
    }

    @Override
    public ApiKey findByApiKeyAndAccountKey(UUID requestId, String apiKey) {
        Optional<ApiKey> optionalApiKey = apiKeyRepository.findByApiKey(apiKey);

        if(optionalApiKey.isEmpty())
            throw new UnAuthorizedException("Api key is not valid");

        return optionalApiKey.get();
    }

    @Override
    public ApiKey createAPIKey(UUID requestId, Company company) {
        ApiKey apiKey = new ApiKey();
        Timestamp current = Timestamp.from(Instant.now());
        apiKey.setCreatedAt(current);
        apiKey.setCompany(company);
        apiKey.setApiKey(UUID.randomUUID().toString());
        apiKey.setValid_until(Timestamp.from(Instant.now().plusSeconds(apiKeyValidity)));
        return apiKeyRepository.save(apiKey);
    }

    /**
     * @param requestId
     * @param companyRequest
     * @return
     */
    @Transactional
    @Override
    public Company createCompanyWithAttachmentIds(UUID requestId, Long mainAccountId, CompanyRequest companyRequest) {

        // Save the company first.
        Company createdCompany = createCompany(requestId, mainAccountId, companyRequest);

        // Create CompanyAttachment instances and associate with the company
        associateAttachmentsWithTheCompany(requestId, createdCompany, companyRequest.getCompanyAttachmentRequestList());

        return createdCompany;
    }

    @Transactional
    @Override
    public Company createSubAccount(UUID requestId, Long mainAccountId, SubAccountRequest subAccountRequest) {
        Timestamp now = Timestamp.from(Instant.now());

        List<Company> existingCompany = companyRepository.findByCompanyNameAndIsDeletedFalseAndIsActiveTrue(
                subAccountRequest.getCompanyName().trim());

        if(!existingCompany.isEmpty())
            throw new BadRequestException(BAD_REQUEST_COMPANY_ALREADY_EXIST);

        Company company =  modelMapper.map(subAccountRequest, Company.class);
        company.setCompanyName(subAccountRequest.getCompanyName().trim());

        company.setAccountKey(requestId.toString());


        company.setCreatedAt(now);
        company.setUpdatedAt(now);
        company.setIsActive(subAccountRequest.getIsActive() != null ? subAccountRequest.getIsActive() : true);
        company.setIsDeleted(false);
        company.setAllowPostpaidPackages(subAccountRequest.getAllowPostpaidPackages() != null ? subAccountRequest.getAllowPostpaidPackages() : true);
        company.setServicesPostpaidSubscribed(false);

        if(mainAccountId != null) {
            var mainAccount = companyRepository.findByIdAndIsDeletedFalse(mainAccountId);
            if(mainAccount.isEmpty())
                throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);

            company.setAccountType(AccountType.SUB.name());
            company.setMainAccountId(mainAccountId);
            company.setSubAccountTypeDesc(subAccountRequest.getSubAccountDescription());
            company.setUseMainAccountBundles(subAccountRequest.getUseMainAccountBundles());

            if(subAccountRequest.getUseMainAccountBundles()) {
                company.setAllowPostpaidPackages(mainAccount.get().getAllowPostpaidPackages());
                company.setServicesPostpaidSubscribed(mainAccount.get().getServicesPostpaidSubscribed());
                company.setServicesPostpaidSubscriptionDate(Timestamp.from(Instant.now()));
            }
        }

        Company savedCompany = companyRepository.save(company);

        UserRequest userRequest = modelMapper.map(subAccountRequest.getUser(), UserRequest.class);
        userRequest.setUsername(subAccountRequest.getUser().getUsername().trim());
        userRequest.setIsActive(true);
        userRequest.setIsDeleted(false);
        userRequest.setCompanyId(savedCompany.getId());

        User user = userService.createUser(requestId, userRequest, true);
        savedCompany.setUsers(Arrays.asList(user));

        String newCompanyJson = savedCompany.convertToJson();
        saveAuditLog(company.getId(), company.getCompanyName(), newCompanyJson, newCompanyJson, "Created new sub account", ApiHubActions.CREATE.name());

        return savedCompany;
    }

    @Transactional
    @Override
    public Company updateCompanyWithAttachmentIds(UUID requestId, Long mainAccountId, Long companyId, CompanyUpdateRequest companyRequest) {
        Company updatedCompany = updateCompany(requestId, mainAccountId, companyId, companyRequest);

        List<CompanyAttachmentRequest> attachments = companyRequest.getCompanyAttachmentRequestList();
        if(attachments == null) {
            return updatedCompany;
        }

        Set<Long> attachmentIds = attachments.stream()
                .map(CompanyAttachmentRequest::getAttachmentId)
                .collect(Collectors.toCollection(HashSet::new));

        List<Object[]> existingAttachmentData;
        if(mainAccountId != null)
            existingAttachmentData = companyAttachmentRepository.findCompanyAttachmentByCompanyIdAndSubAccountId(mainAccountId, companyId);
        else
            existingAttachmentData = companyAttachmentRepository.findCompanyAttachmentByCompanyId(companyId);


        Set<Long> existingAttachmentIds = existingAttachmentData.stream()
                .map(this::mapCompanyAttachmentToDTO)
                .map(AttachmentDTO::getId)
                .collect(Collectors.toCollection(HashSet::new));

        List<CompanyAttachmentRequest> addedAttachments = attachments.stream()
                .filter(not(att -> existingAttachmentIds.contains(att.getAttachmentId())))
                .toList();

        associateAttachmentsWithTheCompany(requestId, updatedCompany, addedAttachments);

        List<Long> deletedAttachmentIds = existingAttachmentIds.stream()
                .filter(not(attachmentIds::contains))
                .toList();

        deletedAttachmentIds.forEach(attId -> {
            companyAttachmentRepository.deleteByCompanyIdAndAttachmentId(companyId, attId);
            attachmentRepository.deleteById(attId);
        });

        return updatedCompany;
    }

    @Override
    public Company updateSubAccount(UUID requestId, Long mainAccountId, Long companyId, SubAccountRequest subAccountRequest) {
        Optional<Company> optionalCompany;
        if(mainAccountId != null) {
            optionalCompany = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId);
        }
        else
            optionalCompany = companyRepository.findById(companyId);

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            String oldCompanyJson = company.convertToJson();

            company.setCompanyName(subAccountRequest.getCompanyName().trim());

            Boolean isActiveStatus = companyRepository.getActiveStatus(company.getId());
            if(subAccountRequest.getIsActive() != null) {
                company.setIsActive(subAccountRequest.getIsActive());
                if(company.getIsActive() && !isActiveStatus)
                {
                    List<User> reActivationUser = userRepository.getReactivationUser(company.getId());
                    reActivationUser.forEach(it -> emailTemplateBuilder.sendReActivationEmail(it, "account_reactivation_template.html"));
                }
            }
            company.setAllowPostpaidPackages(subAccountRequest.getAllowPostpaidPackages() != null ? subAccountRequest.getAllowPostpaidPackages() : true);
            company.setUpdatedAt(Timestamp.from(Instant.now()));

            if (subAccountRequest.getUseMainAccountBundles() != null) {
                company.setUseMainAccountBundles(subAccountRequest.getUseMainAccountBundles());
            }

            if(mainAccountId != null) {
                var mainAccount = companyRepository.findByIdAndIsDeletedFalse(mainAccountId);
                if(mainAccount.isEmpty())
                    throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);

                if(subAccountRequest.getUseMainAccountBundles()) {
                    company.setAllowPostpaidPackages(mainAccount.get().getAllowPostpaidPackages());
                    company.setServicesPostpaidSubscribed(mainAccount.get().getServicesPostpaidSubscribed());
                    company.setServicesPostpaidSubscriptionDate(Timestamp.from(Instant.now()));
                }
            }

            company.setSubAccountTypeDesc(subAccountRequest.getSubAccountDescription());

            Company updatedCompany = companyRepository.save(company);

            Optional<User> adminUsersOptional = userRepository.getSuperAdminUsersByCompanyId(company.getId());

            if(adminUsersOptional.isPresent()) {
                User adminUser = adminUsersOptional.get();
                adminUser.setFirstName(subAccountRequest.getUser().getFirstName());
                adminUser.setLastName(subAccountRequest.getUser().getLastName());
                adminUser.setNationalId(subAccountRequest.getUser().getNationalId());
                adminUser.setContactNo(subAccountRequest.getUser().getContactNo());

                userRepository.save(adminUser);
            }

            String updatedCompanyJson = updatedCompany.convertToJson();
            saveAuditLog(company.getId(), company.getCompanyName(), oldCompanyJson, updatedCompanyJson, "Updated Company details", ApiHubActions.UPDATE.name());

            return updatedCompany;
        }
        throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);
    }

    @Override
    public void subscribeAccountServiceHead(Long companyId, Long serviceHeadId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        var result = accountServiceHeadSubscriptionRepository.findAllByCompanyIdAndServiceHeadId(companyId, serviceHeadId);

        if(!result.isEmpty())
            throw new BadRequestException("Service head is already subscribed by this company");


        AccountServiceHeadSubscription subscription = new AccountServiceHeadSubscription();
        Optional <ServiceHead> serviceHead = serviceHeadRepository.findByServiceHeadId(serviceHeadId);
        Optional<Company> company = companyRepository.findById(companyId);

        if(company.isEmpty()) {
            throw new BadRequestException("Company does not exists");
        }
        if(serviceHead.isEmpty()) {
            throw new BadRequestException("Service Head does not exists");

        }

        subscription.setCompany(company.get());
        subscription.setServiceHead(serviceHead.get());
        subscription.setSubscribedAt(Timestamp.from(Instant.now()));
        subscription.setCreatedAt(Timestamp.from(Instant.now()));
        subscription.setCreatedBy(username);
        subscription.setUpdatedAt(Timestamp.from(Instant.now()));
        subscription.setUpdatedBy(username);

        accountServiceHeadSubscriptionRepository.save(subscription);
    }

    public void associateAttachmentsWithTheCompany(UUID requestId, Company createdCompany, List<CompanyAttachmentRequest> companyAttachmentRequestList) {

        if(companyAttachmentRequestList == null) {
            return;
        }

        // Create CompanyAttachment instances and associate with the company
        List<CompanyAttachment> companyAttachments = companyAttachmentRequestList.stream()
                .map(attachmentDetails -> {
                    CompanyAttachment companyAttachment = new CompanyAttachment();
                    companyAttachment.setCompany(createdCompany);

                    // Fetch attachment from the database using its ID
                    Attachment attachment = attachmentRepository.findById(attachmentDetails.getAttachmentId())
                            .orElseThrow(() -> new EntityNotFoundException("Attachment not found with ID: " + attachmentDetails.getAttachmentId()));

                    companyAttachment.setAttachment(attachment);
                    companyAttachment.setAttachmentType(attachmentDetails.getAttachmentType());
                    companyAttachment.setCreatedAt(Timestamp.from(Instant.now()));

                    return companyAttachment;
                })
                .toList();

        companyAttachments.forEach(companyAttachmentRepository::save);
    }

    @Override
    public List<com.azm.apihub.backend.entities.CompanyService> findAllServiceHeadsByCompany(UUID requestId, Long companyId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long companyIdToUse = companyId;

        if(userDetails.getCompany() != null) {
            if (userDetails.isSubAccount())
                companyIdToUse = userDetails.getCompany().getMainAccountId();
            else
                companyIdToUse = userDetails.getCompany().getId();
        }

        List<com.azm.apihub.backend.entities.CompanyService> companyServices = companyServiceRepository.findAllByCompanyId(companyIdToUse);
        if (companyServices.isEmpty()) {
            throw new BadRequestException("This company has not subscribed to any service");
        }

        List<Long> subscribedServiceHeadIds = accountServiceHeadSubscriptionRepository.findAllSubscribedServiceHeadIdsByCompanyId(
                userDetails.isAdmin() ? companyId : userDetails.getCompany().getId());

        for (com.azm.apihub.backend.entities.CompanyService companyService : companyServices) {
            Long serviceHeadId = companyService.getService().getServiceHeadId();
            boolean isSubscribed = subscribedServiceHeadIds.contains(serviceHeadId);
            companyService.setSubscribed(isSubscribed);
        }

        return companyServices;
    }

    @Override
    public List<CompanyPackageAllowed> findAllAllowedPackagesByCompany(UUID requestId, Long mainAccountId, Long companyId, PackageType packageType) {
        if(mainAccountId != null){
            var optionalCompany = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId);
            if(optionalCompany.isEmpty())
                throw new ForbiddenException("Company does not exists or you are not allowed to get packages for this company");

            return companyPackageAllowedRepository.findAllByCompanyIdAndPackageType(mainAccountId, packageType);
        }

        return companyPackageAllowedRepository.findAllByCompanyIdAndPackageType(companyId, packageType);
    }

    public CompanyPackageSelectedResponse findAllSelectedPackagesByCompany(UUID requestId, Long mainAccountId, Long companyId, String packageName, int pageNumber, int pageSize, PackageStatus packageStatus, PackageType packageType) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize);
        Long companyIdToUse = companyId;
        if(mainAccountId != null){
            var optionalCompany = companyRepository.findByMainAccountIdAndIdAndIsDeletedFalse(mainAccountId, companyId);
            if(optionalCompany.isEmpty())
                throw new ForbiddenException("Company does not exists or you are not allowed to get packages for this company");

            Company company = optionalCompany.get();
            if(company.getUseMainAccountBundles())
                companyIdToUse = mainAccountId;
        }


        if ((packageName != null && !packageName.isEmpty()) || (packageStatus != null || (packageType != null))) {
            List<CompanyPackageSelected> pageContent = companyPackageSelectedRepository.findAllSearchedByCompanyId(companyIdToUse, packageName, pageable, packageStatus, packageType).getContent();
            long totalRecords = companyPackageSelectedRepository.findAllSearchedByCompanyId(companyIdToUse, packageName, pageable, packageStatus, packageType).getTotalElements();
            return new CompanyPackageSelectedResponse(totalRecords, pageContent);
        } else {

            List<Long> subAccountIds = new ArrayList<>(List.of(companyIdToUse));
            subAccountIds.addAll(companyRepository.findSubAccountIdsByMainAccountId(companyIdToUse));

            Page<CompanyPackageSelected> page = companyPackageSelectedRepository.findAllByCompanyIdIn(subAccountIds, pageable);
            List<CompanyPackageSelected> pageContent = companyPackageSelectedRepository.findAllByCompanyIdIn(subAccountIds, pageable).getContent();
            var totalRecords = page.getTotalElements();

            return new CompanyPackageSelectedResponse(totalRecords, pageContent);
        }
    }

    @Override
    public List<CompanyPackageSelected> findAllSelectedPackagesByCompanyWithoutPagination(UUID requestId, Long companyId) {
        return companyPackageSelectedRepository.findAllByCompanyIdWithoutPagination(companyId);
    }

    @Override
    @Transactional
    public void deleteApiKey(UUID requestId, Long companyId) {
        log.info("Deleting API key to generate New API key");
        apiKeyRepository.deleteByCompanyId(companyId);
    }

    @Override
    @Transactional
    public CompanyPackageSelected assignPackageToCompany(UUID requestId, Company company, CompanyPackageRequest companyPackageRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Long companyId = company.getId();

        Optional<CompanyPackageAllowed> companyPackageAllowed = companyPackageAllowedRepository.findOneByCompanyIdAndPackageId(
                userDetails.isSubAccount() ? userDetails.getCompany().getMainAccountId() : companyId, companyPackageRequest.getPackageId());
        if(companyPackageAllowed.isEmpty()) {
            throw new BadRequestException("You can only assign package to company which is allowed to the company");
        }

        if(Boolean.TRUE.equals(company.getServicesPostpaidSubscribed()) && PackageType.SERVICES.equals(companyPackageAllowed.get().getAPackage().getPackageType())) {
            throw new BadRequestException("You are already subscribed to postpaid package for services. You cannot subscribe to Prepaid package at the same time");
        }

        List<CompanyPackageSelected> result = companyPackageSelectedRepository.findAllByCompanyIdWithoutPagination(companyId);

        Optional<Package> optionalSelectedPackage = packageRepository.findById(companyPackageRequest.getPackageId());

        if(optionalSelectedPackage.isEmpty())
            throw new BadRequestException("Package does not exist");


        if(!result.isEmpty()) {
            boolean isEmptyResult = result.stream().filter(
                            selectedPackage -> selectedPackage.getActivationDate()
                                    .equals(Timestamp.valueOf(companyPackageRequest.getActivationDate().atStartOfDay()))
                                    && optionalSelectedPackage.get().getPackageType() == selectedPackage.getCPackage().getPackageType())
                    .toList().isEmpty();

            if(!isEmptyResult)
                throw new BadRequestException("A package with same Activation date is already exist, please select different activation date.");
        }

        CompanyPackageSelected companyPackageSelected = new CompanyPackageSelected();
        companyPackageSelected.setCPackage(companyPackageAllowed.get().getAPackage());
        companyPackageSelected.setCompany(company);
        companyPackageSelected.setActivationDate(Timestamp.valueOf(companyPackageRequest.getActivationDate().atStartOfDay()));

        Timestamp current = Timestamp.from(Instant.now());
        companyPackageSelected.setCreatedAt(current);
        companyPackageSelected.setUpdatedAt(current);
        companyPackageSelected.setCreatedBy(username);
        companyPackageSelected.setUpdatedBy(username);
        companyPackageSelected.setPackageStatus(PackageStatus.PENDING_PAYMENT);
        companyPackageSelected.setTransactionConsumption(0);
        companyPackageSelected.setPriceConsumption(BigDecimal.ZERO);
        companyPackageSelected =  this.companyPackageSelectedRepository.save(companyPackageSelected);

        // Create Invoice
        this.invoiceService.createInvoice(companyPackageSelected);

        return companyPackageSelected;
    }

    @Override
    public CompanyPackageSelected updateSelectedPackageConsumption(UUID requestId, Long selectedPackageId,
                                                                   SelectedPackageUpdateConsumptionRequest selectedPackageUpdateConsumptionRequest) {
        Optional<CompanyPackageSelected> companyPackageSelectedOptional = companyPackageSelectedRepository.findById(selectedPackageId);

        if(companyPackageSelectedOptional.isEmpty())
            throw new BadRequestException("There is no package exist for this id");

        CompanyPackageSelected companyPackageSelected = companyPackageSelectedOptional.get();
        companyPackageSelected.setTransactionConsumption(selectedPackageUpdateConsumptionRequest.getTransactionConsumption());
        companyPackageSelected.setPriceConsumption(BigDecimal.valueOf(selectedPackageUpdateConsumptionRequest.getPriceConsumption()));

        companyPackageSelected =  this.companyPackageSelectedRepository.save(companyPackageSelected);

        return companyPackageSelected;
    }

    @Override
    public CompanyPackageSelectedResponse findAllSelectedPackages(UUID requestId, String accountName, String packageName, int pageNumber, int pageSize, PackageStatus packageStatus) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize);
        if (!StringUtils.isBlank(accountName) || !StringUtils.isBlank(packageName) || packageStatus != null) {
            List<CompanyPackageSelected> pageContent = companyPackageSelectedRepository.findAllSearchedByCompanyName(accountName, packageName, pageable, packageStatus ).getContent();
            long totalRecords = companyPackageSelectedRepository.findAllSearchedByCompanyName(accountName, packageName, pageable, packageStatus).getTotalElements();
            return new CompanyPackageSelectedResponse(totalRecords, pageContent);
        } else {
            List<CompanyPackageSelected> pageContent = companyPackageSelectedRepository.findAllSelectedPackages(pageable).getContent();
            long totalRecords = companyPackageSelectedRepository.findAllSelectedPackages(pageable).getTotalElements();
            return new CompanyPackageSelectedResponse(totalRecords,pageContent);
        }
    }

    @Override
    public Company subscribePostpaidBundle(Long id) {
        Optional<Company> companyOptional = this.companyRepository.findById(id);

        if(companyOptional.isEmpty()) {
            throw new BadRequestException("Company does not exist");
        }
        Company company = companyOptional.get();
        company.setServicesPostpaidSubscribed(true);
        company.setServicesPostpaidSubscriptionDate(Timestamp.from(Instant.now()));

        return this.companyRepository.save(company);
    }

    @Override
    public SubscribedServiceResponse checkIsServiceSubscribed(UUID requestId, Long companyId, Long serviceId) {
        Optional<com.azm.apihub.backend.entities.CompanyService> companyServiceOptional = companyServiceRepository.findByCompanyIdAndServiceId(companyId, serviceId);
        return new SubscribedServiceResponse(companyServiceOptional.isPresent());
    }

    @Override
    public IsServiceHeadSubscribe checkIsServiceHeadSubscribedByCompany(Long companyId, Long serviceHeadId) {
        var result = accountServiceHeadSubscriptionRepository.findAllByCompanyIdAndServiceHeadId(companyId, serviceHeadId);

        return new IsServiceHeadSubscribe(!result.isEmpty());

    }


    private Company convertToEntity(CompanyRequest companyRequest) {
        Company company =  modelMapper.map(companyRequest, Company.class);

        company.setCompanyName(companyRequest.getCompanyName().trim());
        company.setCompanyEmail(companyRequest.getCompanyEmail().trim());
        company.setCompanyWebsite(companyRequest.getCompanyWebsite().trim());
        company.setExpiryDate(Timestamp.valueOf(companyRequest.getExpiryDate().atStartOfDay()));
        company.setIssueDate(Timestamp.valueOf(companyRequest.getIssueDate().atStartOfDay()));

        return company;
    }

    private LookupValue getLookupValue(long lookupId, String fieldName) {
        Optional<LookupValue> lookupValueOptional = lookupValueRepository.findById(lookupId);
        if (lookupValueOptional.isEmpty()) {
            throw new BadRequestException(fieldName + " does not exist");
        }

        return lookupValueOptional.get();
    }
}