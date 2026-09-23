// On mobile, BBB 4.x collapses the navigation rail behind a toggle that plugins
// can't open or close, so the tour taps that toggle itself
export const NAVIGATION_TOGGLE = '[data-test="toggleSidebarNavigation"], [data-test="hasUnreadMessages"]';

// How long the rail takes to expand or collapse
const NAVIGATION_ANIMATION_MS = 200;

const getNavigationToggle = () => document.querySelector<HTMLElement>(NAVIGATION_TOGGLE);

/**
 * Whether the navigation rail is expanded, or undefined where it can't collapse (desktop)
 */
export const isNavigationExpanded = (): boolean | undefined => {
  const toggle = getNavigationToggle();
  return toggle ? toggle.getAttribute('aria-expanded') === 'true' : undefined;
};

/**
 * Expands or collapses the navigation rail, resolving once it has settled
 */
export const setNavigationExpanded = (expanded: boolean): Promise<void> => {
  const toggle = getNavigationToggle();
  if (!toggle || (toggle.getAttribute('aria-expanded') === 'true') === expanded) {
    return Promise.resolve();
  }
  toggle.click();
  return new Promise((resolve) => { setTimeout(resolve, NAVIGATION_ANIMATION_MS); });
};
