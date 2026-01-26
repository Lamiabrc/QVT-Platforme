// src/hooks/use-mobile.tsx
import { useBreakpoint } from "./useBreakpoint";
export function useIsMobile() {
  const { isMobile } = useBreakpoint();
  return isMobile;
}
