// src/utils/interviewSessionLogger.js
/**
 * InterviewSessionLogger
 *
 * Lightweight, safe in-memory session event tracker for InterviewAI.
 * Tracks lifecycle events without logging candidate answers or sensitive credentials to console.
 */

export const SESSION_EVENT_TYPES = {
  INTERVIEW_STARTED: 'INTERVIEW_STARTED',
  INTRO_COMPLETED: 'INTRO_COMPLETED',
  QUESTION_ASKED: 'QUESTION_ASKED',
  ANSWER_STARTED: 'ANSWER_STARTED',
  ANSWER_SUBMITTED: 'ANSWER_SUBMITTED',
  AI_EVALUATION_STARTED: 'AI_EVALUATION_STARTED',
  AI_EVALUATION_COMPLETED: 'AI_EVALUATION_COMPLETED',
  FOLLOWUP_GENERATED: 'FOLLOWUP_GENERATED',
  FOLLOWUP_ANSWERED: 'FOLLOWUP_ANSWERED',
  DIFFICULTY_CHANGED: 'DIFFICULTY_CHANGED',
  QUESTION_COMPLETED: 'QUESTION_COMPLETED',
  INTERVIEW_COMPLETED: 'INTERVIEW_COMPLETED',
};

class SessionLogger {
  constructor() {
    this.events = [];
    this.startTime = Date.now();
  }

  reset() {
    this.events = [];
    this.startTime = Date.now();
  }

  log(type, questionId = null, metadata = {}) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      elapsedMs: Date.now() - this.startTime,
      questionId,
      metadata: { ...metadata },
    };

    this.events.push(event);
    return event;
  }

  getEvents() {
    return [...this.events];
  }

  getSummary() {
    const questionsAsked = this.events.filter((e) => e.type === SESSION_EVENT_TYPES.QUESTION_ASKED).length;
    const answersSubmitted = this.events.filter((e) => e.type === SESSION_EVENT_TYPES.ANSWER_SUBMITTED).length;
    const followUpsGenerated = this.events.filter((e) => e.type === SESSION_EVENT_TYPES.FOLLOWUP_GENERATED).length;
    const followUpsAnswered = this.events.filter((e) => e.type === SESSION_EVENT_TYPES.FOLLOWUP_ANSWERED).length;
    const difficultyChanges = this.events.filter((e) => e.type === SESSION_EVENT_TYPES.DIFFICULTY_CHANGED).length;

    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
      totalEvents: this.events.length,
      questionsAsked,
      answersSubmitted,
      followUpsGenerated,
      followUpsAnswered,
      difficultyChanges,
      durationSeconds,
      formattedDuration,
    };
  }
}

export const sessionLogger = new SessionLogger();
export default sessionLogger;
