import NProgress from "nprogress";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Configure NProgress
NProgress.configure({
  showSpinner: true,
  minimum: 0.1,
  easing: "ease",
  speed: 200,
  trickleSpeed: 200,
});

export const useNProgress = () => {
  const location = useLocation();

  useEffect(() => {
    // Start progress bar on route change
    NProgress.start();

    // Complete progress bar after a short delay to ensure the page has loaded
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

// Hook for manual progress control (for async operations)
export const useManualProgress = () => {
  const start = () => NProgress.start();
  const done = () => NProgress.done();
  const inc = (amount?: number) => NProgress.inc(amount);
  const set = (progress: number) => NProgress.set(progress);

  return { start, done, inc, set };
};
