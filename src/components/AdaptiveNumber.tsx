import type { MeasureText } from './numberLayout';

type AdaptiveNumberProps = {
  value: number;
  mode: 'banner' | 'cell';
  className?: string;
  maxWidth?: number;
  measure?: MeasureText;
};

export function AdaptiveNumber({
  value,
  mode,
  className,
  maxWidth: _maxWidth,
  measure: _measure,
}: AdaptiveNumberProps) {
  const text = String(value);

  return (
    <span className={['adaptive-number', `adaptive-number--${mode}`, className].filter(Boolean).join(' ')}>
      <span className="adaptive-number__line">{renderFormattedLine(text)}</span>
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
