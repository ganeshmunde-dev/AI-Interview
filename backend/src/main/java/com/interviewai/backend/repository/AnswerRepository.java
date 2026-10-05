package com.interviewai.backend.repository;

import com.interviewai.backend.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySessionId(Long sessionId);
    Optional<Answer> findBySessionIdAndQuestionId(Long sessionId, Long questionId);
}
