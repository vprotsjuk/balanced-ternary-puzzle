import { computeCurrentSum, getBoardRangeLabel, randomTarget } from '../game/board';
import { useBalancedTernaryGame } from '../game/useBalancedTernaryGame';
import type { GameState } from '../game/state';
import type { BoardSize } from '../game/types';
import { BoardGrid } from './BoardGrid';
import { ControlPanel } from './ControlPanel';
import { StatusStrip } from './StatusStrip';

export function GameView({ initialState }: { initialState?: GameState }) {
  const game = useBalancedTernaryGame(initialState);
  const currentSum = computeCurrentSum(game.state.cells);
  const blocked = game.state.status === 'celebrating';
  const handleSelectBoardSize = (boardSize: BoardSize) => {
    if (game.state.playMode === 'random') {
      game.selectBoardSize(boardSize, randomTarget(boardSize));
      return;
    }

    game.selectBoardSize(boardSize, 1);
  };
  const completeCelebration = () => {
    if (game.state.playMode === 'random') {
      game.finishCelebrationRandom(randomTarget(game.state.boardSize));
      return;
    }

    game.finishCelebrationSequential();
  };

  return (
    <main className="app-shell">
      <h1 className="app-title">Balanced Ternary Puzzle</h1>
      <StatusStrip
        boardSize={game.state.boardSize}
        target={game.state.target}
        currentSum={currentSum}
      />
      <ControlPanel
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
      {blocked ? (
        <button type="button" className="random-toggle" onClick={completeCelebration}>
          Continue
        </button>
      ) : null}
      <BoardGrid
        boardSize={game.state.boardSize}
        cells={game.state.cells}
        blocked={blocked}
        onCellTap={game.tapCell}
      />
    </main>
  );
}
