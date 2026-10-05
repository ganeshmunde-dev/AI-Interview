package com.interviewai.backend.service;

import com.interviewai.backend.dto.*;
import com.interviewai.backend.entity.*;
import com.interviewai.backend.exception.BadRequestException;
import com.interviewai.backend.exception.ResourceNotFoundException;
import com.interviewai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    @Autowired
    private InterviewSessionRepository sessionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private ResultService resultService;

    @Transactional
    public InterviewSessionDTO createInterview(User user, CreateInterviewRequest request) {
        InterviewSession session = new InterviewSession(
                user,
                request.getRole(),
                request.getDifficulty(),
                request.getType(),
                request.getCount()
        );

        session = sessionRepository.save(session);

        List<QuestionDTO> generatedQuestions = questionService.generateQuestionsForSession(
                request.getRole(),
                request.getDifficulty(),
                request.getType(),
                request.getCount()
        );

        List<Question> questionEntities = new ArrayList<>();
        for (QuestionDTO qDto : generatedQuestions) {
            Question q = new Question(
                    session,
                    qDto.getQuestionNumber(),
                    qDto.getQuestion(),
                    qDto.getCategory(),
                    qDto.getSkill(),
                    qDto.getTimeLimit()
            );
            questionEntities.add(q);
        }

        questionRepository.saveAll(questionEntities);
        session.setQuestions(questionEntities);

        return convertToSessionDTO(session);
    }

    public InterviewSessionDTO getInterview(Long sessionId, User currentUser) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with ID: " + sessionId));

        if (!session.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this interview session");
        }

        return convertToSessionDTO(session);
    }

    @Transactional
    public void submitAnswer(Long sessionId, AnswerRequest request, User currentUser) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with ID: " + sessionId));

        if (!session.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this interview session");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + request.getQuestionId()));

        Optional<Answer> existingAnswer = answerRepository.findBySessionIdAndQuestionId(sessionId, request.getQuestionId());

        if (existingAnswer.isPresent()) {
            Answer ans = existingAnswer.get();
            ans.setAnswerText(request.getAnswerText());
            answerRepository.save(ans);
        } else {
            Answer ans = new Answer(session, question, request.getAnswerText());
            answerRepository.save(ans);
        }
    }

    @Transactional
    public InterviewResultDTO submitInterview(Long sessionId, User currentUser) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with ID: " + sessionId));

        if (!session.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this interview session");
        }

        Evaluation eval = evaluationService.evaluateSession(session);
        eval = evaluationRepository.save(eval);

        session.setStatus(eval.getEvaluationStatus());
        sessionRepository.save(session);

        return resultService.convertToDTO(eval.getResult());
    }

    public InterviewResultDTO getResult(Long sessionId, User currentUser) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with ID: " + sessionId));

        if (!session.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this interview session");
        }

        Evaluation eval = evaluationRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Evaluation newEval = evaluationService.evaluateSession(session);
                    return evaluationRepository.save(newEval);
                });

        return resultService.convertToDTO(eval.getResult());
    }

    public List<InterviewResultDTO> getHistory(User currentUser) {
        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        List<InterviewResultDTO> results = new ArrayList<>();

        for (InterviewSession session : sessions) {
            Optional<Evaluation> evalOpt = evaluationRepository.findBySessionId(session.getId());
            if (evalOpt.isPresent() && evalOpt.get().getResult() != null) {
                results.add(resultService.convertToDTO(evalOpt.get().getResult()));
            } else {
                Evaluation eval = evaluationService.evaluateSession(session);
                eval = evaluationRepository.save(eval);
                results.add(resultService.convertToDTO(eval.getResult()));
            }
        }
        return results;
    }

    private InterviewSessionDTO convertToSessionDTO(InterviewSession session) {
        InterviewSessionDTO dto = new InterviewSessionDTO();
        dto.setId(session.getId());
        dto.setRole(session.getRole());
        dto.setDifficulty(session.getDifficulty());
        dto.setType(session.getType());
        dto.setQuestionCount(session.getQuestionCount());
        dto.setStatus(session.getStatus());
        dto.setCreatedAt(session.getCreatedAt());

        List<QuestionDTO> qDtos = session.getQuestions().stream()
                .map(q -> new QuestionDTO(q.getId(), q.getQuestionNumber(), q.getQuestionText(), q.getCategory(), q.getSkill(), q.getTimeLimit()))
                .collect(Collectors.toList());
        dto.setQuestions(qDtos);

        Map<Long, String> answerMap = new HashMap<>();
        if (session.getAnswers() != null) {
            for (Answer a : session.getAnswers()) {
                answerMap.put(a.getQuestion().getId(), a.getAnswerText());
            }
        }
        dto.setAnswers(answerMap);

        return dto;
    }
}
