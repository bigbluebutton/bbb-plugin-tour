import { PluginApi, SidekickAreaCorePanelEnum } from 'bigbluebutton-html-plugin-sdk';

// On mobile, BBB 4.x collapses the navigation rail behind a toggle that plugins
// can't open or close, so the tour taps that toggle itself
export const NAVIGATION_TOGGLE = '[data-test="toggleSidebarNavigation"], [data-test="hasUnreadMessages"]';

// How long the rail and the panels take to open or close
const ANIMATION_MS = 200;

// The rail buttons of the core panels a plugin can open and close
const CORE_PANEL_BUTTONS: [string, SidekickAreaCorePanelEnum][] = [
  ['usersListSidebarButton', SidekickAreaCorePanelEnum.USER_LIST],
  ['messagesSidebarButton', SidekickAreaCorePanelEnum.CHAT],
  ['sharedNotesSidebarButton', SidekickAreaCorePanelEnum.SHARED_NOTES],
  ['appsGallerySidebarButton', SidekickAreaCorePanelEnum.APPS_GALLERY],
  ['pollSidebarButton', SidekickAreaCorePanelEnum.POLL],
  ['timerSidebarButton', SidekickAreaCorePanelEnum.TIMER],
  ['breakoutroomSidebarButton', SidekickAreaCorePanelEnum.BREAKOUT],
];

export interface SidebarState {
  navigationExpanded?: boolean,
  panel?: SidekickAreaCorePanelEnum,
}

const waitForAnimation = () => new Promise<void>((resolve) => {
  setTimeout(resolve, ANIMATION_MS);
});

const getNavigationToggle = () => document.querySelector<HTMLElement>(NAVIGATION_TOGGLE);

const isExpanded = (element: Element | null) => element?.getAttribute('aria-expanded') === 'true';

/**
 * Whether the navigation rail is expanded, or undefined where it can't collapse (desktop)
 */
export const isNavigationExpanded = (): boolean | undefined => {
  const toggle = getNavigationToggle();
  return toggle ? isExpanded(toggle) : undefined;
};

/**
 * Expands or collapses the navigation rail, resolving once it has settled
 */
export const setNavigationExpanded = (expanded: boolean): Promise<void> => {
  const toggle = getNavigationToggle();
  if (!toggle || isExpanded(toggle) === expanded) {
    return Promise.resolve();
  }
  toggle.click();
  return waitForAnimation();
};

const getOpenCorePanel = (): SidekickAreaCorePanelEnum | undefined => CORE_PANEL_BUTTONS
  .find(([dataTest]) => isExpanded(document.querySelector(`[data-test="${dataTest}"]`)))?.[1];

/**
 * The rail and panel state to put back when the tour ends. Only mobile needs the
 * panel closed, so the panel is only recorded there.
 */
export const getSidebarState = (): SidebarState => {
  const navigationExpanded = isNavigationExpanded();
  return {
    navigationExpanded,
    panel: navigationExpanded === undefined ? undefined : getOpenCorePanel(),
  };
};

/**
 * On mobile, closes the open panel and collapses the rail, as both cover the media
 * area and the action bar, resolving once they have settled
 */
export const uncoverMediaArea = async (pluginApi: PluginApi): Promise<void> => {
  if (isNavigationExpanded() === undefined) return;
  const panel = getOpenCorePanel();
  if (panel) {
    pluginApi.uiCommands.sidekickArea.panel.close(panel);
    await waitForAnimation();
  }
  await setNavigationExpanded(false);
};

/**
 * Puts the rail and panel back as they were when the tour started
 */
export const restoreSidebar = async (pluginApi: PluginApi, state: SidebarState): Promise<void> => {
  if (state.panel) {
    pluginApi.uiCommands.sidekickArea.panel.open(state.panel);
    // opening a panel collapses the rail on mobile, so wait before restoring it
    await waitForAnimation();
  }
  if (state.navigationExpanded !== undefined) {
    await setNavigationExpanded(state.navigationExpanded);
  }
};
