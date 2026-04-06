package com.projectmanager.repository;

import com.projectmanager.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Get all ratings for a project
    List<Rating> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    // Get all ratings with pagination
    Page<Rating> findByProjectIdOrderByCreatedAtDesc(Long projectId, Pageable pageable);

    // Check if user has already rated a project
    Optional<Rating> findByProjectIdAndUserId(Long projectId, Long userId);

    // Get user's ratings
    List<Rating> findByUserId(Long userId);

    // Get total ratings for a project
    Long countByProjectId(Long projectId);

    // Get average rating for a project
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.project.id = ?1")
    Double getAverageRatingForProject(Long projectId);

    // Get total ratings received by a user
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.project.owner.id = ?1")
    Long getTotalRatingsForUser(Long userId);

    // Get average rating of all projects by a user
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.project.owner.id = ?1")
    Double getAverageRatingForUser(Long userId);

    // Get user's rating for a project
    @Query("SELECT r.rating FROM Rating r WHERE r.project.id = ?1 AND r.user.id = ?2")
    Optional<Integer> getUserRatingForProject(Long projectId, Long userId);
}