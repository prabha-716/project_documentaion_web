package com.projectmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private String usedTechs;
    private String filePath;
    private String githubLink;
    private String documents;
}
