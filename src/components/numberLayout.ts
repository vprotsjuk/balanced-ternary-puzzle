export type MeasureText = (text: string) => number;

export function chooseBestTwoLineSplit(
  value: number | string,
  measure: MeasureText,
  maxWidth: number,
): [string, string] | null {
  const text = String(value);

  if (maxWidth <= 0 || measure(text) <= maxWidth || text.length < 2) {
    return null;
  }

  let bestSplit: [string, string] | null = null;
  let bestScore: [number, number, number, number] | null = null;

  for (let index = 1; index < text.length; index += 1) {
    const firstLine = text.slice(0, index);
    const secondLine = text.slice(index);
    const firstWidth = measure(firstLine);
    const secondWidth = measure(secondLine);
    const overflow = Math.max(0, firstWidth - maxWidth) + Math.max(0, secondWidth - maxWidth);
    const longestLine = Math.max(firstWidth, secondWidth);
    const balance = Math.abs(firstWidth - secondWidth);
    const topHeavyPenalty = Math.max(0, firstWidth - secondWidth);
    const score: [number, number, number, number] = [
      overflow,
      longestLine,
      balance,
      topHeavyPenalty,
    ];

    if (bestScore === null || compareScores(score, bestScore) < 0) {
      bestSplit = [firstLine, secondLine];
      bestScore = score;
    }
  }

  return bestSplit;
}

function compareScores(
  left: [number, number, number, number],
  right: [number, number, number, number],
) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }

  return 0;
}
