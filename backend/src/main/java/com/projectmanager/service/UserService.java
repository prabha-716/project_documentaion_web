package com.projectmanager.service;

import com.projectmanager.dto.UserProfileResponse;
import com.projectmanager.dto.UserProfileUpdateRequest;
import com.projectmanager.dto.LeaderboardEntryResponse;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.RatingRepository;
import com.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RatingRepository ratingRepository;

    /**
     * Get user profile with statistics
     */
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildUserProfileResponse(user);
    }

    /**
     * Get current user's profile
     */
    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildUserProfileResponse(user);
    }

    /**
     * Update user profile
     */
    public User updateUserProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        return userRepository.save(user);
    }

    /**
     * Toggle project visibility for a user
     */
    public User toggleProjectVisibility(String email, Boolean isPublic) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsPublic(isPublic);
        return userRepository.save(user);
    }

    /**
     * Get leaderboard of top-rated creators
     */
    public List<LeaderboardEntryResponse> getLeaderboard(int limit) {
        List<User> topUsers = userRepository.findTopRatedPublicUsers();

        return topUsers.stream()
                .limit(limit)
                .map(user -> {
                    LeaderboardEntryResponse entry = new LeaderboardEntryResponse();
                    entry.setUserId(user.getId());
                    entry.setUserName(user.getName());
                    entry.setProfileImage(user.getProfileImage());

                    // Get statistics
                    Long totalRatings = ratingRepository.getTotalRatingsForUser(user.getId());
                    Double averageRating = ratingRepository.getAverageRatingForUser(user.getId());
                    Long projectCount = projectRepository.countByOwnerIdAndIsPublicTrue(user.getId());

                    entry.setTotalRatings(totalRatings != null ? totalRatings : 0);
                    entry.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
                    entry.setProjectCount(projectCount != null ? projectCount : 0);

                    return entry;
                })
                .collect(Collectors.toList());
    }

    /**
     * Build user profile response with statistics
     */
    private UserProfileResponse buildUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();

        // User info
        UserProfileResponse.UserInfo userInfo = new UserProfileResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setProfileImage(user.getProfileImage());
        userInfo.setProvider(user.getProvider());
        userInfo.setBio(user.getBio());
        userInfo.setIsPublic(user.getIsPublic());
        userInfo.setCreatedAt(user.getCreatedAt());

        // User stats
        Long projectCount = projectRepository.countByOwnerIdAndIsPublicTrue(user.getId());
        Long totalRatings = ratingRepository.getTotalRatingsForUser(user.getId());
        Double averageRating = ratingRepository.getAverageRatingForUser(user.getId());

        UserProfileResponse.UserStats stats = new UserProfileResponse.UserStats();
        stats.setProjectCount(projectCount != null ? projectCount : 0);
        stats.setTotalRatings(totalRatings != null ? totalRatings : 0);
        stats.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);

        response.setUser(userInfo);
        response.setStats(stats);

        return response;
    }
}