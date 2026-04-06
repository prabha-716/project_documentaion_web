package com.projectmanager.service;

import com.projectmanager.dto.ProjectWithRatingResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.RatingRepository;
import com.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublicProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get a single project by ID (public access, no ownership check)
     */
    public ProjectWithRatingResponse getProjectById(Long projectId, Optional<Long> currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToProjectWithRatingResponse(project, currentUserId.orElse(null));
    }

    /**
     * Get all public projects with pagination
     */
    public Page<ProjectWithRatingResponse> getAllPublicProjects(Pageable pageable, Optional<Long> currentUserId) {
        Page<Project> projects = projectRepository.findByIsPublicTrueOrderByLastModifiedDateDesc(pageable);
        return projects.map(project -> mapToProjectWithRatingResponse(project, currentUserId.orElse(null)));
    }

    /**
     * Search public projects by title, tech, or author
     */
    public Page<ProjectWithRatingResponse> searchPublicProjects(String query, Pageable pageable, Optional<Long> currentUserId) {
        Page<Project> projects = projectRepository.searchPublicProjects(query, pageable);
        return projects.map(project -> mapToProjectWithRatingResponse(project, currentUserId.orElse(null)));
    }

    /**
     * Get top-rated public projects
     */
    public List<ProjectWithRatingResponse> getTopRatedProjects(int limit, Optional<Long> currentUserId) {
        Page<Project> projects = projectRepository.findByIsPublicTrueOrderByLastModifiedDateDesc(
                org.springframework.data.domain.PageRequest.of(0, limit));

        return projects.getContent().stream()
                .map(project -> mapToProjectWithRatingResponse(project, currentUserId.orElse(null)))
                .sorted((p1, p2) -> Double.compare(p2.getAverageRating() != null ? p2.getAverageRating() : 0,
                        p1.getAverageRating() != null ? p1.getAverageRating() : 0))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Get public profile of a user with their projects
     */
    public List<ProjectWithRatingResponse> getUserPublicProjects(Long userId, Optional<Long> currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsPublic()) {
            throw new RuntimeException("This user's profile is private");
        }

        List<Project> projects = projectRepository.findByOwnerIdAndIsPublicTrue(userId);
        return projects.stream()
                .map(project -> mapToProjectWithRatingResponse(project, currentUserId.orElse(null)))
                .collect(Collectors.toList());
    }

    /**
     * Map Project to ProjectWithRatingResponse including rating statistics
     */
    private ProjectWithRatingResponse mapToProjectWithRatingResponse(Project project, Long currentUserId) {
        ProjectWithRatingResponse response = new ProjectWithRatingResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setUsedTechs(project.getUsedTechs());
        response.setFilePath(project.getFilePath());
        response.setGithubLink(project.getGithubLink());
        response.setDocuments(project.getDocuments());
        response.setOwnerId(project.getOwner().getId());
        response.setOwnerName(project.getOwner().getName());
        response.setIsPublic(project.getIsPublic());
        response.setCreatedDate(project.getCreatedDate());
        response.setLastModifiedDate(project.getLastModifiedDate());

        Double averageRating = ratingRepository.getAverageRatingForProject(project.getId());
        Long totalRatings = ratingRepository.countByProjectId(project.getId());

        response.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : null);
        response.setTotalRatings(totalRatings != null ? totalRatings : 0);

        if (currentUserId != null) {
            Optional<Integer> userRating = ratingRepository.getUserRatingForProject(project.getId(), currentUserId);
            response.setUserRating(userRating.orElse(null));
        }

        return response;
    }
}