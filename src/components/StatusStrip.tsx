import type { BoardSize } from '../game/types';

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
    <section className="status-strip" aria-label="Game status">
      <article className="status-card">
        <span className="status-label">Target</span>
        <strong className="status-value">{target}</strong>
        <span className="status-meta">Board {boardSize}x{boardSize}</span>
      </article>
      <article className="status-card">
        <span className="status-label">Current Sum</span>
        <strong className="status-value">{currentSum}</strong>
      </article>
    </section>
  );
}
