import { useLayoutEffect, useRef, useState } from 'react';

type AdaptiveNumberProps = {
  value: number;
  mode: 'banner' | 'cell';
  className?: string;
};

export function AdaptiveNumber({ value, mode, className }: AdaptiveNumberProps) {
  const text = String(value);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const fitScaleRef = useRef(1);

  fitScaleRef.current = fitScale;

  useLayoutEffect(() => {
    if (mode !== 'cell') {
      return undefined;
    }

    const wrapper = wrapperRef.current;
    const line = lineRef.current;

    if (!wrapper || !line) {
      return undefined;
    }

    const updateScale = () => {
      const availableWidth = wrapper.getBoundingClientRect().width;
      const contentWidth = line.getBoundingClientRect().width;
      const currentScale = fitScaleRef.current;

      if (availableWidth <= 0 || contentWidth <= 0) {
        setFitScale(1);
        return;
      }

      const baseContentWidth = currentScale > 0 ? contentWidth / currentScale : contentWidth;
      const nextScale = Math.min(1, Number((availableWidth / baseContentWidth).toFixed(3)));
      setFitScale((currentScale) => (currentScale === nextScale ? currentScale : nextScale));
    };

    updateScale();

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            updateScale();
          });

    resizeObserver?.observe(wrapper);
    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [mode, text]);

  return (
    <span
      ref={wrapperRef}
      className={['adaptive-number', `adaptive-number--${mode}`, className].filter(Boolean).join(' ')}
      style={mode === 'cell' ? { fontSize: `${fitScale}em` } : undefined}
    >
      <span ref={lineRef} className="adaptive-number__line">
        {renderFormattedLine(text)}
      </span>
    </span>
  );
}

function renderFormattedLine(text: string) {
  const { sign, groups } = groupDigits(text);

  if (groups.length === 1) {
    return text;
  }

  return [
    sign ? (
      <span key="sign" className="adaptive-number__sign">
        {sign}
      </span>
    ) : null,
    ...groups.flatMap((group, index) => [
      <span key={`${group}-${index}`} className="adaptive-number__group">
        {group}
      </span>,
      index < groups.length - 1 ? (
        <span
          key={`separator-${group}-${index}`}
          aria-hidden="true"
          className="adaptive-number__separator"
        >
          {' '}
        </span>
      ) : null,
    ]),
  ];
}

function groupDigits(text: string) {
  const sign = text.startsWith('-') ? '-' : '';
  const digits = sign ? text.slice(1) : text;

  if (digits.length < 4) {
    return { sign, groups: [digits] };
  }

  const groups: string[] = [];
  let index = digits.length;

  while (index > 0) {
    const nextIndex = Math.max(0, index - 3);
    groups.unshift(digits.slice(nextIndex, index));
    index = nextIndex;
  }

  return { sign, groups };
}
