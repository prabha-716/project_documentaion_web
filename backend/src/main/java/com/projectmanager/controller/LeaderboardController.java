package com.projectmanager.controller;

import com.projectmanager.dto.LeaderboardEntryResponse;
import com.projectmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private UserService userService;

    /**
     * Get top-rated creators
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntryResponse>> getLeaderboard(
            @RequestParam(defaultValue = "20") int limit) {

        List<LeaderboardEntryResponse> leaderboard = userService.getLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }
}