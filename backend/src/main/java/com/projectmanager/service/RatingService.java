package com.projectmanager.service;

import com.projectmanager.dto.RatingRequest;
import com.projectmanager.dto.RatingResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Rating;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.RatingRepository;
import com.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create or update a rating for a project
     */
    public RatingResponse rateProject(RatingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if user already rated this project
        Optional<Rating> existingRating = ratingRepository.findByProjectIdAndUserId(
                request.getProjectId(), user.getId());

        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
        } else {
            // Create new rating
            rating = new Rating();
            rating.setProject(project);
            rating.setUser(user);
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
        }

        Rating savedRating = ratingRepository.save(rating);
        return mapToRatingResponse(savedRating);
    }

    /**
     * Get all ratings for a project
     */
    public List<RatingResponse> getProjectRatings(Long projectId) {
        List<Rating> ratings = ratingRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific rating
     */
    public RatingResponse getRatingById(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        return mapToRatingResponse(rating);
    }

    /**
     * Update a rating
     */
    public RatingResponse updateRating(Long ratingId, RatingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        // Check if user is the owner of the rating
        if (!rating.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Cannot update other user's rating");
        }

        rating.setRating(request.getRating());
        rating.setComment(request.getComment());

        Rating updatedRating = ratingRepository.save(rating);
        return mapToRatingResponse(updatedRating);
    }

    /**
     * Delete a rating
     */
    public void deleteRating(Long ratingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        // Check if user is the owner of the rating
        if (!rating.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Cannot delete other user's rating");
        }

        ratingRepository.delete(rating);
    }

    /**
     * Get average rating for a project
     */
    public Double getAverageRating(Long projectId) {
        return ratingRepository.getAverageRatingForProject(projectId);
    }

    /**
     * Get total ratings count for a project
     */
    public Long getTotalRatingsCount(Long projectId) {
        return ratingRepository.countByProjectId(projectId);
    }

    /**
     * Get user's rating for a specific project
     */
    public Optional<Integer> getUserProjectRating(Long projectId, Long userId) {
        return ratingRepository.getUserRatingForProject(projectId, userId);
    }

    /**
     * Utility method to map Rating to RatingResponse
     */
    private RatingResponse mapToRatingResponse(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setProjectId(rating.getProject().getId());
        response.setUserId(rating.getUser().getId());
        response.setUserName(rating.getUser().getName());
        response.setUserProfileImage(rating.getUser().getProfileImage());
        response.setRating(rating.getRating());
        response.setComment(rating.getComment());
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        return response;
    }
}