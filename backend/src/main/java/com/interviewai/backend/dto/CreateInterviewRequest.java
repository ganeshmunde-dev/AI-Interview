package com.interviewai.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CreateInterviewRequest {

    @NotBlank(message = "Role is required")
    private String role; // frontend, react_dev, java_dev, spring_boot, php, fullstack, backend, hr

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // easy, medium, hard

    @NotBlank(message = "Type is required")
    private String type; // technical, hr, coding, mixed

    @Min(value = 1, message = "Question count must be at least 1")
    private Integer count = 5;

    public CreateInterviewRequest() {}

    public CreateInterviewRequest(String role, String difficulty, String type, Integer count) {
        this.role = role;
        this.difficulty = difficulty;
        this.type = type;
        this.count = count;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }
}
