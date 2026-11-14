import { useEffect, useState, RefObject } from 'react';
import { ResultCardHeights } from '@/ui/components/result/ResultCard';

const HEADER_GAP_PX = 16;
const STICKY_TOP_PX = 24;
const COLLAPSE_RATIO = 0.25;

/**
 * Tracks whether the result card should collapse and stick based on scroll position.
 */
export function useStickyCollapse(
  headerRef: RefObject<HTMLElement | null>,
  cardHeights: ResultCardHeights
) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const headerRect = headerRef.current.getBoundingClientRect();
      const headerTop = headerRect.top + window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;

      const containerTop = headerTop + headerHeight + HEADER_GAP_PX;
      const { expanded, collapsed } = cardHeights;

      setIsCollapsed(window.scrollY >= containerTop + expanded * COLLAPSE_RATIO);

      const collapsedCardTop = containerTop + expanded - collapsed;
      setIsSticky(window.scrollY >= collapsedCardTop - STICKY_TOP_PX);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [headerRef, cardHeights]);

  return { isCollapsed, isSticky };
}
