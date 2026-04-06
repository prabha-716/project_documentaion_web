package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Existing methods
    List<Project> findByOwnerOrderByLastModifiedDateDesc(User owner);
    Optional<Project> findByIdAndOwner(Long id, User owner);

    // New methods for public projects
    Page<Project> findByIsPublicTrueOrderByLastModifiedDateDesc(Pageable pageable);

    // Search public projects by title or description
    @Query("SELECT p FROM Project p WHERE p.isPublic = true AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(p.usedTechs) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(p.owner.name) LIKE LOWER(CONCAT('%', ?1, '%')))")
    Page<Project> searchPublicProjects(String searchQuery, Pageable pageable);

    // Get all public projects by a user
    List<Project> findByOwnerIdAndIsPublicTrue(Long userId);

    // Count public projects by user
    Long countByOwnerIdAndIsPublicTrue(Long userId);
}