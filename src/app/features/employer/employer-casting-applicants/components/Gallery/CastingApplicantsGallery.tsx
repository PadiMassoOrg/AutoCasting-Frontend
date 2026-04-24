import { useEffect, useRef, useState } from 'react';
import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';
import CastingApplicantGalleryCard from '../Card/CastingApplicantGalleryCard';

type Props = {
  data: EmployerCastingApplicantCardResponse[];
};

const GRID_GAP_PX = 16;
const MIN_CARD_WIDTH_PX = 260;
const MIN_COLS = 3;
const MAX_COLS = 4;

const CastingApplicantsGallery = ({ data }: Props) => {
  const cardsGridRef = useRef<HTMLElement>(null);
  const resizeRafRef = useRef<number | null>(null);
  const [gridCols, setGridCols] = useState(MIN_COLS);

  useEffect(() => {
    const gridEl = cardsGridRef.current;
    if (!gridEl) return;

    const computeCols = (width: number) => {
      const estimated = Math.floor((width + GRID_GAP_PX) / (MIN_CARD_WIDTH_PX + GRID_GAP_PX));
      return Math.max(MIN_COLS, Math.min(MAX_COLS, estimated));
    };

    const updateCols = (width: number) => {
      const nextCols = computeCols(width);
      setGridCols((prev) => (prev === nextCols ? prev : nextCols));
    };

    updateCols(gridEl.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (resizeRafRef.current !== null) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        updateCols(entry.contentRect.width);
        resizeRafRef.current = null;
      });
    });

    observer.observe(gridEl);
    return () => {
      observer.disconnect();
      if (resizeRafRef.current !== null) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = null;
    };
  }, []);

  return (
    <article
      ref={cardsGridRef}
      className="grid gap-4 items-stretch w-full"
      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
    >
      {data.map((applicant) => (
        <div key={applicant.applicationId} className="w-full">
          <CastingApplicantGalleryCard data={applicant} />
        </div>
      ))}
    </article>
  );
};

export default CastingApplicantsGallery;
