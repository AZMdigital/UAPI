package com.azm.apihub.backend.packages.services;

import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.packages.models.CreatePackageRequest;
import com.azm.apihub.backend.packages.models.UpdatePackageRequest;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;

public interface PackageService {
    List<Package> getPackages(PackageType packageType);

    void deletePackage(Long id);


    Package createPackage(CreatePackageRequest createPackageRequest, UserDetails userDetails);


    Package updatePackage(Long id, UpdatePackageRequest updatePackageRequest);


}
