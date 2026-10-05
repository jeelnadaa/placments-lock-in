import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlanView } from '../components/plan/PlanView';
import { Problem, Progress } from '../types';

describe('PlanView Day Persistence & Selection', () => {
  const mockProblems: Problem[] = [
    {
      id: 1,
      title: 'Problem Day 1',
      day: 1,
      order: 1,
      topic: 'Arrays',
      difficulty: 'Easy',
      leetcodeUrl: '',
      neetcodeUrl: null,
      leetcodePremium: false,
      hints: ['hint 1'],
    },
    {
      id: 2,
      title: 'Problem Day 7',
      day: 7,
      order: 1,
      topic: 'Trees',
      difficulty: 'Medium',
      leetcodeUrl: '',
      neetcodeUrl: null,
      leetcodePremium: false,
      hints: ['hint 1'],
    },
  ];

  const mockProgressMap = new Map<number, Progress>();

  beforeEach(() => {
    localStorage.clear();
    // jsdom might not have scrollIntoView implemented by default
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders with selectedDay when provided (e.g. Day 7)', () => {
    const onSelectDay = vi.fn();
    render(
      <PlanView
        problems={mockProblems}
        progressMap={mockProgressMap}
        selectedDay={7}
        onSelectDay={onSelectDay}
        onOpenProblem={vi.fn()}
        onUpdateProgress={vi.fn()}
      />
    );

    // Should display Day 7 header and Day 7 problems
    expect(screen.getByText('Day 7 Problems')).toBeTruthy();
    expect(screen.getByText(/Problem Day 7/)).toBeTruthy();
    expect(screen.queryByText(/Problem Day 1/)).toBeNull();
  });

  it('triggers onSelectDay callback when user selects a different day', () => {
    const onSelectDay = vi.fn();
    render(
      <PlanView
        problems={mockProblems}
        progressMap={mockProgressMap}
        selectedDay={1}
        onSelectDay={onSelectDay}
        onOpenProblem={vi.fn()}
        onUpdateProgress={vi.fn()}
      />
    );

    expect(screen.getByText('Day 1 Problems')).toBeTruthy();

    // Click Day 7 button in the Day Selector tabs
    const day7Btn = screen.getByRole('button', { name: /Day 7/i });
    fireEvent.click(day7Btn);

    expect(onSelectDay).toHaveBeenCalledWith(7);
    expect(screen.getByText('Day 7 Problems')).toBeTruthy();
  });

  it('updates active day when selectedDay prop updates', () => {
    const onSelectDay = vi.fn();
    const { rerender } = render(
      <PlanView
        problems={mockProblems}
        progressMap={mockProgressMap}
        selectedDay={1}
        onSelectDay={onSelectDay}
        onOpenProblem={vi.fn()}
        onUpdateProgress={vi.fn()}
      />
    );

    expect(screen.getByText('Day 1 Problems')).toBeTruthy();

    rerender(
      <PlanView
        problems={mockProblems}
        progressMap={mockProgressMap}
        selectedDay={7}
        onSelectDay={onSelectDay}
        onOpenProblem={vi.fn()}
        onUpdateProgress={vi.fn()}
      />
    );

    expect(screen.getByText('Day 7 Problems')).toBeTruthy();
  });
});
