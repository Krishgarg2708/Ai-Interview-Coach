import type { InterviewConfig, InterviewMessage, InterviewReport } from './types';

interface QuestionTemplate {
  id: string;
  text: string;
  category: 'technical' | 'hr' | 'behavioral' | 'system_design' | 'coding';
  followUps: string[];
  expectedKeywords?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTION_BANK: Record<string, QuestionTemplate[]> = {
  frontend: [
    {
      id: 'fe1',
      text: 'Walk me through your experience with React and the projects you have built with it.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['react', 'component', 'state', 'hook', 'jsx'],
      followUps: [
        'Which of those projects are you most proud of, and why?',
        'How did you manage state in that application — Context, Redux, or something else?',
        'Tell me about a performance issue you encountered and how you solved it.',
        'How would you optimize a React component that re-renders too often?',
      ],
    },
    {
      id: 'fe2',
      text: 'Explain the difference between controlled and uncontrolled components in React.',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['controlled', 'uncontrolled', 'state', 'ref', 'form'],
      followUps: [
        'When would you choose one over the other?',
        'How do you handle form validation in a controlled component?',
        'What are the trade-offs of using refs for form data?',
      ],
    },
    {
      id: 'fe3',
      text: 'What happens when you type a URL in the browser and hit enter?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['dns', 'tcp', 'http', 'render', 'html', 'css'],
      followUps: [
        'How does DNS resolution work at a high level?',
        'What is the critical rendering path?',
        'How would you reduce the time to first paint?',
        'Explain how HTTPS differs from HTTP and why it matters.',
      ],
    },
    {
      id: 'fe4',
      text: 'How do you ensure accessibility in the interfaces you build?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['aria', 'semantic', 'keyboard', 'contrast', 'screen reader'],
      followUps: [
        'What are some common ARIA attributes you use?',
        'How do you test for accessibility issues?',
        'Tell me about a time you made an existing UI accessible.',
      ],
    },
    {
      id: 'fe5',
      text: 'Describe a time you had a disagreement with a designer about a feature. How did you resolve it?',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['communicate', 'compromise', 'data', 'user', 'test'],
      followUps: [
        'What did you learn from that situation?',
        'How would you handle it differently next time?',
      ],
    },
  ],
  backend: [
    {
      id: 'be1',
      text: 'Walk me through your backend experience and the systems you have built.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['api', 'database', 'server', 'scale', 'service'],
      followUps: [
        'Pick the most complex system — describe its architecture.',
        'How did you handle database scaling or query optimization?',
        'What patterns did you use for inter-service communication?',
        'How did you ensure reliability under high load?',
      ],
    },
    {
      id: 'be2',
      text: 'Explain how you would design the backend of a URL shortener like bit.ly.',
      category: 'system_design',
      difficulty: 'medium',
      expectedKeywords: ['hash', 'database', 'cache', 'redirect', 'scale'],
      followUps: [
        'How do you handle collisions in the shortened key?',
        'How would you scale the read path for billions of lookups?',
        'What database would you choose and why?',
        'How do you handle analytics on the redirects?',
      ],
    },
    {
      id: 'be3',
      text: 'What is the difference between SQL and NoSQL databases, and when would you use each?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['sql', 'nosql', 'acid', 'schema', 'scale'],
      followUps: [
        'Give an example where NoSQL is the wrong choice.',
        'How do transactions work in a NoSQL store like MongoDB?',
        'What is eventual consistency and when is it acceptable?',
      ],
    },
    {
      id: 'be4',
      text: 'How do you secure an API that handles user authentication?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['jwt', 'oauth', 'hash', 'https', 'session'],
      followUps: [
        'How would you handle token refresh?',
        'What are the trade-offs of JWT vs session-based auth?',
        'How do you protect against brute-force attacks?',
      ],
    },
    {
      id: 'be5',
      text: 'Tell me about a production incident you debugged. How did you find the root cause?',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['investigate', 'log', 'monitor', 'fix', 'communicate'],
      followUps: [
        'How did you balance fixing the issue with communicating the status?',
        'What did you add afterwards to prevent a repeat?',
      ],
    },
  ],
  full_stack: [
    {
      id: 'fs1',
      text: 'Describe a full-stack feature you built end-to-end. What were you responsible for?',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['frontend', 'backend', 'api', 'database', 'deploy'],
      followUps: [
        'Explain the data flow from the database to the UI.',
        'How did you handle state synchronization between frontend and backend?',
        'What was the hardest part to get right?',
      ],
    },
    {
      id: 'fs2',
      text: 'How would you design a real-time chat application?',
      category: 'system_design',
      difficulty: 'medium',
      expectedKeywords: ['websocket', 'database', 'scale', 'presence', 'message'],
      followUps: [
        'How do you scale websockets to a million users?',
        'How do you handle message ordering and delivery guarantees?',
        'What happens when a user reconnects after being offline?',
      ],
    },
    {
      id: 'fs3',
      text: 'How do you monitor and debug performance across the stack?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['profiling', 'log', 'trace', 'latency', 'metric'],
      followUps: [
        'What metrics would you alert on first?',
        'How do you trace a slow request across services?',
      ],
    },
    {
      id: 'fs4',
      text: 'Describe a time you had to make a technical decision under a tight deadline.',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['trade-off', 'priorit', 'communicate', 'ship', 'iterate'],
      followUps: [
        'What was the trade-off you accepted?',
        'Did you revisit the decision later? How?',
      ],
    },
  ],
  ai_engineer: [
    {
      id: 'ai1',
      text: 'Walk me through an AI feature you have shipped — from idea to production.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['llm', 'prompt', 'evaluation', 'deploy', 'data'],
      followUps: [
        'How did you evaluate model quality before shipping?',
        'What did you do when the model produced bad outputs?',
        'How did you handle latency and cost?',
        'How did you detect and prevent prompt injection?',
      ],
    },
    {
      id: 'ai2',
      text: 'Explain how a transformer model works at a level a junior engineer could understand.',
      category: 'technical',
      difficulty: 'hard',
      expectedKeywords: ['attention', 'token', 'embedding', 'layer', 'softmax'],
      followUps: [
        'Why is self-attention better than recurrence for long sequences?',
        'What is the role of positional encoding?',
        'How does training differ from inference?',
      ],
    },
    {
      id: 'ai3',
      text: 'How would you design a retrieval-augmented generation (RAG) system?',
      category: 'system_design',
      difficulty: 'medium',
      expectedKeywords: ['embedding', 'vector', 'retrieve', 'chunk', 'rerank'],
      followUps: [
        'How do you choose the chunk size?',
        'What vector database would you use and why?',
        'How do you evaluate retrieval quality?',
        'How do you handle stale or conflicting documents?',
      ],
    },
  ],
  ml_engineer: [
    {
      id: 'ml1',
      text: 'Describe an ML model you trained and deployed. What was the problem and the outcome?',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['feature', 'train', 'evaluate', 'deploy', 'metric'],
      followUps: [
        'How did you handle data drift in production?',
        'What evaluation metrics mattered most and why?',
        'How would you retrain without downtime?',
      ],
    },
    {
      id: 'ml2',
      text: 'Explain the bias-variance trade-off.',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['bias', 'variance', 'overfit', 'underfit', 'regulariz'],
      followUps: [
        'How do you detect overfitting in practice?',
        'What regularization techniques have you used?',
        'How does this affect your model selection?',
      ],
    },
  ],
  data_scientist: [
    {
      id: 'ds1',
      text: 'Tell me about a dataset you analyzed that led to a business decision.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['clean', 'analyze', 'insight', 'stakeholder', 'metric'],
      followUps: [
        'How did you handle missing or dirty data?',
        'How did you communicate findings to non-technical stakeholders?',
        'What would you do differently with more time?',
      ],
    },
    {
      id: 'ds2',
      text: 'How do you choose between classification and regression for a new problem?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['classification', 'regression', 'label', 'continuous', 'metric'],
      followUps: [
        'What metrics would you use to evaluate each?',
        'How do you handle class imbalance?',
      ],
    },
  ],
  software_engineer: [
    {
      id: 'se1',
      text: 'Walk me through a non-trivial system or feature you designed.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['design', 'component', 'trade-off', 'scale', 'test'],
      followUps: [
        'What were the main trade-offs you considered?',
        'How did you test the most critical paths?',
        'How would you evolve it if traffic grew 100x?',
      ],
    },
    {
      id: 'se2',
      text: 'Explain how a hash table works and when you would use one.',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['hash', 'key', 'bucket', 'collision', 'constant'],
      followUps: [
        'How do you handle collisions?',
        'What is the worst-case complexity and when does it happen?',
        'When would a hash map be a poor choice?',
      ],
    },
    {
      id: 'se3',
      text: 'How do you test code that depends on external services?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['mock', 'stub', 'integration', 'contract', 'test'],
      followUps: [
        'How do you avoid brittle integration tests?',
        'What is contract testing and when is it useful?',
      ],
    },
    {
      id: 'se4',
      text: 'Tell me about a time you mentored a junior engineer.',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['mentor', 'patience', 'feedback', 'growth', 'pair'],
      followUps: [
        'How did you measure their progress?',
        'What did you learn about your own communication?',
      ],
    },
  ],
  devops: [
    {
      id: 'do1',
      text: 'Walk me through your CI/CD pipeline — from commit to production.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['ci', 'cd', 'test', 'deploy', 'rollback'],
      followUps: [
        'How do you handle a bad deployment?',
        'What is your rollback strategy?',
        'How do you keep deploy times under control?',
        'How do you secure secrets in the pipeline?',
      ],
    },
    {
      id: 'do2',
      text: 'How would you design a monitoring and alerting system for a microservices backend?',
      category: 'system_design',
      difficulty: 'medium',
      expectedKeywords: ['metric', 'log', 'trace', 'alert', 'slo'],
      followUps: [
        'What is an SLO and how do you set one?',
        'How do you avoid alert fatigue?',
        'How do you correlate logs, metrics, and traces?',
      ],
    },
  ],
  cyber_security: [
    {
      id: 'cs1',
      text: 'How would you secure a web application against the most common attacks?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['xss', 'csrf', 'sql injection', 'auth', 'https'],
      followUps: [
        'How does CSP help mitigate XSS?',
        'How do you prevent CSRF in a stateless API?',
        'What is the OWASP Top 10 and which entries worry you most?',
      ],
    },
    {
      id: 'cs2',
      text: 'Describe how you would respond to a suspected security incident.',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['contain', 'investigate', 'communicate', 'forensic', 'recover'],
      followUps: [
        'What is the first action you take?',
        'How do you preserve evidence?',
        'How do you communicate with stakeholders during the incident?',
      ],
    },
  ],
  product_manager: [
    {
      id: 'pm1',
      text: 'Walk me through how you would prioritize a backlog of 20 features.',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['impact', 'effort', 'stakeholder', 'data', 'roadmap'],
      followUps: [
        'How do you handle competing priorities from sales and engineering?',
        'What framework do you use and why?',
        'How do you handle a feature with no clear ROI?',
      ],
    },
    {
      id: 'pm2',
      text: 'Tell me about a product decision you got wrong. What happened?',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['learn', 'iterate', 'data', 'user', 'reflect'],
      followUps: [
        'How did you course-correct?',
        'What process change did you make afterwards?',
      ],
    },
  ],
  ui_ux: [
    {
      id: 'ux1',
      text: 'Walk me through your design process for a new feature.',
      category: 'technical',
      difficulty: 'easy',
      expectedKeywords: ['research', 'wireframe', 'prototype', 'test', 'iterate'],
      followUps: [
        'How do you decide what to research vs build directly?',
        'How do you incorporate user feedback into design?',
        'How do you handle conflicting feedback from users?',
      ],
    },
    {
      id: 'ux2',
      text: 'How do you measure the success of a design change?',
      category: 'technical',
      difficulty: 'medium',
      expectedKeywords: ['metric', 'a/b', 'usability', 'conversion', 'satisfaction'],
      followUps: [
        'What metrics would you track first?',
        'How do you avoid vanity metrics?',
        'How do you isolate the impact of a design change?',
      ],
    },
  ],
  generic: [
    {
      id: 'g1',
      text: 'Tell me about yourself and what you are looking for in your next role.',
      category: 'hr',
      difficulty: 'easy',
      expectedKeywords: ['experience', 'goal', 'strength', 'motivation'],
      followUps: [
        'What is the project you are most proud of?',
        'Why are you looking to change roles?',
        'What does your ideal team look like?',
      ],
    },
    {
      id: 'g2',
      text: 'Describe a challenging problem you solved recently.',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['problem', 'approach', 'solution', 'impact', 'learn'],
      followUps: [
        'What made it challenging?',
        'What would you do differently?',
        'How did you measure success?',
      ],
    },
    {
      id: 'g3',
      text: 'Where do you see yourself in three years?',
      category: 'hr',
      difficulty: 'easy',
      expectedKeywords: ['growth', 'goal', 'learn', 'lead', 'impact'],
      followUps: [
        'What skills do you want to develop to get there?',
        'How does this role fit that path?',
      ],
    },
    {
      id: 'g4',
      text: 'Tell me about a time you failed. What did you learn?',
      category: 'behavioral',
      difficulty: 'easy',
      expectedKeywords: ['fail', 'learn', 'reflect', 'change', 'honest'],
      followUps: [
        'How did you communicate the failure to others?',
        'What did you change about your approach?',
      ],
    },
  ],
  hr: [
    {
      id: 'h1',
      text: 'Tell me about yourself and your background.',
      category: 'hr',
      difficulty: 'easy',
      expectedKeywords: ['experience', 'background', 'strength', 'goal'],
      followUps: [
        'What are your key strengths?',
        'What is an area you are actively improving?',
        'Why are you interested in this role?',
      ],
    },
    {
      id: 'h2',
      text: 'Why do you want to leave your current role?',
      category: 'hr',
      difficulty: 'easy',
      expectedKeywords: ['growth', 'opportunity', 'learn', 'challenge'],
      followUps: [
        'What are you looking for that is missing today?',
        'How would your current team describe you?',
      ],
    },
    {
      id: 'h3',
      text: 'Describe your ideal work environment.',
      category: 'hr',
      difficulty: 'easy',
      expectedKeywords: ['culture', 'collaboration', 'autonomy', 'growth', 'value'],
      followUps: [
        'What kind of manager brings out your best work?',
        'How do you prefer to receive feedback?',
      ],
    },
    {
      id: 'h4',
      text: 'Tell me about a conflict you had with a teammate and how you resolved it.',
      category: 'behavioral',
      difficulty: 'medium',
      expectedKeywords: ['listen', 'communicate', 'empathy', 'resolve', 'respect'],
      followUps: [
        'What would you do differently?',
        'How do you rebuild trust after a conflict?',
      ],
    },
    {
      id: 'h5',
      text: 'What are your salary expectations?',
      category: 'hr',
      difficulty: 'medium',
      expectedKeywords: ['research', 'range', 'value', 'negotiate', 'flexible'],
      followUps: [
        'How did you arrive at that number?',
        'Are you open to equity in lieu of base?',
      ],
    },
  ],
};

function normalizeRole(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('frontend')) return 'frontend';
  if (r.includes('backend')) return 'backend';
  if (r.includes('full')) return 'full_stack';
  if (r.includes('ai')) return 'ai_engineer';
  if (r.includes('ml') || r.includes('machine')) return 'ml_engineer';
  if (r.includes('data')) return 'data_scientist';
  if (r.includes('devops')) return 'devops';
  if (r.includes('cyber') || r.includes('security')) return 'cyber_security';
  if (r.includes('product')) return 'product_manager';
  if (r.includes('ui') || r.includes('ux') || r.includes('design')) return 'ui_ux';
  if (r.includes('software') || r.includes('engineer')) return 'software_engineer';
  return 'generic';
}

