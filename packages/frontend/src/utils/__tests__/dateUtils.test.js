import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-03-20') });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true for a date before today', () => {
    expect(isOverdue('2026-03-19')).toBe(true);
  });

  it('returns false for today\'s date', () => {
    expect(isOverdue('2026-03-20')).toBe(false);
  });

  it('returns false for a future date', () => {
    expect(isOverdue('2026-03-21')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isOverdue(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isOverdue(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isOverdue('')).toBe(false);
  });
});
