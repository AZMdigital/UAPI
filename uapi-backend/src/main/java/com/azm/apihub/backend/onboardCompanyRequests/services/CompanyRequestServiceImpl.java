package com.azm.apihub.backend.onboardCompanyRequests.services;

import com.azm.apihub.backend.attachments.models.AttachmentDTO;
import com.azm.apihub.backend.attachments.repository.AttachmentRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.entities.*;
import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.lookups.repository.LookupValueRepository;
import com.azm.apihub.backend.onboardCompanyRequests.models.CompanyRequestDTO;
import com.azm.apihub.backend.onboardCompanyRequests.models.enums.OnboardCompanyRequestStatus;
import com.azm.apihub.backend.onboardCompanyRequests.repository.CompanyRequestAttachmentRepository;
import com.azm.apihub.backend.onboardCompanyRequests.repository.CompanyRequestRepository;
import com.azm.apihub.backend.packages.repository.PackageRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import static java.util.function.Predicate.not;

@Slf4j
@Service
public class CompanyRequestServiceImpl implements CompanyRequestService {

    private final CompanyRequestRepository companyRequestRepository;
    private final CompanyRepository companyRepository;
    private final LookupValueRepository lookupValueRepository;
    private final CompanyRequestAttachmentRepository companyRequestAttachmentRepository;
    private final AttachmentRepository attachmentRepository;
    private final PackageRepository packageRepository;
    private final ModelMapper modelMapper;


    public CompanyRequestServiceImpl(CompanyRequestRepository companyRequestRepository, CompanyRepository companyRepository, LookupValueRepository lookupValueRepository, CompanyRequestAttachmentRepository companyRequestAttachmentRepository, AttachmentRepository attachmentRepository, PackageRepository packageRepository) {
        this.companyRequestRepository = companyRequestRepository;
        this.companyRepository = companyRepository;
        this.lookupValueRepository = lookupValueRepository;
        this.companyRequestAttachmentRepository = companyRequestAttachmentRepository;
        this.attachmentRepository = attachmentRepository;
        this.packageRepository = packageRepository;
        this.modelMapper = new ModelMapper();
    }


    @Override
    public List<OnboardCompanyRequest> getAllCompanyRequests() {
        return companyRequestRepository.findAll();
    }

    private void isCompanyExist(CompanyRequestDTO companyRequest) {
        List<OnboardCompanyRequest> companyRequestsExist = companyRequestRepository.findByCompanyNameOrCompanyEmailOrCompanyWebsiteOrCompanyUnifiedNationalNumberOrCompanyTaxNumberOrCompanyCommercialRegistry(
                companyRequest.getCompanyName().trim(), companyRequest.getCompanyEmail().trim(), companyRequest.getCompanyWebsite().trim(),
                companyRequest.getCompanyUnifiedNationalNumber(), companyRequest.getCompanyTaxNumber(),
                companyRequest.getCompanyCommercialRegistry()
        );

        if(!companyRequestsExist.isEmpty())
            throw new BadRequestException("Company request already exists");

        List<Company> existingCompany = companyRepository.findByCompanyNameOrCompanyEmailOrCompanyWebsiteOrUnifiedNationalNumberOrTaxNumberOrCommercialRegistry(
                companyRequest.getCompanyName().trim(), companyRequest.getCompanyEmail().trim(), companyRequest.getCompanyWebsite().trim(),
                companyRequest.getCompanyUnifiedNationalNumber(), companyRequest.getCompanyTaxNumber(),
                companyRequest.getCompanyCommercialRegistry()
        );

        if(!existingCompany.isEmpty())
            throw new BadRequestException("Company already exists");
    }