interface ConversationState {
  askedQuestions: Set<string>;
  followUpDepth: number;
  currentQuestionId: string | null;
  lastAnswer: string;
  answers: { question: string; answer: string; keywords: string[] }[];
}

const state_by_interview = new Map<string, ConversationState>();

function getBankForConfig(config: InterviewConfig): QuestionTemplate[] {
  if (config.interview_type === 'hr') return QUESTION_BANK.hr;
  const roleKey = normalizeRole(config.role);
  let bank = [...(QUESTION_BANK[roleKey] ?? [])];
  if (config.interview_type === 'mixed') {
    bank = [...bank, ...QUESTION_BANK.generic, ...QUESTION_BANK.hr.filter((q) => q.id === 'h4')];
  } else if (config.interview_type === 'behavioral') {
    bank = bank.filter((q) => q.category === 'behavioral');
    if (bank.length < 2) bank = [...QUESTION_BANK.generic.filter((q) => q.category === 'behavioral')];
  } else if (config.interview_type === 'technical') {
    bank = bank.filter((q) => q.category === 'technical' || q.category === 'system_design');
    if (bank.length < 2) bank = [...bank, ...QUESTION_BANK.generic.slice(0, 2)];
  } else if (config.interview_type === 'system_design') {
    bank = bank.filter((q) => q.category === 'system_design');
    if (bank.length < 2) bank = QUESTION_BANK.generic.slice(0, 2);
  } else if (config.interview_type === 'coding') {
    bank = bank.filter((q) => q.category === 'coding');
    if (bank.length === 0) bank = [{ ...QUESTION_BANK.generic[0], category: 'coding' as const }];
  }
  if (bank.length < 2) bank = [...bank, ...QUESTION_BANK.generic];
  if (config.difficulty === 'easy') bank = bank.filter((q) => q.difficulty !== 'hard');
  return bank;
}

