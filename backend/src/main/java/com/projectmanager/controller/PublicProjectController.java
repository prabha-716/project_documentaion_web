package com.projectmanager.controller;

import com.projectmanager.dto.ProjectWithRatingResponse;
import com.projectmanager.service.PublicProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicProjectController {

    @Autowired
    private PublicProjectService publicProjectService;

    /**
     * Get a single project by ID — no ownership check, used for rating page
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<ProjectWithRatingResponse> getPublicProjectById(
            @PathVariable Long id) {
        Optional<Long> currentUserId = getCurrentUserId();
        ProjectWithRatingResponse project = publicProjectService.getProjectById(id, currentUserId);
        return ResponseEntity.ok(project);
    }

    /**
     * Get all public projects with pagination
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getAllPublicProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Optional<Long> currentUserId = getCurrentUserId();

        Page<ProjectWithRatingResponse> projects = publicProjectService.getAllPublicProjects(pageable, currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("projects", projects.getContent());
        response.put("total", projects.getTotalElements());
        response.put("pages", projects.getTotalPages());
        response.put("currentPage", page);

        return ResponseEntity.ok(response);
    }

    /**
     * Search public projects
     */
    @GetMapping("/public/search")
    public ResponseEntity<Map<String, Object>> searchPublicProjects(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Optional<Long> currentUserId = getCurrentUserId();

        Page<ProjectWithRatingResponse> projects = publicProjectService.searchPublicProjects(q, pageable, currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("projects", projects.getContent());
        response.put("total", projects.getTotalElements());
        response.put("pages", projects.getTotalPages());
        response.put("currentPage", page);

        return ResponseEntity.ok(response);
    }

    /**
     * Get top-rated public projects
     */
    @GetMapping("/public/top-rated")
    public ResponseEntity<List<ProjectWithRatingResponse>> getTopRatedProjects(
            @RequestParam(defaultValue = "10") int limit) {

        Optional<Long> currentUserId = getCurrentUserId();
        List<ProjectWithRatingResponse> projects = publicProjectService.getTopRatedProjects(limit, currentUserId);

        return ResponseEntity.ok(projects);
    }

    /**
     * Get public projects by user
     */
    @GetMapping("/public/user/{userId}")
    public ResponseEntity<List<ProjectWithRatingResponse>> getUserPublicProjects(
            @PathVariable Long userId) {

        Optional<Long> currentUserId = getCurrentUserId();
        List<ProjectWithRatingResponse> projects = publicProjectService.getUserPublicProjects(userId, currentUserId);

        return ResponseEntity.ok(projects);
    }

    private Optional<Long> getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !(authentication.getPrincipal() instanceof String &&
                            authentication.getPrincipal().equals("anonymousUser"))) {
                return Optional.empty();
            }
        } catch (Exception e) {
            // not authenticated
        }
        return Optional.empty();
    }
}