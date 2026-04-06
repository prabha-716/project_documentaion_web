package com.projectmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String googleId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    private String profileImage;

    private String password; // For username/password login

    @Column(nullable = false)
    private String provider = "GOOGLE"; // GOOGLE or LOCAL

    @Column(columnDefinition = "TEXT")
    private String bio; // User bio/description

    @Column(name  = "is_public",nullable = false)
    private Boolean isPublic = true; // Profile visibility

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isPublic == null) {
            isPublic = true;
        }
    }
}