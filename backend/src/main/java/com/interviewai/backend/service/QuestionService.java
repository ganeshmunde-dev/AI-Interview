package com.interviewai.backend.service;

import com.interviewai.backend.dto.QuestionDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    public static class RawQuestion {
        private String id;
        private String question;
        private String category;
        private String skill;
        private Integer timeLimit;

        public RawQuestion(String id, String question, String category, String skill, Integer timeLimit) {
            this.id = id;
            this.question = question;
            this.category = category;
            this.skill = skill;
            this.timeLimit = timeLimit;
        }

        public String getId() { return id; }
        public String getQuestion() { return question; }
        public String getCategory() { return category; }
        public String getSkill() { return skill; }
        public Integer getTimeLimit() { return timeLimit; }
    }

    private final Map<String, Map<String, List<RawQuestion>>> questionBank = new HashMap<>();

    public QuestionService() {
        initQuestionBank();
    }

    private void initQuestionBank() {
        // ── 1. JAVA DEVELOPER ──────────────────────────────────────────────────
        Map<String, List<RawQuestion>> javaDev = new HashMap<>();
        javaDev.put("easy", Arrays.asList(
                new RawQuestion("jd-e1", "What is the difference between JDK, JRE, and JVM?", "JVM", "JVM", 90),
                new RawQuestion("jd-e2", "Explain the four main principles of Object-Oriented Programming (OOP).", "OOP", "OOP", 120),
                new RawQuestion("jd-e3", "What is the difference between == and .equals() in Java?", "Core Java", "Core Java", 60),
                new RawQuestion("jd-e4", "Why are Strings immutable in Java?", "Core Java", "Core Java", 90),
                new RawQuestion("jd-e5", "What is the difference between ArrayList and LinkedList?", "Collections", "Collections", 90),
                new RawQuestion("jd-e10", "Explain the difference between checked and unchecked exceptions.", "Exception Handling", "Exception Handling", 90)
        ));
        javaDev.put("medium", Arrays.asList(
                new RawQuestion("jd-m1", "Explain the Java Collections Framework hierarchy.", "Collections", "Collections", 120),
                new RawQuestion("jd-m2", "How does HashMap work internally in Java?", "Collections", "Collections", 150),
                new RawQuestion("jd-m3", "What is the difference between Thread and Runnable?", "Multithreading", "Multithreading", 120),
                new RawQuestion("jd-m4", "Explain the Java Memory Model: Heap vs Stack memory.", "JVM", "JVM", 120),
                new RawQuestion("jd-m6", "What are Lambda Expressions and Functional Interfaces in Java 8?", "Java 8+", "Java 8+", 120)
        ));
        javaDev.put("hard", Arrays.asList(
                new RawQuestion("jd-h1", "Explain ConcurrentHashMap internals and thread safety.", "Multithreading", "Multithreading", 180),
                new RawQuestion("jd-h2", "What is the happens-before relationship in Java Memory Model?", "Multithreading", "Multithreading", 180),
                new RawQuestion("jd-h3", "Explain Garbage Collection algorithms in modern JVMs (G1GC, ZGC).", "JVM", "JVM", 180)
        ));
        questionBank.put("java_dev", javaDev);

        // ── 2. REACT DEVELOPER ─────────────────────────────────────────────────
        Map<String, List<RawQuestion>> reactDev = new HashMap<>();
        reactDev.put("easy", Arrays.asList(
                new RawQuestion("rd-e1", "What is React and what are its key features?", "Components", "Components", 90),
                new RawQuestion("rd-e3", "Explain the difference between props and state in React.", "Props", "Props", 90),
                new RawQuestion("rd-e4", "What is the Virtual DOM and how does React use it?", "Performance", "Performance", 90),
                new RawQuestion("rd-e5", "Explain the useState hook with an example.", "Hooks", "Hooks", 90),
                new RawQuestion("rd-e10", "What is the purpose of useEffect hook?", "Hooks", "Hooks", 90)
        ));
        reactDev.put("medium", Arrays.asList(
                new RawQuestion("rd-m1", "Explain Context API in React and when to use it.", "Context API", "Context API", 120),
                new RawQuestion("rd-m3", "Explain React.memo, useMemo, and useCallback for optimization.", "Performance", "Performance", 150),
                new RawQuestion("rd-m4", "How does React Router v6 work?", "React Router", "React Router", 120),
                new RawQuestion("rd-m7", "Explain Controlled vs Uncontrolled components in React forms.", "State", "State", 90)
        ));
        reactDev.put("hard", Arrays.asList(
                new RawQuestion("rd-h1", "Explain React Fiber architecture and reconciliation.", "Performance", "Performance", 180),
                new RawQuestion("rd-h2", "How does React 18 Concurrent Rendering work?", "Performance", "Performance", 180)
        ));
        questionBank.put("react_dev", reactDev);

        // ── 3. FRONTEND DEVELOPER ──────────────────────────────────────────────
        Map<String, List<RawQuestion>> frontend = new HashMap<>();
        frontend.put("easy", Arrays.asList(
                new RawQuestion("fe-e1", "What is the difference between HTML5 semantic tags and non-semantic tags?", "HTML", "HTML", 60),
                new RawQuestion("fe-e2", "Explain the CSS Box Model (content, padding, border, margin).", "CSS", "CSS", 90),
                new RawQuestion("fe-e3", "What are the main JavaScript data types?", "JavaScript", "JavaScript", 60),
                new RawQuestion("fe-e5", "Explain Flexbox in CSS and its primary container properties.", "CSS", "CSS", 90),
                new RawQuestion("fe-e6", "What is DOM manipulation in JavaScript?", "DOM", "DOM", 90),
                new RawQuestion("fe-e9", "What is responsive web design and media queries?", "Responsive Design", "Responsive Design", 90),
                new RawQuestion("fe-e10", "What is React and why is it popular?", "React", "React", 90)
        ));
        frontend.put("medium", Arrays.asList(
                new RawQuestion("fe-m1", "Explain Closures in JavaScript with an example.", "JavaScript", "JavaScript", 120),
                new RawQuestion("fe-m2", "What is the JavaScript Event Loop?", "JavaScript", "JavaScript", 150),
                new RawQuestion("fe-m5", "Compare localStorage, sessionStorage, and Cookies.", "Browser Concepts", "Browser Concepts", 120),
                new RawQuestion("fe-m6", "What is CORS and how does it work?", "Browser Concepts", "Browser Concepts", 120)
        ));
        frontend.put("hard", Arrays.asList(
                new RawQuestion("fe-h2", "Explain the critical rendering path of a browser.", "Browser Concepts", "Browser Concepts", 180),
                new RawQuestion("fe-h3", "How do Prototype Chain and Prototypal Inheritance work?", "JavaScript", "JavaScript", 150)
        ));
        questionBank.put("frontend", frontend);

        // ── 4. SPRING BOOT ─────────────────────────────────────────────────────
        Map<String, List<RawQuestion>> springBoot = new HashMap<>();
        springBoot.put("easy", Arrays.asList(
                new RawQuestion("sb-e1", "What is Spring Framework and Spring Boot?", "Spring Boot", "Spring Boot", 90),
                new RawQuestion("sb-e3", "What annotations are used in a Spring Boot REST Controller?", "Spring MVC", "Spring MVC", 90),
                new RawQuestion("sb-e8", "What is Spring Data JPA?", "JPA", "JPA", 90),
                new RawQuestion("sb-e9", "What HTTP methods are used in REST API?", "REST API", "REST API", 60)
        ));
        springBoot.put("medium", Arrays.asList(
                new RawQuestion("sb-m2", "How do you implement JWT authentication in Spring Boot?", "Spring Security", "Spring Security", 150),
                new RawQuestion("sb-m4", "What is Hibernate and how does Entity Mapping work?", "JPA", "JPA", 120),
                new RawQuestion("sb-m6", "What is the N+1 SELECT problem in JPA/Hibernate?", "Hibernate", "Hibernate", 150)
        ));
        springBoot.put("hard", Arrays.asList(
                new RawQuestion("sb-h1", "Architect a Microservices solution using Spring Boot and Spring Cloud.", "REST API", "REST API", 210)
        ));
        questionBank.put("spring_boot", springBoot);

        // ── 5. HR ROUND ────────────────────────────────────────────────────────
        Map<String, List<RawQuestion>> hr = new HashMap<>();
        hr.put("easy", Arrays.asList(
                new RawQuestion("hr-e1", "Tell me about yourself and your background.", "Communication", "Communication", 120),
                new RawQuestion("hr-e2", "Why do you want to work for our company?", "Confidence", "Confidence", 120),
                new RawQuestion("hr-e3", "What are your greatest professional strengths?", "Confidence", "Confidence", 120),
                new RawQuestion("hr-e4", "What is your biggest weakness and steps to improve?", "Professionalism", "Professionalism", 120),
                new RawQuestion("hr-e5", "Where do you see yourself in 5 years?", "Clarity", "Clarity", 120),
                new RawQuestion("hr-e8", "Do you prefer working independently or in a team?", "Teamwork", "Teamwork", 90)
        ));
        hr.put("medium", Arrays.asList(
                new RawQuestion("hr-m1", "Describe a challenging project situation using STAR method.", "Situational Judgment", "Situational Judgment", 150),
                new RawQuestion("hr-m2", "Tell me about a conflict with a teammate and resolution.", "Teamwork", "Teamwork", 150),
                new RawQuestion("hr-m3", "How do you handle tight deadlines and high pressure?", "Problem Solving", "Problem Solving", 120),
                new RawQuestion("hr-m7", "Tell me about a time you went above and beyond.", "Leadership", "Leadership", 150)
        ));
        hr.put("hard", Arrays.asList(
                new RawQuestion("hr-h1", "Describe leading a team project through ambiguity.", "Leadership", "Leadership", 180),
                new RawQuestion("hr-h3", "Why should we hire you over other candidates?", "Confidence", "Confidence", 150)
        ));
        questionBank.put("hr", hr);

        // Fallback for fullstack, backend, php to frontend/java_dev
        questionBank.put("fullstack", frontend);
        questionBank.put("backend", springBoot);
        questionBank.put("php", frontend);
    }

    public List<QuestionDTO> generateQuestionsForSession(String role, String difficulty, String type, int count) {
        String roleKey = ("hr".equalsIgnoreCase(role) || "hr".equalsIgnoreCase(type)) ? "hr" : role.toLowerCase();
        Map<String, List<RawQuestion>> roleBank = questionBank.getOrDefault(roleKey, questionBank.get("frontend"));

        List<RawQuestion> pool = new ArrayList<>(roleBank.getOrDefault(difficulty.toLowerCase(), new ArrayList<>()));

        if (pool.size() < count) {
            roleBank.forEach((diff, list) -> {
                if (!diff.equalsIgnoreCase(difficulty)) {
                    pool.addAll(list);
                }
            });
        }

        Collections.shuffle(pool);
        List<RawQuestion> selected = pool.stream().distinct().limit(count).collect(Collectors.toList());

        List<QuestionDTO> result = new ArrayList<>();
        for (int i = 0; i < selected.size(); i++) {
            RawQuestion q = selected.get(i);
            result.add(new QuestionDTO(
                    (long) (i + 1),
                    i + 1,
                    q.getQuestion(),
                    q.getCategory(),
                    q.getSkill(),
                    q.getTimeLimit()
            ));
        }
        return result;
    }
}
