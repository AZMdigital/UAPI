package com.azm.apihub.backend.utilities.configurations;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class GoogleSheetAuthCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String enableGoogleSheetAuth = context.getEnvironment().getProperty("apiHub.enableGoogleSheetAuth");
        return enableGoogleSheetAuth != null && Boolean.parseBoolean(enableGoogleSheetAuth);
    }
}
