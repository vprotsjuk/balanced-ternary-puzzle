import type { BoardSize } from '../game/types';
import { AdaptiveNumber } from './AdaptiveNumber';

export function StatusStrip({
  layout = 'desktop',
  boardSize,
  target,
  currentSum,
  flash,
}: {
  layout?: 'desktop' | 'mobile';
  boardSize: BoardSize;
  target: number;
  currentSum: number;
  flash: boolean;
}) {
  const difference = target - currentSum;
  const differenceTone = difference >= 0 ? 'status-card--positive' : 'status-card--negative';
  const flashClassName = flash ? ' status-card--flash' : '';

  if (layout === 'mobile') {
    return (
      <section className="status-strip status-strip--mobile" aria-label="Game status">
        <article className={`status-card status-card--summary${flashClassName}`}>
          <div className="status-summary-row">
            <div className="status-summary-metric">
              <span className="status-label">Target</span>
              <strong className="status-value">
                <AdaptiveNumber value={target} mode="banner" />
              </strong>
            </div>
            <div className="status-summary-metric">
              <span className="status-label">Current Sum</span>
              <strong className="status-value">
                <AdaptiveNumber value={currentSum} mode="banner" />
              </strong>
            </div>
          </div>
          <span className="status-meta">Board {boardSize}x{boardSize}</span>
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
