package com.projectmanager.security;

import com.projectmanager.entity.User;
import com.projectmanager.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getAttribute("sub");
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProfileImage(picture);
            user.setGoogleId(googleId);
            user.setProvider("GOOGLE");
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(email);
        
        // Redirect to frontend with token
        String targetUrl = "http://localhost:3000/oauth/callback?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
