export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface InterviewConfig {
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  experience: 'fresher' | '1_year' | '2_years' | '5_plus_years';
  interview_type: 'hr' | 'technical' | 'behavioral' | 'system_design' | 'coding' | 'mixed';
  duration_minutes: 10 | 20 | 30 | 45 | 60;
  resume_id?: string | null;
}

export interface InterviewMessage {
  id?: string;
  interview_id?: string;
  role: 'ai' | 'user';
  content: string;
  created_at?: string;
}

export interface InterviewReport {
  overall_score: number;
  technical_score: number;
  hr_score: number;
  communication_score: number;
  confidence_score: number;
  strengths: string[];
  weaknesses: string[];
  missed_concepts: string[];
  incorrect_answers: { question: string; answer: string; suggested: string }[];
  improvement_roadmap: { week: number; goals: string[] }[];
  learning_resources: { title: string; type: string; url?: string }[];
  hiring_chance: number;
  company_readiness: string;
  summary: string;
}

export interface Interview {
  id: string;
  user_id: string;
  resume_id: string | null;
  role: string;
  difficulty: string;
  experience: string;
  interview_type: string;
  duration_minutes: number;
  status: string;
  overall_score: number | null;
  technical_score: number | null;
  hr_score: number | null;
  communication_score: number | null;
  confidence_score: number | null;
  report: InterviewReport | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
}

export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'ML Engineer',
  'Data Scientist',
  'Software Engineer',
  'DevOps Engineer',
  'Cyber Security Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Custom Role',
] as const;

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', desc: 'Beginner-friendly questions' },
  { value: 'medium', label: 'Medium', desc: 'Realistic interview pace' },
  { value: 'hard', label: 'Hard', desc: 'Senior-level depth' },
] as const;

export const EXPERIENCES = [
  { value: 'fresher', label: 'Fresher' },
  { value: '1_year', label: '1 Year' },
  { value: '2_years', label: '2 Years' },
  { value: '5_plus_years', label: '5+ Years' },
] as const;

export const INTERVIEW_TYPES = [
  { value: 'hr', label: 'HR', icon: 'Users' },
  { value: 'technical', label: 'Technical', icon: 'Code' },
  { value: 'behavioral', label: 'Behavioral', icon: 'Brain' },
  { value: 'system_design', label: 'System Design', icon: 'Network' },
  { value: 'coding', label: 'Coding', icon: 'Terminal' },
  { value: 'mixed', label: 'Mixed', icon: 'Layers' },
] as const;

export const DURATIONS = [10, 20, 30, 45, 60] as const;
