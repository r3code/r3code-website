/// <reference types="astro/client" />

// Global type declarations for Yandex.Metrika helper.
// reachGoal is injected by src/components/YandexMetrika.astro in production.

interface Window {
  /** Yandex.Metrika counter function. Available in production only. */
  ym?: (...args: unknown[]) => void;
  /**
   * Reach Metrika goal. Safe to call when ym is not yet loaded or blocked
   * by uBlock. Always returns true so it can be used in onclick="return ..." .
   */
  reachGoal?: (goalId: string) => true;
}
