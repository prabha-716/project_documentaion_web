package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {
    private String name;
    private String bio;
    private Boolean isPublic;
}