import { useEffect, useRef, useState } from 'react';
import { playCellStateNote, primeCellStateAudio } from '../audio/cellNotes';
import { getCommittedCellStateNote } from '../audio/playbackObserver';
import { computeCurrentSum, getBoardRangeLabel, randomTarget } from '../game/board';
import { useBalancedTernaryGame } from '../game/useBalancedTernaryGame';
import type { GameState } from '../game/state';
import type { BoardSize } from '../game/types';
import { BoardGrid } from './BoardGrid';
import { ControlPanel } from './ControlPanel';
import { StatusStrip } from './StatusStrip';

const CELEBRATION_FLASH_MS = 500;

export function GameView({
  initialState,
  layout = 'desktop',
}: {
  initialState?: GameState;
  layout?: 'desktop' | 'mobile';
}) {
  const game = useBalancedTernaryGame(initialState);
  const currentSum = computeCurrentSum(game.state.cells);
  const blocked = game.state.status === 'celebrating';
  const [flashExpired, setFlashExpired] = useState(false);
  const flashActive = blocked && !flashExpired;
  const previousStateRef = useRef(game.state);
  const pendingTapCountRef = useRef(0);

  useEffect(() => {
    if (!blocked) {
      setFlashExpired(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFlashExpired(true);
    }, CELEBRATION_FLASH_MS);

    return () => window.clearTimeout(timeoutId);
  }, [blocked]);

  useEffect(() => {
    const committedNote = getCommittedCellStateNote(previousStateRef.current, game.state);

    if (committedNote && pendingTapCountRef.current > 0) {
      pendingTapCountRef.current -= 1;
      playCellStateNote(committedNote.cellIndex, committedNote.state);
    }

    previousStateRef.current = game.state;
  }, [game.state]);

  const handleSelectBoardSize = (boardSize: BoardSize) => {
    if (game.state.playMode === 'random') {
      game.selectBoardSize(boardSize, randomTarget(boardSize));
      return;
    }

    game.selectBoardSize(boardSize, 1);
  };

  const handleCellTap = (index: number) => {
    pendingTapCountRef.current += 1;
    void primeCellStateAudio();
    game.tapCell(index);
  };

  return (
    <main className={`app-shell app-shell--${layout}`}>
      <h1 className="app-title">Balanced Ternary Puzzle</h1>
      <div className={`game-layout game-layout--${layout}`}>
        <StatusStrip
          layout={layout}
          boardSize={game.state.boardSize}
          target={game.state.target}
          currentSum={currentSum}
          flash={flashActive}
        />
        <ControlPanel
          layout={layout}
          boardSize={game.state.boardSize}
          playMode={game.state.playMode}
          draftTarget={game.state.draftTarget}
          placeholder={getBoardRangeLabel(game.state.boardSize)}
          blocked={blocked}
          onSelectBoardSize={handleSelectBoardSize}
          onEnableRandomMode={() =>
            game.enableRandomMode({
              2: randomTarget(2),
              3: randomTarget(3),
              4: randomTarget(4),
            })
          }
          onDisableRandomMode={game.disableRandomMode}
          onDraftChange={game.changeDraftTarget}
          onSubmitTarget={game.submitTarget}
        />
        <div className={`board-stage board-stage--${layout}`}>
          <BoardGrid
            boardSize={game.state.boardSize}
            cells={game.state.cells}
            blocked={blocked}
            flash={flashActive}
            onCellTap={handleCellTap}
          />
        </div>
      </div>
    </main>
  );
}
