package com.projectmanager.repository;

import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Existing methods
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);

    // Get all public users with ratings
    @Query("SELECT u FROM User u WHERE u.isPublic = true AND SIZE(u.ratings) > 0 " +
            "ORDER BY (SELECT AVG(r.rating) FROM Rating r WHERE r.user = u) DESC")

    boolean existsByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.isPublic = true ORDER BY (SELECT COALESCE(AVG(r.rating), 0) FROM Rating r WHERE r.user = u) DESC")
    List<User> findTopRatedPublicUsers();

}