import { useLayoutEffect, useRef, useState } from 'react';
import { chooseBestTwoLineSplit, type MeasureText } from './numberLayout';

type AdaptiveNumberProps = {
  value: number;
  mode: 'banner' | 'cell';
  className?: string;
  maxWidth?: number;
  measure?: MeasureText;
};

const FALLBACK_FONT_SIZE = 16;

export function AdaptiveNumber({
  value,
  mode,
  className,
  maxWidth,
  measure,
}: AdaptiveNumberProps) {
  const text = String(value);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const canvasMeasureRef = useRef<MeasureText | null>(null);
  const isCellMode = mode === 'cell';
  const [availableWidth, setAvailableWidth] = useState<number | null>(
    isCellMode ? maxWidth ?? null : null,
  );

  if (isCellMode && canvasMeasureRef.current === null) {
    canvasMeasureRef.current = createCanvasMeasure(() => elementRef.current);
  }

  const measureText = measure ?? canvasMeasureRef.current;

  useLayoutEffect(() => {
    if (!isCellMode) {
      return undefined;
    }

    if (typeof maxWidth === 'number') {
      setAvailableWidth((currentWidth) => (currentWidth === maxWidth ? currentWidth : maxWidth));
      return undefined;
    }

    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const updateWidth = () => {
      const nextWidth = element.getBoundingClientRect().width;
      setAvailableWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isCellMode, maxWidth, text]);

  const split =
    isCellMode && measureText && availableWidth !== null
      ? chooseBestTwoLineSplit(text, measureText, availableWidth)
      : null;

  return (
    <span
      ref={elementRef}
      className={['adaptive-number', `adaptive-number--${mode}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {split === null ? (
        renderFormattedLine(text, isCellMode)
      ) : (
        <>
          <span className="adaptive-number__line">{renderFormattedLine(split[0], true)}</span>
          <span
            aria-hidden="true"
            className="adaptive-number__line-break"
            data-testid="adaptive-number-line-break"
          />
          <span className="adaptive-number__line">{renderFormattedLine(split[1], true)}</span>
        </>
      )}
    </span>
  );
}

function renderFormattedLine(text: string, grouped: boolean) {
  if (!grouped) {
    return text;
  }

  const groups = groupDigits(text);

  if (groups.length === 1) {
    return text;
  }

  return groups.map((group, index) => (
    <span key={`${group}-${index}`} className="adaptive-number__group">
      {group}
    </span>
  ));
}

function groupDigits(text: string) {
  if (text.length < 5) {
    return [text];
  }

  const groups: string[] = [];
  let index = text.length;

  while (index > 0) {
    const nextIndex = Math.max(0, index - 3);
    groups.unshift(text.slice(nextIndex, index));
    index = nextIndex;
  }

  return groups;
}

function createCanvasMeasure(getElement: () => HTMLElement | null): MeasureText {
  let cachedContext: CanvasRenderingContext2D | null = null;

  return (text) => {
    if (typeof document === 'undefined') {
      return text.length * FALLBACK_FONT_SIZE;
    }

    if (cachedContext === null) {
      cachedContext = document.createElement('canvas').getContext('2d');
    }

    const context = cachedContext;
    if (!context) {
      return text.length * FALLBACK_FONT_SIZE;
    }

    const element = getElement();
    const styles = element ? window.getComputedStyle(element) : null;
    const fontSize = styles ? styles.fontSize : `${FALLBACK_FONT_SIZE}px`;
    const fontFamily = styles?.fontFamily ?? 'sans-serif';
    const fontWeight = styles?.fontWeight ?? '700';
    context.font = `${fontWeight} ${fontSize} ${fontFamily}`;

    return context.measureText(text).width;
  };
}
