// src/data/questions.js
// Question Bank for all roles, difficulties, and interview types with explicit Question-to-Skill Mapping

export const questionBank = {
  // ── 1. JAVA DEVELOPER ──────────────────────────────────────────────────────
  java_dev: {
    easy: [
      { id: 'jd-e1', question: 'What is the difference between JDK, JRE, and JVM?', category: 'JVM', skill: 'JVM', timeLimit: 90 },
      { id: 'jd-e2', question: 'Explain the four main principles of Object-Oriented Programming (OOP).', category: 'OOP', skill: 'OOP', timeLimit: 120 },
      { id: 'jd-e3', question: 'What is the difference between == and .equals() in Java?', category: 'Core Java', skill: 'Core Java', timeLimit: 60 },
      { id: 'jd-e4', question: 'Why are Strings immutable in Java?', category: 'Core Java', skill: 'Core Java', timeLimit: 90 },
      { id: 'jd-e5', question: 'What is the difference between ArrayList and LinkedList?', category: 'Collections', skill: 'Collections', timeLimit: 90 },
      { id: 'jd-e6', question: 'Explain access modifiers (public, private, protected, default) in Java.', category: 'Core Java', skill: 'Core Java', timeLimit: 90 },
      { id: 'jd-e7', question: 'What is the difference between method overloading and method overriding?', category: 'OOP', skill: 'OOP', timeLimit: 90 },
      { id: 'jd-e8', question: 'What is a constructor in Java? Can a constructor be private?', category: 'Core Java', skill: 'Core Java', timeLimit: 90 },
      { id: 'jd-e9', question: 'What is the final keyword used for in Java (variables, methods, classes)?', category: 'Core Java', skill: 'Core Java', timeLimit: 90 },
      { id: 'jd-e10', question: 'Explain the difference between checked and unchecked exceptions.', category: 'Exception Handling', skill: 'Exception Handling', timeLimit: 90 },
      { id: 'jd-e11', question: 'What is an Interface and how does it differ from an Abstract Class?', category: 'OOP', skill: 'OOP', timeLimit: 120 },
      { id: 'jd-e12', question: 'What is the static keyword in Java and where can it be applied?', category: 'Core Java', skill: 'Core Java', timeLimit: 90 },
    ],
    medium: [
      { id: 'jd-m1', question: 'Explain the Java Collections Framework hierarchy.', category: 'Collections', skill: 'Collections', timeLimit: 120 },
      { id: 'jd-m2', question: 'How does HashMap work internally in Java? Explain hashing, collisions, and bucket index computation.', category: 'Collections', skill: 'Collections', timeLimit: 150 },
      { id: 'jd-m3', question: 'What is the difference between Thread and Runnable? How do you create threads in Java?', category: 'Multithreading', skill: 'Multithreading', timeLimit: 120 },
      { id: 'jd-m4', question: 'Explain the Java Memory Model: Heap vs Stack memory.', category: 'JVM', skill: 'JVM', timeLimit: 120 },
      { id: 'jd-m5', question: 'What are Java Generics and why do we use them? What is type erasure?', category: 'Core Java', skill: 'Core Java', timeLimit: 120 },
      { id: 'jd-m6', question: 'What are Lambda Expressions and Functional Interfaces introduced in Java 8?', category: 'Java 8+', skill: 'Java 8+', timeLimit: 120 },
      { id: 'jd-m7', question: 'Explain the Stream API in Java 8. What is the difference between intermediate and terminal operations?', category: 'Java 8+', skill: 'Java 8+', timeLimit: 150 },
      { id: 'jd-m8', question: 'What is the difference between Comparable and Comparator interfaces?', category: 'Collections', skill: 'Collections', timeLimit: 120 },
      { id: 'jd-m9', question: 'Explain the try-with-resources statement and AutoCloseable interface.', category: 'Exception Handling', skill: 'Exception Handling', timeLimit: 90 },
      { id: 'jd-m10', question: 'What is synchronization in Java multithreading? How does synchronized block/method work?', category: 'Multithreading', skill: 'Multithreading', timeLimit: 150 },
      { id: 'jd-m11', question: 'Explain Optional class in Java 8 and how it helps avoid NullPointerException.', category: 'Java 8+', skill: 'Java 8+', timeLimit: 90 },
      { id: 'jd-m12', question: 'How does garbage collection work in Java? Explain Mark and Sweep algorithm.', category: 'JVM', skill: 'JVM', timeLimit: 150 },
    ],
    hard: [
      { id: 'jd-h1', question: 'Explain ConcurrentHashMap internals. How does it achieve thread safety without locking the entire map?', category: 'Multithreading', skill: 'Multithreading', timeLimit: 180 },
      { id: 'jd-h2', question: 'What is the happens-before relationship in Java Memory Model? Explain volatile keyword.', category: 'Multithreading', skill: 'Multithreading', timeLimit: 180 },
      { id: 'jd-h3', question: 'Explain Garbage Collection algorithms in modern JVMs (G1GC, ZGC, Shenandoah).', category: 'JVM', skill: 'JVM', timeLimit: 180 },
      { id: 'jd-h4', question: 'How do ClassLoaders work in Java? Explain Delegation Hierarchy and custom ClassLoaders.', category: 'JVM', skill: 'JVM', timeLimit: 180 },
      { id: 'jd-h5', question: 'How would you design a thread-safe bounded blocking queue from scratch in Java?', category: 'Multithreading', skill: 'Multithreading', timeLimit: 240 },
      { id: 'jd-h6', question: 'Explain CompletableFuture in Java 8 and how to handle asynchronous operations efficiently.', category: 'Multithreading', skill: 'Multithreading', timeLimit: 180 },
      { id: 'jd-h7', question: 'Explain Java Reflection API, its use cases, and performance/security implications.', category: 'Core Java', skill: 'Core Java', timeLimit: 150 },
      { id: 'jd-h8', question: 'What are Virtual Threads (Project Loom) in Java 21 and how do they differ from platform threads?', category: 'Multithreading', skill: 'Multithreading', timeLimit: 180 },
    ],
  },

  // ── 2. REACT DEVELOPER ─────────────────────────────────────────────────────
  react_dev: {
    easy: [
      { id: 'rd-e1', question: 'What is React and what are its key features?', category: 'Components', skill: 'Components', timeLimit: 90 },
      { id: 'rd-e2', question: 'What is JSX in React and why do we use it?', category: 'Components', skill: 'Components', timeLimit: 60 },
      { id: 'rd-e3', question: 'Explain the difference between props and state in React.', category: 'Props', skill: 'Props', timeLimit: 90 },
      { id: 'rd-e4', question: 'What is the Virtual DOM and how does React use it for rendering?', category: 'Performance', skill: 'Performance', timeLimit: 90 },
      { id: 'rd-e5', question: 'Explain the useState hook with a simple counter example.', category: 'Hooks', skill: 'Hooks', timeLimit: 90 },
      { id: 'rd-e6', question: 'Why do we need keys in React lists? What happens if keys are omitted?', category: 'Performance', skill: 'Performance', timeLimit: 90 },
      { id: 'rd-e7', question: 'What are synthetic events in React?', category: 'Components', skill: 'Components', timeLimit: 60 },
      { id: 'rd-e8', question: 'Explain the difference between functional components and class components.', category: 'Components', skill: 'Components', timeLimit: 90 },
      { id: 'rd-e9', question: 'What is conditional rendering in React? Name two ways to implement it.', category: 'Components', skill: 'Components', timeLimit: 60 },
      { id: 'rd-e10', question: 'What is the purpose of useEffect hook?', category: 'Hooks', skill: 'Hooks', timeLimit: 90 },
    ],
    medium: [
      { id: 'rd-m1', question: 'Explain Context API in React and when you should use it over props drilling.', category: 'Context API', skill: 'Context API', timeLimit: 120 },
      { id: 'rd-m2', question: 'How do custom hooks work in React? Create a concept for a useFetch hook.', category: 'Hooks', skill: 'Hooks', timeLimit: 150 },
      { id: 'rd-m3', question: 'Explain React.memo, useMemo, and useCallback. When should you use each for optimization?', category: 'Performance', skill: 'Performance', timeLimit: 150 },
      { id: 'rd-m4', question: 'How does React Router v6 work? Explain BrowserRouter, Routes, Route, and useNavigate.', category: 'React Router', skill: 'React Router', timeLimit: 120 },
      { id: 'rd-m5', question: 'What is code splitting and lazy loading in React? How do React.lazy and Suspense work?', category: 'Performance', skill: 'Performance', timeLimit: 120 },
      { id: 'rd-m6', question: 'What is the cleanup function in useEffect and when does it execute?', category: 'Hooks', skill: 'Hooks', timeLimit: 90 },
      { id: 'rd-m7', question: 'Explain Controlled vs Uncontrolled components in React forms.', category: 'State', skill: 'State', timeLimit: 90 },
      { id: 'rd-m8', question: 'What is Redux Toolkit? Explain slices, actions, reducers, and store.', category: 'State', skill: 'State', timeLimit: 150 },
      { id: 'rd-m9', question: 'What are Error Boundaries in React and how do they work?', category: 'Components', skill: 'Components', timeLimit: 120 },
      { id: 'rd-m10', question: 'Explain useRef hook and its differences from useState.', category: 'Hooks', skill: 'Hooks', timeLimit: 90 },
    ],
    hard: [
      { id: 'rd-h1', question: 'Explain React Fiber architecture and how the reconciliation algorithm works under the hood.', category: 'Performance', skill: 'Performance', timeLimit: 180 },
      { id: 'rd-h2', question: 'How does React 18 Concurrent Rendering work? Explain useTransition and useDeferredValue.', category: 'Performance', skill: 'Performance', timeLimit: 180 },
      { id: 'rd-h3', question: 'How would you optimize a large-scale React app suffering from frequent unnecessary re-renders?', category: 'Performance', skill: 'Performance', timeLimit: 180 },
      { id: 'rd-h4', question: 'Design a scalable state management architecture for a SaaS app with complex global and local state.', category: 'State', skill: 'State', timeLimit: 210 },
      { id: 'rd-h5', question: 'Explain Server-Side Rendering (SSR), Static Site Generation (SSG), and React Server Components (RSC).', category: 'Performance', skill: 'Performance', timeLimit: 180 },
      { id: 'rd-h6', question: 'How does React batch state updates in event handlers and async code?', category: 'Performance', skill: 'Performance', timeLimit: 150 },
    ],
  },

  // ── 3. FRONTEND DEVELOPER ──────────────────────────────────────────────────
  frontend: {
    easy: [
      { id: 'fe-e1', question: 'What is the difference between HTML5 semantic tags and non-semantic tags?', category: 'HTML', skill: 'HTML', timeLimit: 60 },
      { id: 'fe-e2', question: 'Explain the CSS Box Model (content, padding, border, margin).', category: 'CSS', skill: 'CSS', timeLimit: 90 },
      { id: 'fe-e3', question: 'What are the main JavaScript data types?', category: 'JavaScript', skill: 'JavaScript', timeLimit: 60 },
      { id: 'fe-e4', question: 'What is the difference between var, let, and const in JavaScript?', category: 'JavaScript', skill: 'JavaScript', timeLimit: 90 },
      { id: 'fe-e5', question: 'Explain Flexbox in CSS and its primary container properties.', category: 'CSS', skill: 'CSS', timeLimit: 90 },
      { id: 'fe-e6', question: 'What is DOM manipulation in JavaScript? Give an example.', category: 'DOM', skill: 'DOM', timeLimit: 90 },
      { id: 'fe-e7', question: 'What is the difference between == and === in JavaScript?', category: 'JavaScript', skill: 'JavaScript', timeLimit: 60 },
      { id: 'fe-e8', question: 'What is CSS Grid and when would you use it over Flexbox?', category: 'CSS', skill: 'CSS', timeLimit: 90 },
      { id: 'fe-e9', question: 'What is responsive web design and how do CSS media queries work?', category: 'Responsive Design', skill: 'Responsive Design', timeLimit: 90 },
      { id: 'fe-e10', question: 'What is React and why is it popular for frontend development?', category: 'React', skill: 'React', timeLimit: 90 },
    ],
    medium: [
      { id: 'fe-m1', question: 'Explain Closures in JavaScript with a practical coding example.', category: 'JavaScript', skill: 'JavaScript', timeLimit: 120 },
      { id: 'fe-m2', question: 'What is the JavaScript Event Loop? Explain Call Stack, Microtask Queue, and Macrotask Queue.', category: 'JavaScript', skill: 'JavaScript', timeLimit: 150 },
      { id: 'fe-m3', question: 'Explain Promises and async/await in JavaScript. How do you handle error states?', category: 'JavaScript', skill: 'JavaScript', timeLimit: 120 },
      { id: 'fe-m4', question: 'What is Event Delegation in JavaScript and why is it useful?', category: 'DOM', skill: 'DOM', timeLimit: 120 },
      { id: 'fe-m5', question: 'How do browser storage mechanisms compare: localStorage, sessionStorage, and Cookies?', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 120 },
      { id: 'fe-m6', question: 'What is CORS (Cross-Origin Resource Sharing) and how does it work?', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 120 },
      { id: 'fe-m7', question: 'Explain CSS specificity and how browser computes cascading styles.', category: 'CSS', skill: 'CSS', timeLimit: 90 },
      { id: 'fe-m8', question: 'What is Debouncing and Throttling in JavaScript? Give real-world use cases.', category: 'JavaScript', skill: 'JavaScript', timeLimit: 120 },
      { id: 'fe-m9', question: 'Explain how the Virtual DOM diffing algorithm works in React.', category: 'React', skill: 'React', timeLimit: 120 },
      { id: 'fe-m10', question: 'What are Web Vitals (LCP, FID/INP, CLS) and how do you optimize frontend performance?', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 150 },
    ],
    hard: [
      { id: 'fe-h1', question: 'How would you build a high-performance infinite scroll component in React without memory leaks?', category: 'React', skill: 'React', timeLimit: 180 },
      { id: 'fe-h2', question: 'Explain the critical rendering path of a browser from HTML parsing to painting pixels.', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 180 },
      { id: 'fe-h3', question: 'How do Prototype Chain and Prototypal Inheritance work under the hood in JavaScript?', category: 'JavaScript', skill: 'JavaScript', timeLimit: 150 },
      { id: 'fe-h4', question: 'Design a micro-frontend architecture for a large enterprise web portal.', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 210 },
      { id: 'fe-h5', question: 'Explain Web Workers, Service Workers, and how to build an offline PWA.', category: 'API Integration', skill: 'API Integration', timeLimit: 180 },
      { id: 'fe-h6', question: 'How do web vulnerabilities like XSS, CSRF, and Clickjacking work, and how do you prevent them?', category: 'Browser Concepts', skill: 'Browser Concepts', timeLimit: 180 },
    ],
  },

  // ── 4. SPRING BOOT ─────────────────────────────────────────────────────────
  spring_boot: {
    easy: [
      { id: 'sb-e1', question: 'What is Spring Framework and what is Spring Boot?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 90 },
      { id: 'sb-e2', question: 'What is Dependency Injection (DI) and Inversion of Control (IoC) in Spring?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 120 },
      { id: 'sb-e3', question: 'What are the main annotations used in a Spring Boot REST Controller?', category: 'Spring MVC', skill: 'Spring MVC', timeLimit: 90 },
      { id: 'sb-e4', question: 'What is @SpringBootApplication annotation composed of?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 60 },
      { id: 'sb-e5', question: 'What is Spring Boot Starter dependency and why do we use it?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 90 },
      { id: 'sb-e6', question: 'Explain the difference between @Component, @Service, and @Repository annotations.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 90 },
      { id: 'sb-e7', question: 'What is application.properties or application.yml file used for?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 60 },
      { id: 'sb-e8', question: 'What is Spring Data JPA and how does repository creation work?', category: 'JPA', skill: 'JPA', timeLimit: 90 },
      { id: 'sb-e9', question: 'What HTTP methods are used in REST API (GET, POST, PUT, DELETE)?', category: 'REST API', skill: 'REST API', timeLimit: 60 },
      { id: 'sb-e10', question: 'What is the purpose of Embedded Tomcat in Spring Boot?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 60 },
    ],
    medium: [
      { id: 'sb-m1', question: 'Explain Spring Bean Lifecycle from initialization to destruction.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 120 },
      { id: 'sb-m2', question: 'What is Spring Security? How do you implement JWT authentication in Spring Boot?', category: 'Spring Security', skill: 'Spring Security', timeLimit: 150 },
      { id: 'sb-m3', question: 'Explain Spring Boot Actuator and its useful endpoints for monitoring.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 120 },
      { id: 'sb-m4', question: 'What is Hibernate and how does Entity Mapping work with JPA annotations (@Entity, @Table, @Id)?', category: 'JPA', skill: 'JPA', timeLimit: 120 },
      { id: 'sb-m5', question: 'Explain Entity Relationships in JPA: @OneToOne, @OneToMany, @ManyToOne, and @ManyToMany.', category: 'JPA', skill: 'JPA', timeLimit: 150 },
      { id: 'sb-m6', question: 'What is the N+1 SELECT problem in JPA/Hibernate and how do you resolve it?', category: 'Hibernate', skill: 'Hibernate', timeLimit: 150 },
      { id: 'sb-m7', question: 'Explain @Transactional annotation in Spring and transaction propagation behavior.', category: 'JPA', skill: 'JPA', timeLimit: 120 },
      { id: 'sb-m8', question: 'What is Exception Handling in Spring Boot using @RestControllerAdvice and @ExceptionHandler?', category: 'Spring MVC', skill: 'Spring MVC', timeLimit: 120 },
      { id: 'sb-m9', question: 'What is Spring AOP (Aspect-Oriented Programming)? Explain Aspect, Pointcut, and Advice.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 150 },
      { id: 'sb-m10', question: 'Explain Spring Profiles and how to handle environment configurations (dev, test, prod).', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 90 },
    ],
    hard: [
      { id: 'sb-h1', question: 'Architect a Microservices solution using Spring Boot, Spring Cloud Eureka, API Gateway, and OpenFeign.', category: 'REST API', skill: 'REST API', timeLimit: 210 },
      { id: 'sb-h2', question: 'Explain Resilience4j circuit breaker, rate limiter, and retry patterns in Spring Boot.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 180 },
      { id: 'sb-h3', question: 'How does Spring Security filter chain work internally for OAuth2 / JWT authentication?', category: 'Spring Security', skill: 'Spring Security', timeLimit: 180 },
      { id: 'sb-h4', question: 'How does Hibernate 1st level and 2nd level caching work? How do you configure Redis 2nd level cache?', category: 'Hibernate', skill: 'Hibernate', timeLimit: 180 },
      { id: 'sb-h5', question: 'How would you handle distributed transactions across Spring Boot microservices (Saga Pattern)?', category: 'REST API', skill: 'REST API', timeLimit: 210 },
      { id: 'sb-h6', question: 'Explain Spring WebFlux reactive framework vs traditional Spring MVC threading model.', category: 'Spring MVC', skill: 'Spring MVC', timeLimit: 180 },
    ],
  },

  // ── 5. JAVA FULL STACK ─────────────────────────────────────────────────────
  fullstack: {
    easy: [
      { id: 'fs-e1', question: 'What is Full Stack Development and what layers does a typical web application have?', category: 'System Architecture', skill: 'System Architecture', timeLimit: 90 },
      { id: 'fs-e2', question: 'How does a React frontend communicate with a Spring Boot backend?', category: 'React', skill: 'React', timeLimit: 90 },
      { id: 'fs-e3', question: 'What is JSON and why is it used for API data transfer?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 60 },
      { id: 'fs-e4', question: 'What is the role of MySQL database in a Java Full Stack application?', category: 'MySQL', skill: 'MySQL', timeLimit: 90 },
      { id: 'fs-e5', question: 'Explain basic HTTP status codes: 200, 201, 400, 401, 404, 500.', category: 'REST APIs', skill: 'REST APIs', timeLimit: 90 },
      { id: 'fs-e6', question: 'What is Axios in React and how do you send GET/POST requests?', category: 'React', skill: 'React', timeLimit: 90 },
      { id: 'fs-e7', question: 'What is JDBC in Java and how does Spring Boot replace boilerplate JDBC code?', category: 'Java Core', skill: 'Java Core', timeLimit: 90 },
      { id: 'fs-e8', question: 'What is Git and what are basic workflow commands (commit, push, pull, branch)?', category: 'System Architecture', skill: 'System Architecture', timeLimit: 90 },
      { id: 'fs-e9', question: 'What is CORS error in web applications and why does it happen when connecting React to Spring Boot?', category: 'React', skill: 'React', timeLimit: 90 },
      { id: 'fs-e10', question: 'Explain state management in React vs database persistence in Spring Boot.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 90 },
    ],
    medium: [
      { id: 'fs-m1', question: 'Design the REST API endpoints and database schema for a User Authentication & Profile system.', category: 'System Architecture', skill: 'System Architecture', timeLimit: 150 },
      { id: 'fs-m2', question: 'Explain how JWT Token authentication flow works between React, Spring Boot, and LocalStorage.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 150 },
      { id: 'fs-m3', question: 'How do you handle form validation on both React frontend and Spring Boot backend (@Valid)?', category: 'React', skill: 'React', timeLimit: 120 },
      { id: 'fs-m4', question: 'Explain database indexing in MySQL and how it speeds up query execution.', category: 'MySQL', skill: 'MySQL', timeLimit: 120 },
      { id: 'fs-m5', question: 'What is Axios interceptor and how is it used to attach Bearer tokens to outgoing requests?', category: 'React', skill: 'React', timeLimit: 120 },
      { id: 'fs-m6', question: 'What is Liquibase or Flyway in Spring Boot and why do we use database migration tools?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 120 },
      { id: 'fs-m7', question: 'Explain pagination and sorting implementation in React + Spring Data JPA.', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 150 },
      { id: 'fs-m8', question: 'What are SQL joins (INNER, LEFT, RIGHT, FULL) and how do they map to JPA relationships?', category: 'MySQL', skill: 'MySQL', timeLimit: 120 },
      { id: 'fs-m9', question: 'How do you containerize a React and Spring Boot app using Docker and Docker Compose?', category: 'System Architecture', skill: 'System Architecture', timeLimit: 150 },
      { id: 'fs-m10', question: 'Explain state persistence strategy: Context API in frontend vs Redis / Database in backend.', category: 'System Architecture', skill: 'System Architecture', timeLimit: 120 },
    ],
    hard: [
      { id: 'fs-h1', question: 'Design an end-to-end architecture for an Online Code Execution / Interview platform like LeetCode.', category: 'System Architecture', skill: 'System Architecture', timeLimit: 240 },
      { id: 'fs-h2', question: 'How would you handle real-time notifications in a Java Full Stack app using WebSockets (STOMP + SockJS)?', category: 'Spring Boot', skill: 'Spring Boot', timeLimit: 180 },
      { id: 'fs-h3', question: 'Explain CI/CD pipeline setup for deploying Spring Boot (AWS EC2 / Render) and React (Vercel / Netlify).', category: 'System Architecture', skill: 'System Architecture', timeLimit: 180 },
      { id: 'fs-h4', question: 'How do you mitigate security vulnerabilities across full stack: XSS, CSRF, SQL Injection, Rate Limiting?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 180 },
      { id: 'fs-h5', question: 'Design a scalable file / video upload architecture using React, Spring Boot, and AWS S3 signed URLs.', category: 'System Architecture', skill: 'System Architecture', timeLimit: 180 },
    ],
  },

  // ── 6. BACKEND DEVELOPER ───────────────────────────────────────────────────
  backend: {
    easy: [
      { id: 'be-e1', question: 'What is a RESTful API and what are the 6 architectural constraints of REST?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 90 },
      { id: 'be-e2', question: 'What is the difference between relational (SQL) and non-relational (NoSQL) databases?', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 90 },
      { id: 'be-e3', question: 'What is an API endpoint and what are path parameters vs query parameters?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 60 },
      { id: 'be-e4', question: 'What is ACID properties in database transactions?', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 90 },
      { id: 'be-e5', question: 'What is the difference between GET and POST HTTP methods?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 60 },
      { id: 'be-e6', question: 'What is Authentication vs Authorization?', category: 'Authentication', skill: 'Authentication', timeLimit: 60 },
      { id: 'be-e7', question: 'What is JSON Web Token (JWT) and what are its three parts?', category: 'Authentication', skill: 'Authentication', timeLimit: 90 },
      { id: 'be-e8', question: 'What is an ORM (Object-Relational Mapping) framework?', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 90 },
      { id: 'be-e9', question: 'What is Connection Pooling in databases (e.g. HikariCP)?', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 90 },
      { id: 'be-e10', question: 'What is logging and why is SLF4J / Logback used in backend systems?', category: 'System Design', skill: 'System Design', timeLimit: 60 },
    ],
    medium: [
      { id: 'be-m1', question: 'Explain Database Normalization (1NF, 2NF, 3NF) and when you should denormalize.', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 120 },
      { id: 'be-m2', question: 'What is Redis and how is it used for caching and session management?', category: 'Caching', skill: 'Caching', timeLimit: 120 },
      { id: 'be-m3', question: 'Explain Message Queues (Apache Kafka / RabbitMQ) and why asynchronous communication is used in backend.', category: 'System Design', skill: 'System Design', timeLimit: 150 },
      { id: 'be-m4', question: 'How do you prevent SQL Injection attacks in backend applications?', category: 'API Security', skill: 'API Security', timeLimit: 90 },
      { id: 'be-m5', question: 'Explain Rate Limiting algorithms: Token Bucket, Leaky Bucket, Sliding Window.', category: 'REST APIs', skill: 'REST APIs', timeLimit: 150 },
      { id: 'be-m6', question: 'What is Database Sharding vs Replication? Explain Master-Slave architecture.', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 150 },
      { id: 'be-m7', question: 'Explain OAuth 2.0 authorization framework and Authorization Code grant flow.', category: 'Authentication', skill: 'Authentication', timeLimit: 150 },
      { id: 'be-m8', question: 'What is API Gateway pattern and what responsibilities does it handle?', category: 'System Design', skill: 'System Design', timeLimit: 120 },
      { id: 'be-m9', question: 'What are database isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)?', category: 'Databases & SQL', skill: 'Databases & SQL', timeLimit: 150 },
      { id: 'be-m10', question: 'Explain Idempotency in REST APIs. Which HTTP methods should be idempotent?', category: 'REST APIs', skill: 'REST APIs', timeLimit: 90 },
    ],
    hard: [
      { id: 'be-h1', question: 'Design a URL Shortener system (like bit.ly) handling 100M daily active users.', category: 'System Design', skill: 'System Design', timeLimit: 240 },
      { id: 'be-h2', question: 'Explain CAP Theorem and PACELC Theorem in distributed system design.', category: 'System Design', skill: 'System Design', timeLimit: 180 },
      { id: 'be-h3', question: 'How would you design a distributed rate limiter for microservices using Redis and Lua scripts?', category: 'Caching', skill: 'Caching', timeLimit: 210 },
      { id: 'be-h4', question: 'Explain Distributed Locks using Redis Redlock algorithm or ZooKeeper.', category: 'Caching', skill: 'Caching', timeLimit: 180 },
      { id: 'be-h5', question: 'How do Event Sourcing and CQRS (Command Query Responsibility Segregation) patterns work?', category: 'System Design', skill: 'System Design', timeLimit: 210 },
      { id: 'be-h6', question: 'Design a Notification Service that sends push, email, and SMS notifications at high throughput.', category: 'System Design', skill: 'System Design', timeLimit: 210 },
    ],
  },

  // ── 7. HR INTERVIEW ────────────────────────────────────────────────────────
  hr: {
    easy: [
      { id: 'hr-e1', question: 'Tell me about yourself and your background.', category: 'Communication', skill: 'Communication', timeLimit: 120 },
      { id: 'hr-e2', question: 'Why do you want to work for our company?', category: 'Confidence', skill: 'Confidence', timeLimit: 120 },
      { id: 'hr-e3', question: 'What are your greatest professional strengths?', category: 'Confidence', skill: 'Confidence', timeLimit: 120 },
      { id: 'hr-e4', question: 'What is your biggest weakness and what steps are you taking to improve it?', category: 'Professionalism', skill: 'Professionalism', timeLimit: 120 },
      { id: 'hr-e5', question: 'Where do you see yourself in 5 years?', category: 'Clarity', skill: 'Clarity', timeLimit: 120 },
      { id: 'hr-e6', question: 'Why are you leaving your current role / looking for a job change?', category: 'Professionalism', skill: 'Professionalism', timeLimit: 90 },
      { id: 'hr-e7', question: 'What do you know about our company products and services?', category: 'Professionalism', skill: 'Professionalism', timeLimit: 90 },
      { id: 'hr-e8', question: 'Do you prefer working independently or in a team environment? Why?', category: 'Teamwork', skill: 'Teamwork', timeLimit: 90 },
      { id: 'hr-e9', question: 'What are your salary expectations for this role?', category: 'Communication', skill: 'Communication', timeLimit: 90 },
      { id: 'hr-e10', question: 'Are you willing to relocate or work in night shifts if required?', category: 'Professionalism', skill: 'Professionalism', timeLimit: 60 },
    ],
    medium: [
      { id: 'hr-m1', question: 'Describe a challenging project situation you faced and how you resolved it using the STAR method.', category: 'Situational Judgment', skill: 'Situational Judgment', timeLimit: 150 },
      { id: 'hr-m2', question: 'Tell me about a time you had a conflict with a teammate or manager. How did you handle it?', category: 'Teamwork', skill: 'Teamwork', timeLimit: 150 },
      { id: 'hr-m3', question: 'How do you handle tight deadlines and high pressure work environments?', category: 'Problem Solving', skill: 'Problem Solving', timeLimit: 120 },
      { id: 'hr-m4', question: 'Give an example of a time when you made a mistake at work. How did you rectify it?', category: 'Situational Judgment', skill: 'Situational Judgment', timeLimit: 150 },
      { id: 'hr-m5', question: 'How do you prioritize tasks when you have multiple competing deadlines?', category: 'Problem Solving', skill: 'Problem Solving', timeLimit: 120 },
      { id: 'hr-m6', question: 'Describe a situation where you had to learn a new technology or domain quickly.', category: 'Problem Solving', skill: 'Problem Solving', timeLimit: 150 },
      { id: 'hr-m7', question: 'Tell me about a time you went above and beyond your job responsibilities.', category: 'Leadership', skill: 'Leadership', timeLimit: 150 },
      { id: 'hr-m8', question: 'How do you handle constructive criticism or feedback from your team lead?', category: 'Professionalism', skill: 'Professionalism', timeLimit: 120 },
    ],
    hard: [
      { id: 'hr-h1', question: 'Describe a situation where you led a team project through ambiguity or unexpected requirements changes.', category: 'Leadership', skill: 'Leadership', timeLimit: 180 },
      { id: 'hr-h2', question: 'Tell me about a time you disagreed with a technical design decision made by a senior developer. How did you handle it?', category: 'Situational Judgment', skill: 'Situational Judgment', timeLimit: 180 },
      { id: 'hr-h3', question: 'Why should we hire you over other candidates with similar or more experience?', category: 'Confidence', skill: 'Confidence', timeLimit: 150 },
      { id: 'hr-h4', question: 'Tell me about a project that failed or missed its key goals. What were the takeaways?', category: 'Problem Solving', skill: 'Problem Solving', timeLimit: 180 },
      { id: 'hr-h5', question: 'If you receive multiple job offers simultaneously, how will you evaluate which company to join?', category: 'Problem Solving', skill: 'Problem Solving', timeLimit: 150 },
    ],
  },

  // ── 8. PHP DEVELOPER ───────────────────────────────────────────────────────
  php: {
    easy: [
      { id: 'php-e1', question: 'What is PHP and what is its primary role in web development?', category: 'PHP', skill: 'PHP', timeLimit: 90 },
      { id: 'php-e2', question: 'Explain the difference between GET and POST HTTP request methods in PHP.', category: 'PHP', skill: 'PHP', timeLimit: 60 },
      { id: 'php-e3', question: 'How do superglobals $_SESSION and $_COOKIE work in PHP session management?', category: 'Sessions', skill: 'Sessions', timeLimit: 90 },
      { id: 'php-e4', question: 'Explain access modifiers (public, private, protected) in PHP Object-Oriented Programming.', category: 'OOP', skill: 'OOP', timeLimit: 90 },
      { id: 'php-e5', question: 'How do you establish a secure database connection using PDO in PHP?', category: 'MySQL', skill: 'MySQL', timeLimit: 90 },
      { id: 'php-e6', question: 'What is the difference between include, require, include_once, and require_once?', category: 'PHP', skill: 'PHP', timeLimit: 60 },
      { id: 'php-e7', question: 'What is the difference between == and === operators in PHP?', category: 'PHP', skill: 'PHP', timeLimit: 60 },
      { id: 'php-e8', question: 'Explain basic array functions in PHP (array_map, array_filter, array_reduce).', category: 'PHP', skill: 'PHP', timeLimit: 90 },
    ],
    medium: [
      { id: 'php-m1', question: 'Explain Model-View-Controller (MVC) architecture pattern in modern PHP frameworks.', category: 'MVC', skill: 'MVC', timeLimit: 120 },
      { id: 'php-m2', question: 'How do password hashing and verification functions (password_hash, password_verify) work in PHP?', category: 'Authentication', skill: 'Authentication', timeLimit: 120 },
      { id: 'php-m3', question: 'What are prepared statements in PHP PDO and how do they prevent SQL Injection attacks?', category: 'MySQL', skill: 'MySQL', timeLimit: 120 },
      { id: 'php-m4', question: 'Explain key PHP 8 features: Union Types, Named Arguments, Constructor Property Promotion, and Match Expression.', category: 'PHP', skill: 'PHP', timeLimit: 120 },
      { id: 'php-m5', question: 'How does Composer handle dependency management and PSR-4 autoloading in PHP projects?', category: 'PHP', skill: 'PHP', timeLimit: 120 },
      { id: 'php-m6', question: 'What are Traits in PHP and how do they help overcome single inheritance limitations?', category: 'OOP', skill: 'OOP', timeLimit: 90 },
      { id: 'php-m7', question: 'How do you handle exceptions in PHP using try-catch-finally blocks and custom exception classes?', category: 'PHP', skill: 'PHP', timeLimit: 90 },
    ],
    hard: [
      { id: 'php-h1', question: 'Design a secure RESTful API authentication system using PHP, JWT tokens, and MySQL.', category: 'Authentication', skill: 'Authentication', timeLimit: 180 },
      { id: 'php-h2', question: 'Explain OPcache, memory management, and execution lifecycle under PHP-FPM.', category: 'PHP', skill: 'PHP', timeLimit: 180 },
      { id: 'php-h3', question: 'How would you build a custom lightweight MVC framework from scratch following PSR standards?', category: 'MVC', skill: 'MVC', timeLimit: 210 },
      { id: 'php-h4', question: 'Explain how to optimize high-traffic PHP applications using Redis caching and database indexing.', category: 'MySQL', skill: 'MySQL', timeLimit: 180 },
    ],
  },
};

/**
 * Fisher-Yates array shuffle for non-repeating random order
 */
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Main Question Loading Engine
 *
 * Parameters:
 * @param {string} role       - Target role ('frontend', 'react_dev', 'java_dev', 'fullstack', 'spring_boot', 'php', 'backend', 'hr')
 * @param {string} difficulty - Difficulty tier ('easy', 'medium', 'hard')
 * @param {number} count      - Desired question count (5, 10, 20)
 * @param {string} type       - Interview type ('technical', 'hr', 'coding', 'mixed')
 */
export const getQuestions = (role = 'frontend', difficulty = 'medium', count = 10, type = 'technical') => {
  // 1. Resolve role question bank
  const roleBank = questionBank[role];
  if (!roleBank) {
    console.warn(`[InterviewEngine] Selected role "${role}" not found in Question Bank. Falling back to frontend.`);
  }
  const targetRoleBank = roleBank || questionBank.frontend;

  let selectedPool = [];

  // 2. Handle Interview Type & Role logic
  if (role === 'hr' || type === 'hr') {
    // Load HR questions
    const hrBank = questionBank.hr;
    const primary = hrBank[difficulty] || [];
    selectedPool = [...primary];

    if (selectedPool.length < count) {
      const remainingHR = Object.entries(hrBank)
        .filter(([diff]) => diff !== difficulty)
        .flatMap(([, list]) => list);
      selectedPool.push(...remainingHR);
    }
  } else if (type === 'mixed') {
    // Mixed: Combine technical questions for selected role + general HR questions
    const techPool = targetRoleBank[difficulty] || [];
    const hrBank = questionBank.hr;
    const hrPool = hrBank[difficulty] || hrBank.easy || [];

    // Aim for 70% technical, 30% HR
    const techCountTarget = Math.ceil(count * 0.7);
    const hrCountTarget = count - techCountTarget;

    const shuffledTech = shuffle(techPool).slice(0, techCountTarget);
    const shuffledHR = shuffle(hrPool).slice(0, hrCountTarget);

    selectedPool = [...shuffledTech, ...shuffledHR];

    // Top up if count not reached
    if (selectedPool.length < count) {
      const allRoleTech = Object.values(targetRoleBank).flat();
      const unusedTech = allRoleTech.filter(q => !selectedPool.some(s => s.id === q.id));
      selectedPool.push(...shuffle(unusedTech));
    }
  } else {
    // Technical / Coding (Default): Load strictly from selected role
    const primaryDiff = targetRoleBank[difficulty] || [];
    selectedPool = [...primaryDiff];

    // If insufficient questions in selected difficulty, fill from other difficulties IN THE SAME ROLE
    if (selectedPool.length < count) {
      const fallbackDiffs = Object.entries(targetRoleBank)
        .filter(([diff]) => diff !== difficulty)
        .flatMap(([, list]) => list);
      selectedPool.push(...fallbackDiffs);
    }
  }

  // 3. Deduplicate strictly by ID
  const uniquePool = [];
  const seenIds = new Set();
  for (const q of selectedPool) {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      uniquePool.push(q);
    }
  }

  // 4. Randomize order for every interview session
  const randomized = shuffle(uniquePool);

  // 5. Slice to exact requested question count
  const finalQuestions = randomized.slice(0, count);

  // 6. Number questions 1 to N
  return finalQuestions.map((q, idx) => ({ ...q, number: idx + 1 }));
};

/**
 * Adaptive Question Selector
 *
 * Selects the next question for an adaptive interview session.
 *
 * Rules:
 *  1. Never changes the interview role.
 *  2. Respects the requested targetDifficulty first.
 *  3. Excludes all previously answered question IDs.
 *  4. Falls back to the nearest available difficulty if the target is exhausted.
 *  5. Returns undefined if no unused question exists at any difficulty for this role.
 *
 * @param {Object} params
 * @param {string}   params.role             - Locked interview role key
 * @param {string}   params.currentDifficulty - Current difficulty tier
 * @param {string}   params.targetDifficulty  - Desired next difficulty tier
 * @param {string[]} params.answeredIds       - IDs of questions already answered
 * @param {string}   [params.type]            - Interview type ('technical', 'hr', 'mixed', 'coding')
 *
 * @returns {{ question: Object|undefined, actualDifficulty: string }}
 */
export function getNextAdaptiveQuestion({
  role,
  currentDifficulty: _currentDifficulty,
  targetDifficulty,
  answeredIds = [],
  type = 'technical',
}) {
  const answeredSet = new Set(answeredIds);

  // HR role always uses HR question bank regardless of type
  const isHRSession = role === 'hr' || type === 'hr';
  const roleBank    = isHRSession ? questionBank.hr : (questionBank[role] || questionBank.frontend);

  // Helper: get unused questions from a specific difficulty tier
  const unusedAtDiff = (diff) => {
    const pool = roleBank[diff] || [];
    return pool.filter(q => !answeredSet.has(q.id));
  };

  // Try target difficulty first
  const targetPool = unusedAtDiff(targetDifficulty);
  if (targetPool.length > 0) {
    const picked = targetPool[Math.floor(Math.random() * targetPool.length)];
    return { question: picked, actualDifficulty: targetDifficulty };
  }

  // Fallback order: nearest difficulty to target
  const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];
  const targetIdx = DIFFICULTY_ORDER.indexOf(targetDifficulty);

  // Try adjacent difficulties outward from target
  const fallbackOrder = [];
  for (let delta = 1; delta <= 2; delta++) {
    if (targetIdx - delta >= 0)                          fallbackOrder.push(DIFFICULTY_ORDER[targetIdx - delta]);
    if (targetIdx + delta < DIFFICULTY_ORDER.length)     fallbackOrder.push(DIFFICULTY_ORDER[targetIdx + delta]);
  }

  for (const diff of fallbackOrder) {
    const pool = unusedAtDiff(diff);
    if (pool.length > 0) {
      const picked = pool[Math.floor(Math.random() * pool.length)];
      return { question: picked, actualDifficulty: diff };
    }
  }

  // No question available at any difficulty
  return { question: undefined, actualDifficulty: targetDifficulty };
}
