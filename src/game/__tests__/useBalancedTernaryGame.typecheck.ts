import type { BoardSize } from '../types';
import { useBalancedTernaryGame } from '../useBalancedTernaryGame';

type GameApi = ReturnType<typeof useBalancedTernaryGame>;

declare const api: GameApi;
declare const boardSize: BoardSize;

api.selectBoardSize(boardSize, 21);
api.enableRandomMode({ 2: 11, 3: 22, 4: 33 });
api.disableRandomMode();
api.finishCelebrationRandom(21);
api.finishCelebrationSequential();

api.selectBoardSize(boardSize);
// @ts-expect-error Missing explicit random target map.
api.enableRandomMode();
// @ts-expect-error Missing explicit random target.
api.finishCelebrationRandom();
