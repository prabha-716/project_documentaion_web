package com.projectmanager.service;

import com.projectmanager.dto.ProjectRequest;
import com.projectmanager.dto.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ProjectResponse createProject(ProjectRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUsedTechs(request.getUsedTechs());
        project.setFilePath(request.getFilePath());
        project.setGithubLink(request.getGithubLink());
        project.setDocuments(request.getDocuments());
        project.setOwner(user);
        
        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }
    
    public List<ProjectResponse> getAllUserProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Project> projects = projectRepository.findByOwnerOrderByLastModifiedDateDesc(user);
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectResponse getProjectById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Project project = projectRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        
        return mapToProjectResponse(project);
    }
    
    public ProjectResponse updateProject(Long id, ProjectRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Project project = projectRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUsedTechs(request.getUsedTechs());
        project.setFilePath(request.getFilePath());
        project.setGithubLink(request.getGithubLink());
        project.setDocuments(request.getDocuments());
        
        Project updatedProject = projectRepository.save(project);
        return mapToProjectResponse(updatedProject);
    }
    
    public void deleteProject(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Project project = projectRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        
        projectRepository.delete(project);
    }
    
    private ProjectResponse mapToProjectResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setUsedTechs(project.getUsedTechs());
        response.setFilePath(project.getFilePath());
        response.setGithubLink(project.getGithubLink());
        response.setDocuments(project.getDocuments());
        response.setOwnerId(project.getOwner().getId());
        response.setOwnerName(project.getOwner().getName());
        response.setCreatedDate(project.getCreatedDate());
        response.setLastModifiedDate(project.getLastModifiedDate());
        return response;
    }
}
