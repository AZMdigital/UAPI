package com.azm.apihub.backend.notifications.services;

public interface ConsumptionUsageService {
    void sendConsumptionUsageNotification(Long companyId, String packageType, Double consumptionPercentage, Long companyPackageSelectedId);
}
