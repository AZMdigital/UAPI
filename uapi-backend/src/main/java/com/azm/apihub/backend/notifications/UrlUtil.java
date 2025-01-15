package com.azm.apihub.backend.notifications;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;

public class UrlUtil {
    public static String getBaseUrl(HttpServletRequest request) {

        String url = ServletUriComponentsBuilder
                .fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
        return url;
    }
}