package com.interviewai.backend.repository;

import com.interviewai.backend.entity.InterviewResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewResultRepository extends JpaRepository<InterviewResult, Long> {
    Optional<InterviewResult> findByEvaluationSessionId(Long sessionId);
}
