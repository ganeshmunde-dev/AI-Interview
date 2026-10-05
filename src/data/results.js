// src/data/results.js
// Multi-criteria evaluation engine and role skill definitions for InterviewAI

// Role-specific skill definitions and learning recommendations
export const ROLE_SKILL_MAP = {
  frontend: {
    label: 'Frontend Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'DOM', 'React', 'API Integration', 'Responsive Design', 'Browser Concepts'],
    strengthsPool: [
      'Good understanding of HTML semantic structure and modern CSS styling concepts',
      'Solid application of JavaScript functions, DOM interaction, and browser APIs',
      'Effective responsive design layout techniques across device viewports',
    ],
    weaknessPool: [
      'Deep CSS specificity rules and browser rendering performance optimization',
      'Advanced JavaScript closures, event loop microtasks, and async state patterns',
    ],
    recommendationsMap: {
      'HTML': 'Review Semantic HTML5 elements and ARIA accessibility guidelines on MDN Web Docs.',
      'CSS': 'Practice modern layout techniques with CSS Grid and Flexbox on CSS-Tricks.',
      'JavaScript': 'Deep-dive into Event Loop and Closures in "You Don\'t Know JS" by Kyle Simpson.',
      'DOM': 'Explore browser DOM rendering pipeline and repaint/reflow optimizations.',
      'React': 'Study React 18 documentation on Component Lifecycle and state batching.',
      'API Integration': 'Practice working with Fetch API, Web Storage, and Async/Await handling.',
      'Responsive Design': 'Build complex mobile-first layouts using CSS media queries and flex layout.',
      'Browser Concepts': 'Study browser caching, storage mechanisms, and critical rendering path.',
    },
  },

  react_dev: {
    label: 'React Developer',
    skills: ['Components', 'Props', 'State', 'Hooks', 'Context API', 'React Router', 'API Integration', 'Performance'],
    strengthsPool: [
      'Solid command over React functional components and state flow',
      'Effective usage of React Hooks for state management and side effects',
      'Good understanding of component props passing and composition',
    ],
    weaknessPool: [
      'Advanced performance optimization using React.memo, useMemo, and useCallback',
      'Complex Context API patterns and preventing unnecessary sub-tree re-renders',
    ],
    recommendationsMap: {
      'Components': 'Read the official React docs on thinking in React and component composition.',
      'Props': 'Review prop-types and TypeScript interfaces for strict component props validation.',
      'State': 'Practice lift-state-up patterns and local state boundaries.',
      'Hooks': 'Practice writing reusable custom hooks for data fetching and form state.',
      'Context API': 'Study Context API performance patterns and how to prevent unnecessary renders.',
      'React Router': 'Explore React Router v6 nested routes, loaders, and protected route patterns.',
      'API Integration': 'Master async state management with TanStack Query or custom fetch hooks.',
      'Performance': 'Watch React Performance profiling tutorials using React DevTools Profiler.',
    },
  },

  java_dev: {
    label: 'Java Developer',
    skills: ['Core Java', 'OOP', 'Collections', 'Exception Handling', 'Multithreading', 'Java 8+', 'JVM'],
    strengthsPool: [
      'Strong foundation in Core Java fundamentals and Object-Oriented design',
      'Good understanding of Collections Framework interfaces and implementations',
      'Proper usage of exception handling hierarchies and try-with-resources',
    ],
    weaknessPool: [
      'Java Memory Model, Garbage Collection tuning, and heap memory optimization',
      'Advanced Concurrency utilities (ConcurrentHashMap, BlockingQueue, Executors)',
    ],
    recommendationsMap: {
      'Core Java': 'Review Core Java fundamentals and memory stack/heap allocation concepts.',
      'OOP': 'Study SOLID design principles and Design Patterns in Java by GoF.',
      'Collections': 'Read Java Collections internals documentation on HashMap hashing.',
      'Exception Handling': 'Practice checked vs unchecked exception handling best practices.',
      'Multithreading': 'Read "Java Concurrency in Practice" by Brian Goetz.',
      'Java 8+': 'Study Streams API, Lambda expressions, and Optional class patterns.',
      'JVM': 'Explore JVM Architecture, ClassLoader delegation, and Garbage Collectors.',
    },
  },

  spring_boot: {
    label: 'Spring Boot Developer',
    skills: ['Spring Boot', 'REST API', 'Spring MVC', 'JPA', 'Hibernate', 'Spring Security', 'JWT'],
    strengthsPool: [
      'Solid understanding of Dependency Injection, IoC container, and Spring annotations',
      'Good design of RESTful APIs following standard HTTP status codes and patterns',
      'Effective usage of Spring Data JPA repositories and entity relationships',
    ],
    weaknessPool: [
      'Complex JPA Hibernate N+1 query optimization and L2 cache configuration',
      'Spring Security filter chain configuration and JWT token verification',
    ],
    recommendationsMap: {
      'Spring Boot': 'Build end-to-end Spring Boot REST services with Spring Initializr.',
      'REST API': 'Read REST API design guidelines for status codes, exception advice, and DTOs.',
      'Spring MVC': 'Study Spring MVC request mapping, model attributes, and view resolution.',
      'JPA': 'Learn how to solve N+1 problem using @EntityGraph and JOIN FETCH queries.',
      'Hibernate': 'Study Hibernate entity states, dirty checking, and session management.',
      'Spring Security': 'Tutorial on Spring Security 6 filter chains and JWT authentication implementation.',
      'JWT': 'Practice building stateless token-based auth with io.jsonwebtoken library.',
    },
  },

  php: {
    label: 'PHP Developer',
    skills: ['PHP', 'OOP', 'MySQL', 'MVC', 'Authentication', 'Sessions'],
    strengthsPool: [
      'Good understanding of PHP syntax, superglobals, and array manipulation',
      'Solid grasp of PHP Object-Oriented principles and class structures',
      'Clear knowledge of session management and MySQL database connectivity',
    ],
    weaknessPool: [
      'Advanced MVC framework patterns and Composer PSR-4 autoloading standards',
      'Prepared statements and SQL injection prevention techniques',
    ],
    recommendationsMap: {
      'PHP': 'Study modern PHP 8 features, type hints, and PSR coding standards.',
      'OOP': 'Practice OOP inheritance, interfaces, abstract classes, and traits in PHP.',
      'MySQL': 'Master PDO prepared statements and relational schema indexing.',
      'MVC': 'Explore Laravel or Symfony architecture and Front Controller pattern.',
      'Authentication': 'Implement password_hash and secure session cookie storage.',
      'Sessions': 'Study session hijack prevention and session storage mechanisms.',
    },
  },

  fullstack: {
    label: 'Java Full Stack Developer',
    skills: ['Java Core', 'Spring Boot', 'React', 'MySQL', 'REST APIs', 'System Architecture'],
    strengthsPool: [
      'Comprehensive understanding of full stack flow from React UI to Spring Boot & MySQL',
      'Good implementation of RESTful endpoints and frontend state integration',
      'Effective database schema design and JPA entity mappings',
    ],
    weaknessPool: [
      'End-to-end JWT security integration and CORS configuration across origins',
      'Full stack performance optimization and system architecture scalability',
    ],
    recommendationsMap: {
      'Java Core': 'Solidify Java 17/21 core concepts, Collections, and Streams.',
      'Spring Boot': 'Build monolithic and microservice backends with Spring Boot 3.',
      'React': 'Practice building modular React UIs with Tailwind CSS and Context API.',
      'MySQL': 'Study SQL query indexing, joins, and JPA relationship mappings.',
      'REST APIs': 'Design robust REST APIs with OpenAPI/Swagger documentation.',
      'System Architecture': 'Read "Designing Data-Intensive Applications" by Martin Kleppmann.',
    },
  },

  backend: {
    label: 'Backend Developer',
    skills: ['REST APIs', 'System Design', 'Databases & SQL', 'Authentication', 'API Security', 'Caching'],
    strengthsPool: [
      'Clear understanding of RESTful architectural constraints and HTTP semantics',
      'Good knowledge of relational database schema design and SQL query composition',
      'Solid grasp of backend authentication flows and security principles',
    ],
    weaknessPool: [
      'Distributed systems architecture, CAP theorem, and system design scalability',
      'Caching strategies with Redis and rate limiting infrastructure setup',
    ],
    recommendationsMap: {
      'REST APIs': 'Learn REST API best practices, idempotency, and OpenAPI specifications.',
      'System Design': 'Study System Design Primer on GitHub covering load balancers and sharding.',
      'Databases & SQL': 'Practice complex SQL queries, transactions ACID properties, and indexing.',
      'Authentication': 'Explore OAuth2, OpenID Connect, and JWT security standards.',
      'API Security': 'Read OWASP Top 10 Security Risks guide for backend protection.',
      'Caching': 'Tutorial on Redis caching strategies and invalidation patterns.',
    },
  },

  hr: {
    label: 'HR Round',
    skills: ['Communication', 'Confidence', 'Clarity', 'Teamwork', 'Leadership', 'Problem Solving', 'Situational Judgment', 'Professionalism'],
    strengthsPool: [
      'Clear communication and structured answer delivery',
      'Good teamwork example and collaboration mindset',
      'Confident response delivery with positive professional tone',
      'Solid situational judgment and problem solving approach',
    ],
    weaknessPool: [
      'Provide more specific examples using STAR method',
      'Structure answers more clearly and concisely',
      'Avoid very short responses to behavioral prompts',
    ],
    recommendationsMap: {
      'Communication': 'Practice delivering concise answers using concise bullet-point structures.',
      'Confidence': 'Practice speaking with a calm, assertive tone and steady pace.',
      'Clarity': 'Structure your key points upfront before elaborating on details.',
      'Teamwork': 'Prepare story examples highlighting collaboration and conflict resolution.',
      'Leadership': 'Detail times you stepped up to guide peers or coordinate deliverables.',
      'Problem Solving': 'Highlight analytical thinking steps when overcoming obstacles.',
      'Situational Judgment': 'Frame challenges around constructive reflections and positive outcomes.',
      'Professionalism': 'Express alignment with workplace ethics, reliability, and growth mindset.',
    },
  },
};

