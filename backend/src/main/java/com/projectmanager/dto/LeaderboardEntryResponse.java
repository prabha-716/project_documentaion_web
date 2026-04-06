package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private Long userId;
    private String userName;
    private String profileImage;
    private Long totalRatings; // Total ratings received
    private Double averageRating; // Average rating of user's projects
    private Long projectCount; // Number of public projects
}