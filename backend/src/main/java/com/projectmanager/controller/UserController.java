package com.projectmanager.controller;

import com.projectmanager.dto.UserProfileResponse;
import com.projectmanager.dto.UserProfileUpdateRequest;
import com.projectmanager.dto.UserResponse;
import com.projectmanager.entity.User;
import com.projectmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get user profile with statistics
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable Long userId) {
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Get current user's profile
     */
    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = userService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    /**
     * Update user profile (name, bio, etc.)
     */
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(
            @Valid @RequestBody UserProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User updatedUser = userService.updateUserProfile(userDetails.getUsername(), request);
        UserResponse response = mapToUserResponse(updatedUser);

        return ResponseEntity.ok(response);
    }

    /**
     * Toggle project visibility (public/private)
     */
    @PatchMapping("/profile/visibility")
    public ResponseEntity<UserResponse> toggleVisibility(
            @RequestBody VisibilityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User updatedUser = userService.toggleProjectVisibility(userDetails.getUsername(), request.getIsPublic());
        UserResponse response = mapToUserResponse(updatedUser);

        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to map User to UserResponse
     */
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setProfileImage(user.getProfileImage());
        response.setProvider(user.getProvider());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    /**
     * Inner class for visibility request
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class VisibilityRequest {
        private Boolean isPublic;
    }
}