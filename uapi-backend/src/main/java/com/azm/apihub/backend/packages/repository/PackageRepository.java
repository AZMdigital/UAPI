package com.azm.apihub.backend.packages.repository;

import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.entities.PackageType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findAllByPackageTypeOrderByIdAsc(PackageType packageType);
}