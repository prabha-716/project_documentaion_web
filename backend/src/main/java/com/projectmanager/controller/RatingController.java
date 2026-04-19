package com.projectmanager.controller;

import com.projectmanager.dto.RatingRequest;
import com.projectmanager.dto.RatingResponse;
import com.projectmanager.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    /**
     * Create or update a rating for a project
     */
    @PostMapping
    public ResponseEntity<RatingResponse> rateProject(
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RatingResponse response = ratingService.rateProject(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all ratings for a specific project
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<RatingResponse>> getProjectRatings(
            @PathVariable Long projectId) {
        List<RatingResponse> ratings = ratingService.getProjectRatings(projectId);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get a specific rating
     */
    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> getRating(
            @PathVariable Long ratingId) {
        RatingResponse response = ratingService.getRatingById(ratingId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a rating
     */
    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> updateRating(
            @PathVariable Long ratingId,
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RatingResponse response = ratingService.updateRating(ratingId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a rating
     */
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable Long ratingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ratingService.deleteRating(ratingId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    /**
     * Get average rating for a project
     */
    @GetMapping("/project/{projectId}/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long projectId) {
        Double averageRating = ratingService.getAverageRating(projectId);
        return ResponseEntity.ok(averageRating);
    }
}