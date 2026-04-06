package com.projectmanager.exception;

import com.projectmanager.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Validation failed");
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle constraint violation exceptions
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex) {

        ErrorResponse error = new ErrorResponse(
                "Constraint violation: " + ex.getMessage(),
                HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Handle resource not found
     */
    @ExceptionHandler(value = {RuntimeException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleNotFoundException(RuntimeException ex) {
        if (ex.getMessage() != null && ex.getMessage().contains("not found")) {
            ErrorResponse error = new ErrorResponse(
                    ex.getMessage(),
                    HttpStatus.NOT_FOUND.value()
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // For unauthorized/access denied errors
        if (ex.getMessage() != null && ex.getMessage().contains("Unauthorized")) {
            ErrorResponse error = new ErrorResponse(
                    ex.getMessage(),
                    HttpStatus.FORBIDDEN.value()
            );
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        ErrorResponse error = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handle generic exceptions
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
                "An unexpected error occurred: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}