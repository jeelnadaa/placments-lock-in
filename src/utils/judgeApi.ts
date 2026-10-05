import { RunResponse, SubmitResponse } from '../types';

export async function runJudgeCases(params: {
  problemId: number;
  code: string;
  cases: { inputs: Record<string, unknown>; expected?: unknown }[];
}): Promise<RunResponse> {
  const res = await fetch('/api/judge/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const parsed = JSON.parse(errorText);
      throw new Error(parsed.error || `Judge run failed (${res.status})`);
    } catch {
      throw new Error(`Judge run failed: ${errorText}`);
    }
  }

  return res.json();
}

export async function submitJudgeSolution(params: {
  problemId: number;
  code: string;
}): Promise<SubmitResponse> {
  const res = await fetch('/api/judge/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const parsed = JSON.parse(errorText);
      throw new Error(parsed.error || `Judge submit failed (${res.status})`);
    } catch {
      throw new Error(`Judge submit failed: ${errorText}`);
    }
  }

  return res.json();
}
