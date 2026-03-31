import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('keeps the wider-screen three-column status rule scoped away from the mobile strip', () => {
  const styles = readFileSync(resolve(import.meta.dirname, '../styles.css'), 'utf8');

  expect(styles).toContain('@media (min-width: 30rem)');
  expect(styles).toContain('.status-strip:not(.status-strip--mobile)');
});

it('uses one shared neutral tone for inactive interactive elements', () => {
  const styles = readFileSync(resolve(import.meta.dirname, '../styles.css'), 'utf8');

  expect(styles).toContain('--interactive-neutral-bg: #f0e6d8;');
  expect(styles).toContain('.chip {');
  expect(styles).toContain('background: var(--interactive-neutral-bg);');
  expect(styles).toContain('.target-entry-row button {');
  expect(styles).toContain('.board-cell--neutral {');
});
