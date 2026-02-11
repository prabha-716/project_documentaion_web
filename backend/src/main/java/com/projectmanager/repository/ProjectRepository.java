package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
    List<Project> findByOwnerOrderByLastModifiedDateDesc(User owner);
    Optional<Project> findByIdAndOwner(Long id, User owner);
}
