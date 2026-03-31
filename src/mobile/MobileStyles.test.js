import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('keeps the wider-screen three-column status rule scoped away from the mobile strip', () => {
  const styles = readFileSync(resolve(import.meta.dirname, '../styles.css'), 'utf8');

  expect(styles).toContain('@media (min-width: 30rem)');
  expect(styles).toContain('.status-strip:not(.status-strip--mobile)');
});