export function getOpeningMessage(config: InterviewConfig, fullName?: string): string {
  const name = fullName ? `, ${fullName.split(' ')[0]}` : '';
  const roleText = config.role === 'Custom Role' ? 'your target role' : `a ${config.role} role`;
  const typeText =
    config.interview_type === 'mixed'
      ? 'a mix of technical, behavioral, and fit questions'
      : `a ${config.interview_type.replace('_', ' ')} interview`;
  return (
    `Hi there${name}. I'm your AI interviewer for today, and we'll be simulating ${typeText} for ${roleText}. ` +
    `I'll ask one question at a time — answer as you naturally would, and I'll dig deeper based on what you share. ` +
    `The session is timed, and I'll give you feedback at the end. Ready? Let's begin.`
  );
}

export function getNextQuestion(
  interviewId: string,
  config: InterviewConfig,
  history: InterviewMessage[]
): string {
  let state = state_by_interview.get(interviewId);
  if (!state) {
    state = { askedQuestions: new Set(), followUpDepth: 0, currentQuestionId: null, lastAnswer: '', answers: [] };
    state_by_interview.set(interviewId, state);
  }

  const bank = getBankForConfig(config);
  const userTurns = history.filter((m) => m.role === 'user');

  const lastUser = userTurns[userTurns.length - 1]?.content ?? '';

  if (state.currentQuestionId) {
    const currentQ = bank.find((q) => q.id === state!.currentQuestionId);
    if (currentQ) {
      const analysis = analyzeAnswer(lastUser, currentQ.expectedKeywords ?? []);
      state.answers.push({
        question: currentQ.text,
        answer: lastUser,
        keywords: analysis.matchedKeywords,
      });
      state.lastAnswer = lastUser;
      state.followUpDepth += 1;

      if (state.followUpDepth <= currentQ.followUps.length) {
        const fu = currentQ.followUps[state.followUpDepth - 1];
        if (analysis.isVague) {
          return `${challengePhrase()} ${fu}`;
        }
        return fu;
      }
      state.followUpDepth = 0;
      state.currentQuestionId = null;
    }
  }

  const remaining = bank.filter((q) => !state!.askedQuestions.has(q.id));
  if (remaining.length === 0) {
    state.askedQuestions.clear();
    const fresh = bank.filter((q) => !state!.askedQuestions.has(q.id));
    if (fresh.length === 0) {
      return "Let's circle back. Is there anything you'd like me to dig into further about your experience?";
    }
    const next = fresh[Math.floor(Math.random() * fresh.length)];
    state.askedQuestions.add(next.id);
    state.currentQuestionId = next.id;
    state.followUpDepth = 0;
    return next.text;
  }

  const next = remaining[Math.floor(Math.random() * remaining.length)];
  state.askedQuestions.add(next.id);
  state.currentQuestionId = next.id;
  state.followUpDepth = 0;
  return next.text;
}

