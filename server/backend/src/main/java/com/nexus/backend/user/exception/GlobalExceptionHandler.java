package com.nexus.backend.user.exception;

import com.nexus.backend.user.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handle(BusinessException e) {

        return ResponseEntity
                .status(e.getStatus())
                .body(
                        new ErrorResponse(
                                e.getMessage(),
                                e.getStatus().value()
                        )
                );
    }
}