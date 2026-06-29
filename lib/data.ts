import { supabase } from './supabase';
import type { Interview, InterviewConfig, InterviewMessage, InterviewReport, Achievement } from './types';
import { generateReport } from './interview-engine';
import { clearInterviewState } from './interview-engine';

export async function createInterview(userId: string, config: InterviewConfig): Promise<string | null> {
  const { data, error } = await supabase
    .from('interviews')
    .insert({
      user_id: userId,
      resume_id: config.resume_id ?? null,
      role: config.role,
      difficulty: config.difficulty,
      experience: config.experience,
      interview_type: config.interview_type,
      duration_minutes: config.duration_minutes,
      status: 'in_progress',
    })
    .select('id')
    .single();
  if (error || !data) return null;
  return data.id;
}

export async function addMessage(
  interviewId: string,
  role: 'ai' | 'user',
  content: string
): Promise<void> {
  await supabase.from('interview_messages').insert({
    interview_id: interviewId,
    role,
    content,
  });
}

export async function getMessages(interviewId: string): Promise<InterviewMessage[]> {
  const { data, error } = await supabase
    .from('interview_messages')
    .select('*')
    .eq('interview_id', interviewId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as InterviewMessage[];
}

export async function completeInterview(
  interviewId: string,
  config: InterviewConfig,
  history: InterviewMessage[]
): Promise<InterviewReport | null> {
  const report = generateReport(config, history);

  const { error } = await supabase
    .from('interviews')
    .update({
      status: 'completed',
      overall_score: report.overall_score,
      technical_score: report.technical_score,
      hr_score: report.hr_score,
      communication_score: report.communication_score,
      confidence_score: report.confidence_score,
      report: report as unknown as Record<string, unknown>,
      completed_at: new Date().toISOString(),
    })
    .eq('id', interviewId);

  if (error) return null;

  const { data: scores } = await supabase.from('interview_scores').insert([
    { interview_id: interviewId, category: 'technical', score: report.technical_score },
    { interview_id: interviewId, category: 'hr', score: report.hr_score },
    { interview_id: interviewId, category: 'communication', score: report.communication_score },
    { interview_id: interviewId, category: 'confidence', score: report.confidence_score },
  ]).select();
  void scores;

  await updateProfileStats(interviewId);
  await checkAchievements(interviewId);
  clearInterviewState(interviewId);

  return report;
}

async function updateProfileStats(interviewId: string): Promise<void> {
  const { data: interview } = await supabase
    .from('interviews')
    .select('user_id, overall_score')
    .eq('id', interviewId)
    .maybeSingle();
  if (!interview) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, total_interviews, avg_score, daily_streak, last_practice_date')
    .eq('id', interview.user_id)
    .maybeSingle();
  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.last_practice_date;
  let newStreak = profile.daily_streak;
  if (lastDate !== today) {
    const last = new Date(lastDate ?? today);
    const diff = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
    newStreak = diff === 1 ? profile.daily_streak + 1 : 1;
  }

  const newTotal = (profile.total_interviews ?? 0) + 1;
  const prevAvg = Number(profile.avg_score ?? 0);
  const newAvg = Math.round((prevAvg * (newTotal - 1) + Number(interview.overall_score ?? 0)) / newTotal);

  await supabase
    .from('profiles')
    .update({
      total_interviews: newTotal,
      avg_score: newAvg,
      daily_streak: newStreak,
      last_practice_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('id', interview.user_id);
}

async function checkAchievements(interviewId: string): Promise<void> {
  const { data: interview } = await supabase
    .from('interviews')
    .select('user_id, overall_score, completed_at')
    .eq('id', interviewId)
    .maybeSingle();
  if (!interview) return;

  const userId = interview.user_id;
  const { count } = await supabase
    .from('interviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');

  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_streak')
    .eq('id', userId)
    .maybeSingle();

  const toUnlock: string[] = [];
  if ((count ?? 0) >= 1) toUnlock.push('first_interview');
  if ((count ?? 0) >= 5) toUnlock.push('five_interviews');
  if ((count ?? 0) >= 10) toUnlock.push('ten_interviews');
  if ((profile?.daily_streak ?? 0) >= 3) toUnlock.push('streak_3');
  if ((profile?.daily_streak ?? 0) >= 7) toUnlock.push('streak_7');
  if ((interview.overall_score ?? 0) >= 80) toUnlock.push('high_score');
  if ((interview.overall_score ?? 0) >= 90) toUnlock.push('perfect_score');

  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) toUnlock.push('night_owl');

  for (const slug of toUnlock) {
    const { data: ach } = await supabase
      .from('achievements')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (ach) {
      await supabase.from('user_achievements').upsert(
        { user_id: userId, achievement_id: ach.id },
        { onConflict: 'user_id,achievement_id' }
      );
    }
  }
}

export async function getInterviews(userId: string): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Interview[];
}

export async function getInterview(interviewId: string): Promise<Interview | null> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', interviewId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Interview;
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data: unlocked, error: err1 } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);
  if (err1) return [];
  const { data: all, error: err2 } = await supabase
    .from('achievements')
    .select('*')
    .order('created_at', { ascending: true });
  if (err2 || !all) return [];

  const unlockMap = new Map((unlocked ?? []).map((u) => [u.achievement_id, u.unlocked_at]));
  return (all as Achievement[]).map((a) => ({
    ...a,
    unlocked_at: unlockMap.get(a.id) ?? undefined,
  }));
}
