package com.azm.apihub.backend.packages.services;

import com.azm.apihub.backend.companies.repository.CompanyPackageAllowedRepository;
import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.packages.models.CreatePackageRequest;
import com.azm.apihub.backend.packages.models.UpdatePackageRequest;
import com.azm.apihub.backend.packages.repository.PackageRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;
    private final ModelMapper modelMapper;
    private final CompanyPackageAllowedRepository companyPackageAllowedRepository;


    @Autowired
    public PackageServiceImpl(PackageRepository packageRepository, CompanyPackageAllowedRepository companyPackageAllowedRepository) {
        this.packageRepository = packageRepository;

        this.modelMapper = new ModelMapper();
        this.modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        this.companyPackageAllowedRepository = companyPackageAllowedRepository;
    }


    @Override
    public List<Package> getPackages(PackageType packageType) {
        return packageRepository.findAllByPackageTypeOrderByIdAsc(packageType);
    }

    @Override
    public void deletePackage(Long id) {
        try {
            this.packageRepository.deleteById(id);
        } catch (DataIntegrityViolationException exception) {
            throw new BadRequestException("Package is already used. Please disassociate this package from companies before deleting this");
        }
    }

    @Override
    @Transactional
    public Package createPackage(CreatePackageRequest createPackageRequest, UserDetails userDetails) {
        Package aPackage = convertToEntity(createPackageRequest, userDetails);
        Optional<Package> packageOptional = packageRepository.findAll(Sort.by(Sort.Order.desc("packageCode"))).stream().findFirst();
        if (packageOptional.isPresent()) {
            long packageCode = Long.parseLong(packageOptional.get().getPackageCode().split("P")[1]);
            aPackage.setPackageCode(String.format("P%03d", packageCode + 1));
        } else {
            aPackage.setPackageCode(String.format("P%03d", 1));
        }
        aPackage = packageRepository.save(aPackage);

        return aPackage;
    }

    @Override
    @Transactional
    public Package updatePackage(Long id, UpdatePackageRequest updatePackageRequest) {

        Package aPackage = convertToUpdatedEntity(this.packageRepository.findById(id).orElseThrow(() -> new BadRequestException("Package does not exist")),
                updatePackageRequest);
        boolean companyAllowedPackageExists = companyPackageAllowedRepository.existsByPackageId(id);
        if(!aPackage.getIsActive() && companyAllowedPackageExists)
        {
            throw new BadRequestException("This package is already associated with company. You cannot deactivate it.");
        }
        aPackage = packageRepository.save(aPackage);
        return aPackage;
    }

    private Package convertToEntity(CreatePackageRequest createPackageRequest, UserDetails userDetails) {
        Package aPackage =  modelMapper.map(createPackageRequest, Package.class);
        Timestamp now = Timestamp.from(Instant.now());
        aPackage.setCreatedAt(now);
        aPackage.setUpdatedAt(now);
        aPackage.setCreatedBy(userDetails.getUsername());
        aPackage.setUpdatedBy(userDetails.getUsername());
        aPackage.setIsActive(createPackageRequest.getActive());
        if(createPackageRequest.getPackageType() == PackageType.SERVICES)
            aPackage.setTransactionLimit(0L);
        return aPackage;
    }

    private Package convertToUpdatedEntity(Package current, UpdatePackageRequest updatePackageRequest) {
        Timestamp now = Timestamp.from(Instant.now());
        current.setUpdatedAt(now);
        current.setName(updatePackageRequest.getName());
        current.setArabicName(updatePackageRequest.getArabicName());
        current.setIsActive(updatePackageRequest.getActive());
        return current;
    }
}