    @Override
    @Transactional
    public OnboardCompanyRequest createCompanyRequest(CompanyRequestDTO companyRequest) {
        Timestamp now = Timestamp.from(Instant.now());

        isCompanyExist(companyRequest);

        OnboardCompanyRequest onboardCompanyRequest = modelMapper.map(companyRequest, OnboardCompanyRequest.class);


        String requestNumber = UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
        onboardCompanyRequest.setRequestNumber("REQ-"+requestNumber.substring(0, 8).toUpperCase());
        onboardCompanyRequest.setCompanySector(getLookupValue(companyRequest.getCompanySectorId(), "Sector"));

        onboardCompanyRequest.setCompanyAddressCity(getLookupValue(companyRequest.getCompanyAddressCityId(), "City"));

        onboardCompanyRequest.setCompanyEmail(companyRequest.getCompanyEmail().trim());
        onboardCompanyRequest.setCompanyIssueDate(Timestamp.valueOf(companyRequest.getCompanyIssueDate().atStartOfDay()));
        onboardCompanyRequest.setCompanyExpiryDate(Timestamp.valueOf(companyRequest.getCompanyExpiryDate().atStartOfDay()));
        onboardCompanyRequest.setCompanyIssueDateHijri(Timestamp.valueOf(companyRequest.getCompanyIssueDateHijri().atStartOfDay()));
        onboardCompanyRequest.setCompanyExpiryDateHijri(Timestamp.valueOf(companyRequest.getCompanyExpiryDateHijri().atStartOfDay()));
        onboardCompanyRequest.setCreatedAt(now);
        onboardCompanyRequest.setUpdatedAt(now);
        onboardCompanyRequest.setStatus(OnboardCompanyRequestStatus.DRAFT.getValue());
        onboardCompanyRequest.setIsDeleted(false);

        onboardCompanyRequest.setCompanyUserUsername(companyRequest.getCompanyUserUsername().trim());
        onboardCompanyRequest.setCompanyRepCity(getLookupValue(companyRequest.getCompanyRepCityId(), "Company Rep City"));

        if(companyRequest.getAnnualPackageId() == null)
            throw new BadRequestException("Annual package is required");

        Package annualPackage = packageRepository.findById(companyRequest.getAnnualPackageId())
                .orElseThrow(() -> new EntityNotFoundException("Annual Package not found"));

        onboardCompanyRequest.setAnnualPackage(annualPackage);

        if(companyRequest.getServicePackageId() != null) {
            Package servicePackage = packageRepository.findById(companyRequest.getServicePackageId())
                    .orElseThrow(() -> new EntityNotFoundException("Service Package not found"));
            onboardCompanyRequest.setServicePackage(servicePackage);
        }

        OnboardCompanyRequest savedCompanyRequest = companyRequestRepository.save(onboardCompanyRequest);

        associateAttachmentsWithTheCompanyRequest(savedCompanyRequest, companyRequest.getCompanyAttachmentRequestList());

        savedCompanyRequest.setAttachmentList(getCompanyRequestAttachments(savedCompanyRequest.getId()));
        return savedCompanyRequest;
    }

    public void associateAttachmentsWithTheCompanyRequest(OnboardCompanyRequest createdCompanyRequest, List<CompanyAttachmentRequest> companyAttachmentRequestList) {
        if(companyAttachmentRequestList == null) {
            return;
        }

        // Create CompanyAttachment instances and associate with the company request
        List<OnboardCompanyRequestAttachment> companyAttachments = companyAttachmentRequestList.stream()
                .map(attachmentDetails -> {
                    OnboardCompanyRequestAttachment onboardCompanyRequestAttachment = new OnboardCompanyRequestAttachment();
                    onboardCompanyRequestAttachment.setOnboardCompanyRequest(createdCompanyRequest);

                    // Fetch attachment from the database using its ID
                    Attachment attachment = attachmentRepository.findById(attachmentDetails.getAttachmentId())
                            .orElseThrow(() -> new BadRequestException("Attachment not found"));

                    onboardCompanyRequestAttachment.setAttachment(attachment);
                    onboardCompanyRequestAttachment.setAttachmentType(attachmentDetails.getAttachmentType());
                    onboardCompanyRequestAttachment.setCreatedAt(Timestamp.from(Instant.now()));

                    return onboardCompanyRequestAttachment;
                })
                .toList();

        companyRequestAttachmentRepository.saveAll(companyAttachments);
    }

    @Override
    public OnboardCompanyRequest getCompanyRequestById(Long id) {
        OnboardCompanyRequest companyRequest = companyRequestRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BadRequestException("Company Request not found"));

