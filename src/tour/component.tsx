import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import Shepherd from 'shepherd.js';
import type Evented from 'shepherd.js/src/types/evented';
import {
  IntlShape, createIntl, createIntlCache, defineMessages,
} from 'react-intl';
import {
  BbbPluginSdk, OptionsDropdownOption, PluginApi,
  pluginLogger, LayoutPresentationAreaUiDataNames, UiLayouts,
} from 'bigbluebutton-html-plugin-sdk';
import { TourPluginProps, Settings, ClientSettingsSubscriptionResultType } from './types';
import { LOCALE_REQUEST_OBJECT } from './constants';
import getTourFeatures from './getTourFeatures';
import { SidebarState, getSidebarState, restoreSidebar } from './sidebar';
import TourStepContent from './step-content/component';
import ShepherdStyle from './styles';
import 'shepherd.js/dist/css/shepherd.css';

// shepherd.js 11.x types omit the Evented methods its default export has at runtime
const ShepherdEvents = Shepherd as unknown as Evented;

export const CLIENT_SETTINGS_SUBSCRIPTION = `subscription ClientSettings {
  meeting_clientSettings {
    clientSettingsJson
  }
}`;

const intlMessages = defineMessages({
  start: {
    id: 'app.tour.startTour',
    description: 'start tour button label',
  },
  close: {
    id: 'app.tour.button.close',
    description: 'close tour button label',
  },
});

// The client can hand over tags Intl rejects, such as en-US@posix from a POSIX
// browser locale, and createIntl throws on those, so use the first valid one
const toIntlLocale = (...locales: (string | undefined)[]): string => locales.find((locale) => {
  if (!locale) return false;
  try {
    Intl.NumberFormat.supportedLocalesOf(locale);
    return true;
  } catch {
    return false;
  }
}) ?? 'en';

/**
 * Starts the tour with the steps defined by getTourFeatures()
 * @param {IntlShape} intl Intl object from react-intl
 * @param {Object} URLS object with urls to link in know more buttons (from settings)
 */
export function startTour(
  intl: IntlShape,
  URLS: Settings['url'],
  pluginApi: PluginApi,
  presentationInitiallyOpened: boolean,
) {
  // Docs: https://docs.shepherdpro.com/guides/usage/
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      canClickTarget: false,
    },
    useModalOverlay: true,
  });

  const stepRoots: Root[] = [];

  getTourFeatures(
    intl,
    tour,
    URLS,
    pluginApi,
    presentationInitiallyOpened,
  ).forEach((feature) => {
    feature.steps.forEach(({ text, buttons = [], ...step }) => {
      const stepContainer = document.createElement('div');
      const stepRoot = createRoot(stepContainer);
      // Shepherd collects a step's focusable elements for its Tab trap when the
      // step mounts, so the buttons must be in the DOM before the tour starts
      flushSync(() => stepRoot.render(
        <TourStepContent
          text={text}
          buttons={buttons}
          closeLabel={intl.formatMessage(intlMessages.close)}
          onClose={() => tour.cancel()}
        />,
      ));
      stepRoots.push(stepRoot);

      tour.addStep({
        ...step,
        text: stepContainer,
        // Only show step if the element is visible
        showOn: () => !!document.querySelector(
          step.attachTo.element,
        ),
      });
    });
  });

  // Deferred because the tour ends from a click handler inside one of these roots
  const unmountStepRoots = () => queueMicrotask(
    () => stepRoots.forEach((stepRoot) => stepRoot.unmount()),
  );
  tour.on('complete', unmountStepRoots);
  tour.on('cancel', unmountStepRoots);

  tour.start();
}

function TourPlugin(
  { pluginUuid: uuid }: TourPluginProps,
): React.ReactElement<TourPluginProps> {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const [presentationInitiallyOpened, setPresentationInitiallyOpened] = React.useState(true);
  const sidebarInitialState = React.useRef<SidebarState>({});
  const [settings, setSettings] = React.useState<Settings>({});

  const layoutInformation = pluginApi.useUiData(
    LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT,
    [{
      isOpen: presentationInitiallyOpened,
      currentElement: UiLayouts.WHITEBOARD,
    },
    ],
  );

  // TODO revisit when fixed
  // const settings = pluginApi.usePluginSettings()?.data;

  const { data: clientSettings } = pluginApi.useCustomSubscription<
    ClientSettingsSubscriptionResultType
  >(CLIENT_SETTINGS_SUBSCRIPTION);

  useEffect(() => {
    const plugins = clientSettings?.meeting_clientSettings[0]?.clientSettingsJson?.public?.plugins;
    // 4.0 servers set up before the rename configure the plugin as TourPlugin
    const tourPlugin = plugins?.find((plugin) => plugin.name === 'BbbPluginTour')
      ?? plugins?.find((plugin) => plugin.name === 'TourPlugin');
    if (tourPlugin && tourPlugin?.settings) {
      setSettings(tourPlugin.settings);
    }
  }, [clientSettings]);

  const {
    messages,
    currentLocale,
    loading: localeLoading,
  } = pluginApi.useLocaleMessages(LOCALE_REQUEST_OBJECT);

  const intlCache = useMemo(() => createIntlCache(), []);
  const intl = useMemo(() => (localeLoading ? null : createIntl({
    locale: toIntlLocale(currentLocale),
    messages,
    fallbackOnEmptyString: true,
  }, intlCache)), [localeLoading, messages, currentLocale, intlCache]);

  useEffect(() => {
    const endTourEvents = ['cancel', 'complete'];

    endTourEvents.forEach((event) => ShepherdEvents.on(event, () => {
      // restores the navigation rail and panel after finishing the tour (mobile only)
      restoreSidebar(pluginApi, sidebarInitialState.current);
      // restores presentation state after finishing the tour
      if (presentationInitiallyOpened !== layoutInformation[0]?.isOpen) {
        if (presentationInitiallyOpened) {
          pluginApi.uiCommands.presentationArea.open();
        } else {
          pluginApi.uiCommands.presentationArea.close();
        }
      }
      // removes events
      endTourEvents.forEach((endEvent) => ShepherdEvents.off(endEvent, undefined));
    }));
    return () => {
      // removes events
      endTourEvents.forEach((event) => ShepherdEvents.off(event, undefined));
    };
  }, [layoutInformation]);

  useEffect(() => {
    if (!intl) return;
    pluginApi.setOptionsDropdownItems([
      new OptionsDropdownOption({
        label: intl.formatMessage(intlMessages.start),
        icon: 'presentation',
        onClick: async () => {
          setPresentationInitiallyOpened(layoutInformation[0]?.isOpen);
          sidebarInitialState.current = getSidebarState();
          pluginLogger.info({
            logCode: 'plg_started',
          }, `Plugin started: ${pluginApi.pluginName}`);
          // ensure presentation is open before start (it will be closed after)
          pluginApi.uiCommands.presentationArea.open();
          // wait some time for the ui to update
          await new Promise((resolve) => { setTimeout(resolve, 1000); });
          startTour(
            intl,
            settings?.url,
            pluginApi,
            layoutInformation[0]?.isOpen,
          );
        },
      }),
    ]);
  }, [intl, settings, layoutInformation]);

  return <ShepherdStyle />;
}

export default TourPlugin;
