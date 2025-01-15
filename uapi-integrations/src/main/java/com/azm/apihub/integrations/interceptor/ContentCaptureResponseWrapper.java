package com.azm.apihub.integrations.interceptor;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class ContentCaptureResponseWrapper extends HttpServletResponseWrapper {
        private final ByteArrayOutputStream content = new ByteArrayOutputStream();
        private ServletOutputStream outputStream;
        private PrintWriter writer;
        private boolean getOutputStreamCalled = false;
        private boolean getWriterCalled = false;

        public ContentCaptureResponseWrapper(HttpServletResponse response) {
            super(response);
        }

        @Override
        public ServletOutputStream getOutputStream() {
            if (getWriterCalled) {
                throw new IllegalStateException("getWriter() has already been called for this response");
            }
            if (outputStream == null) {
                outputStream = new ServletOutputStream() {
                    @Override
                    public boolean isReady() {
                        return false;
                    }
                    @Override
                    public void setWriteListener(WriteListener listener) {
                    }
                    @Override
                    public void write(int b) throws IOException {
                        content.write(b);
                    }
                };
            }
            getOutputStreamCalled = true;
            return outputStream;
        }

        @Override
        public PrintWriter getWriter() {
            if (getOutputStreamCalled) {
                throw new IllegalStateException("getOutputStream() has already been called for this response");
            }
            if (writer == null) {
                writer = new PrintWriter(content, true);
            }
            getWriterCalled = true;
            return writer;
        }

        public String getContent() throws UnsupportedEncodingException {
            if (writer != null) {
                writer.flush();
            }
            return content.toString("UTF-8"); // Convert the output stream to a string
        }
    }