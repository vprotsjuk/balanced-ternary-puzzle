import { useEffect, useRef, useState } from 'react';
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
  const measureRef = useRef<MeasureText | null>(null);
  const [availableWidth, setAvailableWidth] = useState(maxWidth ?? 0);

  if (measureRef.current === null) {
    measureRef.current = createCanvasMeasure(() => elementRef.current);
  }

  const measureText = measure ?? measureRef.current;

  useEffect(() => {
    if (typeof maxWidth === 'number') {
      setAvailableWidth(maxWidth);
      return undefined;
    }

    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const updateWidth = () => {
      setAvailableWidth(element.getBoundingClientRect().width);
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
  }, [maxWidth, text]);

  const split =
    mode === 'cell' ? chooseBestTwoLineSplit(text, measureText, availableWidth) : null;

  return (
    <span
      ref={elementRef}
      className={['adaptive-number', `adaptive-number--${mode}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {split === null ? (
        text
      ) : (
        <>
          <span className="adaptive-number__line">{split[0]}</span>
          <span
            aria-hidden="true"
            className="adaptive-number__line-break"
            data-testid="adaptive-number-line-break"
          />
          <span className="adaptive-number__line">{split[1]}</span>
        </>
      )}
    </span>
  );
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