/**
 * Multi-criteria Answer Evaluator
 * Evaluates relevance, correctness, completeness, clarity, technical accuracy, and depth.
 * For HR: evaluates communication, clarity, confidence, professionalism, problem solving, teamwork.
 */
export const evaluateSingleAnswer = (questionObj = {}, answerText = '', roleKey = 'frontend', isHR = false) => {
  const text = (answerText || '').trim();
  const lowerText = text.toLowerCase();

  // 1. Low effort / Nonsense / Extremely short filter
  const lowEffortList = ['idk', 'dunno', 'no', 'yes', 'pass', 'asdf', 'test', 'nothing', 'skip', 'ok', 'good'];
  if (text.length < 5 || lowEffortList.includes(lowerText)) {
    return {
      score: 20,
      relevance: 15,
      correctness: 15,
      completeness: 10,
      clarity: 30,
      category: questionObj.category || 'General',
    };
  }

  // 2. Keyword & Domain Relevance Analysis
  let domainKeywords = [];
  if (isHR) {
    domainKeywords = [
      'explain', 'clarify', 'communicate', 'listen', 'present', 'discuss', 'share', 'speak', 'clear',
      'team', 'collaborate', 'together', 'lead', 'help', 'guide', 'support', 'member', 'we', 'group',
      'solve', 'challenge', 'issue', 'resolve', 'handle', 'situation', 'result', 'action', 'task', 'star',
      'approach', 'decision', 'example', 'responsibility', 'learn', 'improve', 'feedback', 'goal',
      'experience', 'positive', 'professional', 'work', 'career', 'project', 'conflict', 'time',
    ];
  } else if (roleKey === 'frontend' || roleKey === 'react_dev') {
    domainKeywords = [
      'html', 'css', 'javascript', 'js', 'dom', 'react', 'component', 'state', 'props', 'hook',
      'useeffect', 'usestate', 'context', 'router', 'api', 'fetch', 'async', 'await', 'flexbox',
      'grid', 'responsive', 'browser', 'render', 'virtual dom', 'closure', 'event', 'element',
      'function', 'variable', 'scope', 'promise', 'callback', 'layout', 'style', 'selector',
    ];
  } else if (roleKey === 'java_dev' || roleKey === 'spring_boot' || roleKey === 'fullstack') {
    domainKeywords = [
      'java', 'object', 'class', 'interface', 'spring', 'boot', 'annotation', 'jpa', 'hibernate',
      'thread', 'collection', 'jvm', 'exception', 'memory', 'method', 'rest', 'api', 'stream',
      'lambda', 'sql', 'mysql', 'bean', 'ioc', 'jwt', 'security', 'oop', 'heap', 'stack', 'override',
    ];
  } else if (roleKey === 'php') {
    domainKeywords = [
      'php', 'pdo', 'mysql', 'table', 'query', 'mvc', 'session', 'cookie', 'function', 'array',
      'class', 'object', 'post', 'get', 'script', 'database', 'auth', 'password', 'composer',
    ];
  } else {
    domainKeywords = [
      'api', 'rest', 'system', 'design', 'database', 'sql', 'auth', 'security', 'cache', 'redis',
      'http', 'request', 'response', 'server', 'data', 'architecture', 'token', 'user',
    ];
  }

  // Question specific keywords
  const questionWords = (questionObj.question || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const categoryWords = (questionObj.category || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const targetKeyTerms = new Set([...domainKeywords, ...questionWords, ...categoryWords]);

  // Count matched domain terms
  let matchedTerms = 0;
  targetKeyTerms.forEach(term => {
    if (lowerText.includes(term)) matchedTerms++;
  });

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;

  // Structural markers (depth indicators)
  const depthMarkers = ['for example', 'because', 'such as', 'however', 'firstly', 'therefore', 'in order to', 'main difference', 'step', 'result'];
  let depthBonus = 0;
  depthMarkers.forEach(m => {
    if (lowerText.includes(m)) depthBonus += 5;
  });

  // Calculate Sub-scores
  // Relevance (0 - 100)
  const relevance = Math.min(100, Math.round((matchedTerms / Math.max(3, targetKeyTerms.size * 0.4)) * 100));

  // Completeness & Depth (0 - 100)
  let completeness = 40;
  if (wordCount > 60) completeness = 95;
  else if (wordCount > 35) completeness = 82;
  else if (wordCount > 18) completeness = 68;
  else if (wordCount > 8) completeness = 52;
  completeness = Math.min(100, completeness + depthBonus);

  // Technical Accuracy / Correctness (0 - 100)
  const correctness = Math.min(100, Math.round(relevance * 0.6 + completeness * 0.4));

  // Clarity (0 - 100)
  const clarity = sentenceCount >= 2 && wordCount >= 12 ? 88 : wordCount >= 6 ? 72 : 50;

  // Composite Weighted Score
  const score = Math.min(98, Math.max(20, Math.round(
    relevance * 0.35 +
    correctness * 0.35 +
    completeness * 0.20 +
    clarity * 0.10
  )));

  return {
    score,
    relevance,
    correctness,
    completeness,
    clarity,
    category: questionObj.category || 'General',
  };
};

/**
 * Main Evaluation Engine
 * Produces deterministic, personalized interview results based on real AI evaluations,
 * candidate answers, follow-up answers, and canonical role skills.
 *
 * @param {Object} config - { role, difficulty, type, count, personality }
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - { questionId: answerText }
 * @param {number|null} resultScore - Optional override score
 * @param {Object} evaluations - { questionId: AiEvaluationResult }
 * @param {Object} followUpAnswers - { questionId: { question, answer, isSubmitted } }
 */
export const generateRoleResults = (
  config = {},
  questions = [],
  answers = {},
  resultScore = null,
  evaluations = {},
  followUpAnswers = {}
) => {
  // 1. Resolve canonical role and interview type
  const isHR = config.role === 'hr' || config.type === 'hr';
  const roleKey = isHR ? 'hr' : (config.role || 'frontend');
  const roleInfo = ROLE_SKILL_MAP[roleKey] || (isHR ? ROLE_SKILL_MAP.hr : ROLE_SKILL_MAP.frontend);
  const roleLabel = roleInfo.label || 'Software Developer';
  const baseSkills = roleInfo.skills;

  // 2. Filter non-empty answers
  const validAnswerEntries = Object.entries(answers || {}).filter(
    ([_, text]) => typeof text === 'string' && text.trim().length > 0
  );
  const attemptedCount = validAnswerEntries.length;
  const totalCount = questions.length || config.count || 5;

  // ── FEATURE 3: ZERO ANSWER PROTECTION ───────────────────────────────────────
  if (attemptedCount === 0) {
    const skillScores = baseSkills.map((skill) => ({ skill, score: 0, maxScore: 100 }));
    return {
      interviewId: `int-${Date.now()}`,
      role: roleLabel,
      roleKey,
      difficulty: (config.difficulty || 'medium').charAt(0).toUpperCase() + (config.difficulty || 'medium').slice(1),
      type: (config.type || 'technical').charAt(0).toUpperCase() + (config.type || 'technical').slice(1),
      date: new Date().toISOString(),
      duration: '0 min',
      totalQuestions: totalCount,
      attempted: 0,
      overallScore: 0,
      evaluationStatus: 'Not Evaluated',
      feedbackSummary: 'No questions were answered, so the interview could not be evaluated.',
      aiSummary: 'No questions were answered, so the interview could not be evaluated.',
      skillScores,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      questionAnalysis: [],
      radarData: {
        labels: baseSkills,
        datasets: [
          {
            label: 'Your Score',
            data: baseSkills.map(() => 0),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          },
          {
            label: 'Benchmark Score',
            data: baseSkills.map(() => 70),
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgba(139, 92, 246, 0.6)',
            pointBackgroundColor: 'rgba(139, 92, 246, 0.6)',
          },
        ],
      },
    };
  }

  // ── FEATURE 4 & 5: PARTIAL & FULL ANSWER EVALUATION ─────────────────────────
  // Evaluate strictly the submitted answers using real AI evaluations or fallback
  const evaluatedQuestions = validAnswerEntries.map(([qId, ansText]) => {
    const qObj = questions.find((q) => q.id === qId) || {
      id: qId,
      category: 'General',
      skill: 'General',
      question: '',
    };
    const qSkill = qObj.skill || qObj.category || 'General';
    const fuData = followUpAnswers[qId];
    const aiEval = evaluations[qId];

    let evalScore;
    let evalRating;
    let evalRelevance;
    let evalCorrectness;
    let evalDepth;
    let evalCompleteness;
    let evalClarity;
    let evalFeedback;
    let evalStrengths;
    let evalImprovements;
    let evalIdealAnswer;

    if (aiEval && typeof aiEval.score === 'number' && aiEval.score > 0) {
      evalScore = aiEval.score;
      evalRating = aiEval.rating || (evalScore >= 80 ? 'Strong' : evalScore >= 65 ? 'Good' : evalScore >= 45 ? 'Adequate' : 'Needs Improvement');
      evalRelevance = aiEval.relevance ?? evalScore;
      evalCorrectness = aiEval.correctness ?? evalScore;
      evalDepth = aiEval.depth ?? Math.max(20, evalScore - 5);
      evalCompleteness = aiEval.completeness ?? evalScore;
      evalClarity = aiEval.clarity ?? evalScore;
      evalFeedback = aiEval.feedback || 'Answer evaluated with AI.';
      evalStrengths = Array.isArray(aiEval.strengths) && aiEval.strengths.length > 0 ? aiEval.strengths : [`Demonstrated good understanding of ${qSkill}`];
      evalImprovements = Array.isArray(aiEval.improvements) && aiEval.improvements.length > 0 ? aiEval.improvements : [`Deepen conceptual explanation for ${qSkill}`];
      evalIdealAnswer = aiEval.idealAnswer || null;
    } else {
      const fallback = evaluateSingleAnswer(qObj, ansText, roleKey, isHR);
      evalScore = fallback.score;
      evalRating = evalScore >= 80 ? 'Strong' : evalScore >= 65 ? 'Good' : evalScore >= 45 ? 'Adequate' : 'Needs Improvement';
      evalRelevance = fallback.relevance;
      evalCorrectness = fallback.correctness;
      evalDepth = Math.max(20, evalScore - 8);
      evalCompleteness = fallback.completeness;
      evalClarity = fallback.clarity;
      evalFeedback = isHR
        ? 'Response provided situational context. Structure answers using Situation, Task, Action, Result.'
        : `Answer demonstrated fundamental familiarity with ${qSkill}. Focus on implementation trade-offs.`;
      evalStrengths = [isHR ? `Communicated relevant context for ${qSkill}` : `Addressed core concepts in ${qSkill}`];
      evalImprovements = [isHR ? `Provide measurable impact for ${qSkill}` : `Deepen technical explanation in ${qSkill}`];
      evalIdealAnswer = null;
    }

    // Follow-up answer adjustment if present
    if (fuData?.answer && fuData.answer.trim()) {
      // Follow-up provided: increases completeness/depth bonus
      const fuWords = fuData.answer.trim().split(/\s+/).filter(Boolean).length;
      if (fuWords >= 10 && evalScore < 95) {
        evalScore = Math.min(100, evalScore + Math.min(6, Math.round(fuWords / 8)));
      }
    }

    return {
      questionId: qId,
      question: qObj.question,
      category: qObj.category || qSkill,
      skill: qSkill,
      primaryAnswer: ansText,
      followUpQuestion: fuData?.question || null,
      followUpAnswer: fuData?.answer || null,
      score: evalScore,
      rating: evalRating,
      relevance: evalRelevance,
      correctness: evalCorrectness,
      depth: evalDepth,
      completeness: evalCompleteness,
      clarity: evalClarity,
      feedback: evalFeedback,
      strengths: evalStrengths,
      improvements: evalImprovements,
      idealAnswer: evalIdealAnswer,
    };
  });

  // ── FEATURE 7: OVERALL SCORE CALCULATION ────────────────────────────────────
  const sumScores = evaluatedQuestions.reduce((acc, curr) => acc + curr.score, 0);
  const calculatedAvgScore = Math.round(sumScores / attemptedCount);
  const finalOverallScore =
    resultScore !== null ? Math.min(100, Math.max(0, Math.round(resultScore))) : calculatedAvgScore;

  // ── FEATURE 6: ROLE-SPECIFIC SKILL SCORING ──────────────────────────────────
  const skillScorePool = new Map();
  evaluatedQuestions.forEach((item) => {
    const sName = item.skill;
    if (!skillScorePool.has(sName)) skillScorePool.set(sName, []);
    skillScorePool.get(sName).push(item.score);
  });

  const skillScores = baseSkills.map((skill) => {
    const scoresForSkill = skillScorePool.get(skill) || [];
    let score = 0;
    if (scoresForSkill.length > 0) {
      score = Math.round(scoresForSkill.reduce((a, b) => a + b, 0) / scoresForSkill.length);
    } else if (attemptedCount > 0) {
      // For unattempted skills in a partial session, estimate proportionally to overall score
      score = Math.min(92, Math.max(25, finalOverallScore));
    } else {
      score = 0;
    }
    return { skill, score, maxScore: 100 };
  });

  const isFull = attemptedCount === totalCount;
  const evaluationStatus = isFull ? 'Completed' : 'Partially Evaluated';

  // ── FEATURE 8: PERSONALIZED STRENGTHS ───────────────────────────────────────
  const personalizedStrengths = [];
  evaluatedQuestions.forEach((q) => {
    if (q.score >= 65 && Array.isArray(q.strengths)) {
      q.strengths.forEach((s) => {
        if (!personalizedStrengths.includes(s) && personalizedStrengths.length < 5) {
          personalizedStrengths.push(s);
        }
      });
    }
  });
  if (personalizedStrengths.length === 0) {
    personalizedStrengths.push(
      isHR
        ? `Participated in behavioral interview questions with professional tone`
        : `Demonstrated fundamental technical knowledge for ${roleLabel}`
    );
  }

  // ── FEATURE 9: PERSONALIZED WEAKNESSES ───────────────────────────────────────
  const personalizedWeaknesses = [];
  if (!isFull) {
    personalizedWeaknesses.push(
      `${totalCount - attemptedCount} question(s) were skipped, which reduced your overall completeness score.`
    );
  }
  evaluatedQuestions.forEach((q) => {
    if (Array.isArray(q.improvements)) {
      q.improvements.forEach((imp) => {
        if (!personalizedWeaknesses.includes(imp) && personalizedWeaknesses.length < 5) {
          personalizedWeaknesses.push(imp);
        }
      });
    }
  });
  if (personalizedWeaknesses.length === 0) {
    personalizedWeaknesses.push(
      isHR
        ? `Continue to practice structuring complex behavioral responses using STAR principles`
        : `Deepen your understanding of advanced ${roleLabel} performance optimization`
    );
  }

  // ── FEATURE 10: PERSONALIZED RECOMMENDATIONS ────────────────────────────────
  const weakSkillsList = skillScores.filter((s) => s.score < 75).map((s) => s.skill);
  const targetSkills = weakSkillsList.length > 0 ? weakSkillsList : baseSkills.slice(-3);
  const recommendations = targetSkills.slice(0, 3).map((skill) => ({
    topic: skill,
    resource:
      roleInfo.recommendationsMap[skill] ||
      `Review core principles and practical interview scenarios for ${skill}.`,
  }));

  // ── FEATURE 14: PERSONALIZED AI SUMMARY ─────────────────────────────────────
  const topSkill = [...skillScores].sort((a, b) => b.score - a.score)[0]?.skill || baseSkills[0];
  const lowestSkill = [...skillScores].sort((a, b) => a.score - b.score)[0]?.skill || baseSkills[baseSkills.length - 1];

  let aiSummary = '';
  if (isHR) {
    if (finalOverallScore >= 80) {
      aiSummary = `The candidate demonstrated strong interpersonal communication, professional maturity, and excellent situational judgment. Strongest performance was observed in ${topSkill}. For continuous growth, focus on refining ${lowestSkill}.`;
    } else if (finalOverallScore >= 60) {
      aiSummary = `The candidate provided constructive responses with good communication clarity in ${topSkill}. To improve interview readiness, structure behavioral scenarios more strictly with measurable STAR outcomes in ${lowestSkill}.`;
    } else {
      aiSummary = `The candidate completed ${attemptedCount} question(s). Performance indicates room for growth in structuring behavioral narratives and demonstrating conflict resolution and problem-solving depth in ${lowestSkill}.`;
    }
  } else {
    if (finalOverallScore >= 80) {
      aiSummary = `Overall, the candidate demonstrated solid technical acumen and structured problem-solving in ${roleLabel}. Demonstrates particularly strong mastery in ${topSkill}. Key area for advanced refinement is deeper trade-off analysis in ${lowestSkill}.`;
    } else if (finalOverallScore >= 60) {
      aiSummary = `The candidate showed good conceptual understanding of core ${roleLabel} topics with notable strength in ${topSkill}. Focus on deepening practical implementation details, error handling, and performance optimization in ${lowestSkill}.`;
    } else {
      aiSummary = `The candidate attempted ${attemptedCount} of ${totalCount} question(s). Foundational knowledge was presented in ${topSkill}, but further practice on core concepts, system patterns, and edge cases in ${lowestSkill} is strongly recommended.`;
    }
  }

  const radarData = {
    labels: baseSkills,
    datasets: [
      {
        label: 'Your Score',
        data: skillScores.map((s) => s.score),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Benchmark Score',
        data: baseSkills.map(() => 70),
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.6)',
        pointBackgroundColor: 'rgba(139, 92, 246, 0.6)',
      },
    ],
  };

  return {
    interviewId: `int-${Date.now()}`,
    role: roleLabel,
    roleKey,
    difficulty: (config.difficulty || 'medium').charAt(0).toUpperCase() + (config.difficulty || 'medium').slice(1),
    type: (config.type || 'technical').charAt(0).toUpperCase() + (config.type || 'technical').slice(1),
    date: new Date().toISOString(),
    duration: `${Math.max(2, Math.round(attemptedCount * 2.5))} min`,
    totalQuestions: totalCount,
    attempted: attemptedCount,
    overallScore: finalOverallScore,
    evaluationStatus,
    feedbackSummary: isFull
      ? `Full evaluation based on all ${totalCount} answered questions.`
      : `Evaluation based on ${attemptedCount} of ${totalCount} answered questions.`,
    aiSummary,
    skillScores,
    strengths: personalizedStrengths,
    weaknesses: personalizedWeaknesses,
    recommendations,
    questionAnalysis: evaluatedQuestions,
    radarData,
  };
};

// Fallback default mock result generator if accessed directly without config
export const mockResult = generateRoleResults({ role: 'frontend', difficulty: 'medium', type: 'technical', count: 5 }, [], {});
export const skillRadarData = mockResult.radarData;



