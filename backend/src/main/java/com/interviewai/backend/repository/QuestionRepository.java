package com.interviewai.backend.repository;

import com.interviewai.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySessionIdOrderByQuestionNumberAsc(Long sessionId);
}
