import type { BoardSize } from '../game/types';
import { AdaptiveNumber } from './AdaptiveNumber';

export function StatusStrip({
  boardSize,
  target,
  currentSum,
}: {
  boardSize: BoardSize;
  target: number;
  currentSum: number;
}) {
  return (
    <section className="status-strip status-strip--compact" aria-label="Game status">
      <article className="status-card">
        <span className="status-label">Target</span>
        <strong className="status-value">
          <AdaptiveNumber value={target} mode="banner" />
        </strong>
        <span className="status-meta">Board {boardSize}x{boardSize}</span>
      </article>
      <article className="status-card">
        <span className="status-label">Current Sum</span>
        <strong className="status-value">
          <AdaptiveNumber value={currentSum} mode="banner" />
        </strong>
      </article>
    </section>
  );
}
