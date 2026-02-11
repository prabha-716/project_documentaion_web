package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String usedTechs;
    private String filePath;
    private String githubLink;
    private String documents;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
