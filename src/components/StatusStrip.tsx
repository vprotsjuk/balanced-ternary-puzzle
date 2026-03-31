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
  const difference = target - currentSum;
  const differenceTone = difference >= 0 ? 'status-card--positive' : 'status-card--negative';
  const flashClassName = flash ? ' status-card--flash' : '';

  return (
    <section className="status-strip" aria-label="Game status">
      <article className={`status-card${flashClassName}`}>
        <span className="status-label">Target</span>
        <strong className="status-value">
          <AdaptiveNumber value={target} mode="banner" />
        </strong>
        <span className="status-meta">Board {boardSize}x{boardSize}</span>
      </article>
      <article className={`status-card${flashClassName}`}>
        <span className="status-label">Current Sum</span>
        <strong className="status-value">
          <AdaptiveNumber value={currentSum} mode="banner" />
        </strong>
      </article>
      <article className={`status-card ${differenceTone}${flashClassName}`}>
        <span className="status-label">Difference</span>
        <strong className="status-value">
          <AdaptiveNumber value={difference} mode="banner" />
        </strong>
      </article>
    </section>
  );
}
