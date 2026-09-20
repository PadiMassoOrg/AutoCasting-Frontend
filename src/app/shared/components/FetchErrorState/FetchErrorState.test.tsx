import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FetchErrorState from './FetchErrorState';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  Label: ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <label className={className}>{children}</label>
  ),
}));

describe('FetchErrorState', () => {
  it('renders the generic server-error message', () => {
    render(<FetchErrorState />);

    expect(screen.getByText('state.server_err')).toBeTruthy();
  });

  it('is always rendered as block, regardless of className, since Label is a native <label> (inline by default)', () => {
    render(<FetchErrorState />);

    expect(screen.getByText('state.server_err').className).toContain('block');
  });

  it('falls back to the default spacing (py-10 text-center) when no className is passed', () => {
    render(<FetchErrorState />);

    const el = screen.getByText('state.server_err');
    expect(el.className).toContain('py-10');
    expect(el.className).toContain('text-center');
  });

  it('uses the caller-provided className for spacing instead of the default when passed', () => {
    render(<FetchErrorState className="py-18 text-center" />);

    const el = screen.getByText('state.server_err');
    expect(el.className).toContain('py-18');
    expect(el.className).not.toContain('py-10');
  });
});
