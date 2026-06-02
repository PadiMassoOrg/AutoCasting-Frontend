import { ChevronUpDown } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ExpandableTextProps = {
  text: string;
  maxChars?: number;
  className?: string;
};

export default function ExpandableText({
  text,
  maxChars = 300,
  className = 'text-sm whitespace-pre-wrap',
}: ExpandableTextProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const normalizedText = text.trim();
  const shouldTruncate = normalizedText.length > maxChars;
  const visibleText = useMemo(() => {
    if (!shouldTruncate || open) return normalizedText;
    return `${normalizedText.slice(0, maxChars).trimEnd()}...`;
  }, [maxChars, normalizedText, open, shouldTruncate]);

  return (
    <div className="flex flex-col gap-2">
      <p className={className}>{visibleText}</p>
      {shouldTruncate ? (
        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-0.5 self-start text-sm font-semibold text-black"
          onClick={() => setOpen((current) => !current)}
        >
          {t(open ? 'general.show_less' : 'general.show_more')}
          <ChevronUpDown open={open} sizePx={18} />
        </button>
      ) : null}
    </div>
  );
}