function challengePhrase(): string {
  const phrases = [
    "I want to make sure I understand — could you go a bit deeper? ",
    "That's a start, but can you be more specific? ",
    "Tell me more about that. ",
    "Interesting — can you expand on that? ",
    "I'd like to hear more detail. ",
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

interface AnswerAnalysis {
  matchedKeywords: string[];
  isVague: boolean;
  wordCount: number;
  hasFillers: boolean;
  fillers: string[];
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];

function analyzeAnswer(answer: string, expectedKeywords: string[]): AnswerAnalysis {
  const lower = answer.toLowerCase();
  const matchedKeywords = expectedKeywords.filter((k) => lower.includes(k.toLowerCase()));
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const lowerForFillers = ` ${lower} `;
  const fillers = FILLER_WORDS.filter((f) => lowerForFillers.includes(` ${f} `));
  const isVague = wordCount < 15 || (expectedKeywords.length > 0 && matchedKeywords.length === 0);
  return { matchedKeywords, isVague, wordCount, hasFillers: fillers.length > 0, fillers };
}

const POSITIVE_TRANSITIONS = [
  "Great — thank you for sharing that.",
  "That's helpful context.",
  "Got it.",
  "Thanks for the detail.",
  "Understood.",
];

export function generateReport(
  config: InterviewConfig,
  history: InterviewMessage[]
): InterviewReport {
  const userAnswers = history.filter((m) => m.role === 'user');
  const bank = getBankForConfig(config);

  const analyses = userAnswers.map((ans) => {
    const matchedQ = bank.find((q) => q.text === ans.content) ?? null;
    return {
      analysis: analyzeAnswer(ans.content, matchedQ?.expectedKeywords ?? []),
      question: '',
      answer: ans.content,
    };
  });

  const avgWordCount =
    userAnswers.length > 0
      ? analyses.reduce((s, a) => s + a.analysis.wordCount, 0) / userAnswers.length
      : 0;
  const keywordMatchRate =
    analyses.length > 0
      ? analyses.filter((a) => a.analysis.matchedKeywords.length > 0).length / analyses.length
      : 0;
  const vagueRate =
    analyses.length > 0
      ? analyses.filter((a) => a.analysis.isVague).length / analyses.length
      : 1;
  const fillerRate =
    analyses.length > 0
      ? analyses.filter((a) => a.analysis.hasFillers).length / analyses.length
      : 0;

  const techBase = config.interview_type === 'hr' ? 55 : 60;
  const technical_score = Math.round(
    Math.min(
      100,
      techBase + keywordMatchRate * 35 + (avgWordCount > 40 ? 10 : 0) + (vagueRate < 0.4 ? 5 : -5)
    )
  );

  const hrBase =
    config.interview_type === 'hr' || config.interview_type === 'behavioral' ? 60 : 50;
  const hr_score = Math.round(
    Math.min(
      100,
      hrBase +
        (avgWordCount > 50 ? 15 : avgWordCount > 25 ? 8 : 0) +
        (fillerRate < 0.3 ? 10 : -5) +
        (vagueRate < 0.4 ? 10 : -5)
    )
  );

  const communication_score = Math.round(
    Math.min(
      100,
      55 +
        (fillerRate < 0.2 ? 20 : fillerRate < 0.4 ? 10 : 0) +
        (avgWordCount > 40 ? 15 : avgWordCount > 20 ? 8 : -5) +
        (vagueRate < 0.5 ? 10 : -5)
    )
  );

  const confidence_score = Math.round(
    Math.min(
      100,
      60 +
        (avgWordCount > 50 ? 15 : avgWordCount > 25 ? 8 : 0) +
        (fillerRate < 0.25 ? 15 : -5) +
        (vagueRate < 0.4 ? 10 : -5)
    )
  );

  const overall_score = Math.round(
    technical_score * 0.4 +
      hr_score * 0.2 +
      communication_score * 0.25 +
      confidence_score * 0.15
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (keywordMatchRate > 0.5) strengths.push('Strong technical vocabulary — you used core terms correctly');
  if (avgWordCount > 40) strengths.push('Detailed answers with good depth');
  if (fillerRate < 0.3) strengths.push('Clear speech with minimal filler words');
  if (vagueRate < 0.4) strengths.push('Specific and concrete examples');
  if (communication_score > 75) strengths.push('Effective communication');
  if (confidence_score > 75) strengths.push('Confident delivery');

  if (vagueRate > 0.5) weaknesses.push('Several answers were too vague — add concrete details');
  if (avgWordCount < 25) weaknesses.push('Answers were brief — expand on your reasoning');
  if (fillerRate > 0.4) weaknesses.push('Frequent filler words reduce clarity');
  if (keywordMatchRate < 0.3) weaknesses.push('Missing key technical concepts in answers');
  if (technical_score < 70) weaknesses.push('Technical depth needs improvement');
  if (hr_score < 70) weaknesses.push('Behavioral responses could be more structured');

  if (strengths.length === 0) strengths.push('Willingness to engage with the interview');
  if (weaknesses.length === 0) weaknesses.push('Time management — practice speaking concisely');

  const missedConcepts = bank
    .filter((q) => {
      const matched = analyses.some((a) => a.analysis.matchedKeywords.length > 0 && q.expectedKeywords?.some((k) => a.analysis.matchedKeywords.includes(k)));
      return !matched && q.expectedKeywords;
    })
    .flatMap((q) => q.expectedKeywords ?? [])
    .slice(0, 6);

  const incorrect_answers = analyses
    .filter((a) => a.analysis.isVague && a.analysis.matchedKeywords.length === 0)
    .slice(0, 3)
    .map((a) => ({
      question: a.question || 'A question during the interview',
      answer: a.answer,
      suggested:
        'Structure your answer with the STAR method: Situation, Task, Action, Result. Be specific about your role and impact.',
    }));

  const improvement_roadmap = [
    {
      week: 1,
      goals: weaknesses.slice(0, 2).map((w) => `Address: ${w.toLowerCase()}`),
    },
    {
      week: 2,
      goals: ['Practice 3 mock interviews', 'Review fundamentals for ' + config.role],
    },
    {
      week: 3,
      goals: ['Deep-dive into missed concepts', 'Practice behavioral answers with STAR method'],
    },
    {
      week: 4,
      goals: ['Mock interview with a peer', 'Refine answers for clarity and depth'],
    },
  ];

  const learning_resources = [
    { title: 'System Design Primer', type: 'Course', url: 'https://github.com/donnemartin/system-design-primer' },
    { title: 'LeetCode Top 150', type: 'Practice', url: 'https://leetcode.com/studyplan/top-interview-150/' },
    { title: 'STAR Method for Behavioral Interviews', type: 'Guide', url: 'https://www.themuse.com/advice/star-interview-method' },
    { title: 'Frontend System Design', type: 'Course', url: 'https://www.frontendinterviewhandbook.com/' },
  ];

  const hiring_chance = Math.max(10, Math.min(95, overall_score - 5));
  const company_readiness =
    overall_score >= 85
      ? 'Ready for FAANG-tier interviews'
      : overall_score >= 70
      ? 'Ready for mid-tier tech companies'
      : overall_score >= 55
      ? 'Ready for startup interviews — keep practicing for top-tier'
      : 'Needs significant improvement before on-site interviews';

  const summary = `You completed an interview for a ${config.role} position at ${config.difficulty} difficulty. ` +
    `Your overall score of ${overall_score}/100 reflects ${overall_score >= 75 ? 'strong' : overall_score >= 60 ? 'solid' : 'developing'} performance across technical depth, communication, and confidence. ` +
    `${strengths.length > 0 ? `Key strengths: ${strengths[0].toLowerCase()}. ` : ''}` +
    `${weaknesses.length > 0 ? `Focus next on: ${weaknesses[0].toLowerCase()}.` : ''}`;

  return {
    overall_score,
    technical_score,
    hr_score,
    communication_score,
    confidence_score,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    missed_concepts: missedConcepts.length > 0 ? missedConcepts : ['Practice articulating trade-offs', 'Review core data structures'],
    incorrect_answers: incorrect_answers.length > 0 ? incorrect_answers : [],
    improvement_roadmap,
    learning_resources,
    hiring_chance,
    company_readiness,
    summary,
  };
}

export function getClosingMessage(config: InterviewConfig, fullName?: string): string {
  const name = fullName ? `, ${fullName.split(' ')[0]}` : '';
  return (
    `Thank you${name} — that concludes our interview. ` +
    `I appreciate you taking the time to walk through your experience and thinking. ` +
    `I've compiled a detailed feedback report covering your technical depth, communication, and confidence. ` +
    `Take a moment to review it — the insights are designed to help you sharpen your next real interview.`
  );
}

export function getPositiveTransition(): string {
  return POSITIVE_TRANSITIONS[Math.floor(Math.random() * POSITIVE_TRANSITIONS.length)];
}

export function clearInterviewState(interviewId: string) {
  state_by_interview.delete(interviewId);
}