        companyRequest.setAttachmentList(getCompanyRequestAttachments(id));

        return companyRequest;
    }

    @Override
    public OnboardCompanyRequest getCompanyRequestByRequestNumber(String number) {
        OnboardCompanyRequest companyRequest =  companyRequestRepository.findByCompanyCommercialRegistryOrCompanyUnifiedNationalNumberAndIsDeletedFalse(number)
                .orElseThrow(() -> new BadRequestException("Company Request not found"));

        companyRequest.setAttachmentList(getCompanyRequestAttachments(companyRequest.getId()));

        return companyRequest;
    }

    @Override
    @Transactional
    public OnboardCompanyRequest updateCompanyRequest(Long id, CompanyRequestDTO companyRequest) {
        OnboardCompanyRequest onboardCompanyRequest = companyRequestRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new BadRequestException("Company Request not found"));

        Timestamp now = Timestamp.from(Instant.now());

        onboardCompanyRequest.setCompanyName(companyRequest.getCompanyName());
        onboardCompanyRequest.setCompanyWebsite(companyRequest.getCompanyWebsite().trim());
        onboardCompanyRequest.setCompanyEmail(companyRequest.getCompanyEmail().trim());
        onboardCompanyRequest.setCompanyTaxNumber(companyRequest.getCompanyTaxNumber());
        onboardCompanyRequest.setCompanyCommercialRegistry(companyRequest.getCompanyCommercialRegistry());
        onboardCompanyRequest.setCompanyUnifiedNationalNumber(companyRequest.getCompanyUnifiedNationalNumber());
        onboardCompanyRequest.setCompanyIssueDate(Timestamp.valueOf(companyRequest.getCompanyIssueDate().atStartOfDay()));
        onboardCompanyRequest.setCompanyExpiryDate(Timestamp.valueOf(companyRequest.getCompanyExpiryDate().atStartOfDay()));
        onboardCompanyRequest.setCompanyIssueDateHijri(Timestamp.valueOf(companyRequest.getCompanyIssueDateHijri().atStartOfDay()));
        onboardCompanyRequest.setCompanyExpiryDateHijri(Timestamp.valueOf(companyRequest.getCompanyExpiryDateHijri().atStartOfDay()));

        onboardCompanyRequest.setCompanyAddressBuildingNumber(companyRequest.getCompanyAddressBuildingNumber());
        onboardCompanyRequest.setCompanyAddressSecondaryNumber(companyRequest.getCompanyAddressSecondaryNumber());
        onboardCompanyRequest.setCompanyAddressDistrict(companyRequest.getCompanyAddressDistrict());
        onboardCompanyRequest.setCompanyAddressPostalCode(companyRequest.getCompanyAddressPostalCode());
        onboardCompanyRequest.setCompanyAddressCountry(companyRequest.getCompanyAddressCountry());
        onboardCompanyRequest.setCompanyAddressCity(getLookupValue(companyRequest.getCompanyAddressCityId(), "City"));

        onboardCompanyRequest.setCompanyRepFirstName(companyRequest.getCompanyRepFirstName().trim());
        onboardCompanyRequest.setCompanyRepLastName(companyRequest.getCompanyRepLastName().trim());
        onboardCompanyRequest.setCompanyRepNationalId(companyRequest.getCompanyRepNationalId().trim());
        onboardCompanyRequest.setCompanyRepEmail(companyRequest.getCompanyRepEmail().trim());
        onboardCompanyRequest.setCompanyRepMobile(companyRequest.getCompanyRepMobile().trim());
        onboardCompanyRequest.setCompanyRepMobile(companyRequest.getCompanyRepMobile().trim());
        onboardCompanyRequest.setCompanyRepCity(getLookupValue(companyRequest.getCompanyRepCityId(), "Company Rep City"));

        onboardCompanyRequest.setCompanyUserFirstName(companyRequest.getCompanyUserFirstName().trim());
        onboardCompanyRequest.setCompanyUserLastName(companyRequest.getCompanyUserLastName().trim());
        onboardCompanyRequest.setCompanyUserNationalId(companyRequest.getCompanyUserNationalId().trim());
        onboardCompanyRequest.setCompanyUserEmail(companyRequest.getCompanyUserEmail().trim());
        onboardCompanyRequest.setCompanyUserUsername(companyRequest.getCompanyUserUsername().trim());
        onboardCompanyRequest.setCompanyUserContactNo(companyRequest.getCompanyUserContactNo().trim());

        onboardCompanyRequest.setCompanySector(getLookupValue(companyRequest.getCompanySectorId(), "Sector"));
        onboardCompanyRequest.setAgreedToTermsAndConditions(companyRequest.getAgreedToTermsAndConditions());
        onboardCompanyRequest.setAgreedToTermsAndConditions(companyRequest.getAgreedToTermsAndConditions());
        onboardCompanyRequest.setIsDeleted(false);

        onboardCompanyRequest.setUpdatedAt(now);

        if(companyRequest.getAnnualPackageId() == null)
            throw new BadRequestException("Annual package is required");

        Package annualPackage = packageRepository.findById(companyRequest.getAnnualPackageId())
                .orElseThrow(() -> new EntityNotFoundException("Annual Package not found"));

        onboardCompanyRequest.setAnnualPackage(annualPackage);

        if(companyRequest.getServicePackageId() != null) {
            Package servicePackage = packageRepository.findById(companyRequest.getServicePackageId())
                    .orElseThrow(() -> new EntityNotFoundException("Service Package not found"));
            onboardCompanyRequest.setServicePackage(servicePackage);
        }

        OnboardCompanyRequest updatedCompanyRequest = companyRequestRepository.save(onboardCompanyRequest);

        List<CompanyAttachmentRequest> attachments = companyRequest.getCompanyAttachmentRequestList();
        if(attachments == null) {
            return updatedCompanyRequest;
        }

        Set<Long> attachmentIds = attachments.stream()
                .map(CompanyAttachmentRequest::getAttachmentId)
                .collect(Collectors.toCollection(HashSet::new));

        List<Object[]> existingAttachmentData = companyRequestAttachmentRepository.findCompanyAttachmentByOnboardCompanyRequestId(id);

        Set<Long> existingAttachmentIds = existingAttachmentData.stream()
                .map(this::mapCompanyAttachmentToDTO)
                .map(AttachmentDTO::getId)
                .collect(Collectors.toCollection(HashSet::new));

        List<CompanyAttachmentRequest> addedAttachments = attachments.stream()
                .filter(not(att -> existingAttachmentIds.contains(att.getAttachmentId())))
                .toList();

        associateAttachmentsWithTheCompanyRequest(updatedCompanyRequest, addedAttachments);

        List<Long> deletedAttachmentIds = existingAttachmentIds.stream()
                .filter(not(attachmentIds::contains))
                .toList();

        deletedAttachmentIds.forEach(attachmentId -> {
            companyRequestAttachmentRepository.deleteByOnboardCompanyRequestIdAndAttachmentId(id, attachmentId);
        });

        updatedCompanyRequest.setAttachmentList(getCompanyRequestAttachments(id));
        return updatedCompanyRequest;
    }

    @Override
    @Transactional
    public void deleteCompanyRequest(Long id) {
        Optional<OnboardCompanyRequest> optionalOnboardCompanyRequest = companyRequestRepository.findByIdAndIsDeletedFalse(id);
        if (optionalOnboardCompanyRequest.isEmpty())
            throw new BadRequestException("Company Request not found");

        companyRequestRepository.softDeleteById(id, Timestamp.from(Instant.now()));
    }

    private LookupValue getLookupValue(long lookupId, String fieldName) {
        Optional<LookupValue> lookupValueOptional = lookupValueRepository.findById(lookupId);
        if (lookupValueOptional.isEmpty()) {
            throw new BadRequestException(fieldName + " does not exist");
        }

        return lookupValueOptional.get();
    }

    private List<AttachmentDTO> getCompanyRequestAttachments(Long companyRequestId) {
        List<Object[]> attachmentData = companyRequestAttachmentRepository.findCompanyAttachmentByOnboardCompanyRequestId(companyRequestId);

        return attachmentData.stream()
                .map(this::mapCompanyAttachmentToDTO)
                .toList();
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
}