import type { BoardSize } from '../game/types';
import { AdaptiveNumber } from './AdaptiveNumber';

export function StatusStrip({
  boardSize,
  target,
  currentSum,
  flash,
}: {
  boardSize: BoardSize;
  target: number;
  currentSum: number;
  flash: boolean;
}) {
  return (
    <section className="status-strip" aria-label="Game status">
      <article className={flash ? 'status-card status-card--flash' : 'status-card'}>
        <span className="status-label">Target</span>
        <strong className="status-value">
          <AdaptiveNumber value={target} mode="banner" />
        </strong>
        <span className="status-meta">Board {boardSize}x{boardSize}</span>
      </article>
      <article className={flash ? 'status-card status-card--flash' : 'status-card'}>
        <span className="status-label">Current Sum</span>
        <strong className="status-value">
          <AdaptiveNumber value={currentSum} mode="banner" />
        </strong>
      </article>
    </section>
  );
}
