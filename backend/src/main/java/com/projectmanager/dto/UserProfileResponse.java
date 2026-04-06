package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String profileImage;
        private String provider;
        private String bio;
        private Boolean isPublic;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private Long projectCount;
        private Long totalRatings;
        private Double averageRating;
    }

    private UserInfo user;
    private UserStats stats;
}