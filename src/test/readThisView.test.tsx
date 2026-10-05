import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReadThisView } from '../components/guide/ReadThisView';

describe('ReadThisView Component', () => {
  it('renders the formatted guide by default with key sections', () => {
    const onNavigateTab = vi.fn();
    const onOpenSandbox = vi.fn();

    render(
      <ReadThisView
        onNavigateTab={onNavigateTab}
        onOpenSandbox={onOpenSandbox}
      />
    );

    // Title & subtitle
    expect(screen.getByText('How Locked-In Works')).toBeTruthy();
    expect(screen.getByText(/Zero-spoiler algorithm mastery/i)).toBeTruthy();

    // Two Ways to Practice sections
    expect(screen.getByText('Run & Judge Java Code Locally')).toBeTruthy();
    expect(screen.getByText('Solve on LeetCode or NeetCode')).toBeTruthy();

    // Quick Action buttons
    const sandboxBtn = screen.getByText('Try the Judge Sandbox (#0)');
    fireEvent.click(sandboxBtn);
    expect(onOpenSandbox).toHaveBeenCalled();

    const planBtn = screen.getByText('Start 15-Day Plan →');
    fireEvent.click(planBtn);
    expect(onNavigateTab).toHaveBeenCalledWith('plan');
  });

  it('can toggle between formatted guide and raw markdown (.md)', () => {
    render(
      <ReadThisView
        onNavigateTab={vi.fn()}
        onOpenSandbox={vi.fn()}
      />
    );

    // Click Raw Markdown (.md)
    const rawBtn = screen.getByText('Raw Markdown (.md)');
    fireEvent.click(rawBtn);

    // Check that raw markdown container with file path is visible
    expect(screen.getByText('content/READ_THIS.md')).toBeTruthy();
    expect(screen.getByText(/# ⚡ Locked-In: Blind 75 Study Plan/i)).toBeTruthy();

    // Toggle back to formatted
    const formattedBtn = screen.getByText('Formatted Guide');
    fireEvent.click(formattedBtn);
    expect(screen.getByText('How Locked-In Works')).toBeTruthy();
  });
});
