package com.azm.apihub.integrations.exceptions;

import org.apache.commons.lang3.tuple.Pair;

public class GlobalExceptionHandlerHolder {
    private static final ThreadLocal<Pair<String, Exception>> EXCEPTION_THREAD_LOCAL = new ThreadLocal<>();

    public static void setException(String errorCode, Exception exception) {
        EXCEPTION_THREAD_LOCAL.set(Pair.of(errorCode, exception));
    }

    public static Exception getException() {
        return EXCEPTION_THREAD_LOCAL.get() != null ? EXCEPTION_THREAD_LOCAL.get().getRight() : null;
    }

    public static String getErrorCode() {
        return EXCEPTION_THREAD_LOCAL.get() != null ? EXCEPTION_THREAD_LOCAL.get().getLeft() : null;
    }

    public static Pair<String, Exception> getErrorCodeAndException() {
        return EXCEPTION_THREAD_LOCAL.get();
    }

    public static void clearException() {
        EXCEPTION_THREAD_LOCAL.remove();
    }
}
