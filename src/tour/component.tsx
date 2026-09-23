/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as React from 'react';
import { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import type Evented from 'shepherd.js/src/types/evented';
import { IntlShape, createIntl, defineMessages } from 'react-intl';
import {
  BbbPluginSdk, OptionsDropdownOption, PluginApi,
  pluginLogger, IntlLocaleUiDataNames,
  LayoutPresentationAreaUiDataNames, UiLayouts,
} from 'bigbluebutton-html-plugin-sdk';
import { TourPluginProps, Settings, ClientSettingsSubscriptionResultType } from './types';
import getTourFeatures from './getTourFeatures';
import { SidebarState, getSidebarState, restoreSidebar } from './sidebar';
import 'shepherd.js/dist/css/shepherd.css';
import './custom.css';

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
});

// The client can hand over tags Intl rejects, such as en-US@posix from a POSIX
// browser locale, and createIntl throws on those, so use the first valid one
const toIntlLocale = (...locales: string[]): string => locales.find((locale) => {
  try {
    Intl.NumberFormat.supportedLocalesOf(locale);
    return true;
  } catch {
    return false;
  }
}) ?? 'en';

// The texts of a locale file the plugin ships, or none
const loadMessages = (locale: string): Record<string, string> => {
  try {
    return require(`../../public/locales/${locale.replace('-', '_')}.json`);
  } catch {
    return {};
  }
};

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
      cancelIcon: {
        enabled: true,
      },
      canClickTarget: false,
    },
    useModalOverlay: true,
  });

  getTourFeatures(
    intl,
    tour,
    URLS,
    pluginApi,
    presentationInitiallyOpened,
  ).forEach((feature) => {
    feature.steps.forEach((step) => {
      tour.addStep({
        ...step,
        // Only show step if the element is visible
        showOn: () => !!document.querySelector(
          step.attachTo.element,
        ),
      });
    });
  });

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

  const currentLocale = pluginApi.useUiData(IntlLocaleUiDataNames.CURRENT_LOCALE, {
    locale: 'en',
    fallbackLocale: 'en',
  });

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

  // English is the only complete translation, so it fills the texts the others lack
  const messages = {
    ...loadMessages('en'),
    ...loadMessages(currentLocale.fallbackLocale),
    // the client names its locale after its own files, such as it-IT for its
    // it_IT.json, so also load the plugin's file for the language alone
    ...loadMessages(currentLocale.locale.split(/[-_]/)[0]),
    ...loadMessages(currentLocale.locale),
  };

  const intl = createIntl({
    locale: toIntlLocale(currentLocale.locale, currentLocale.fallbackLocale),
    messages,
    fallbackOnEmptyString: true,
  });

  useEffect(() => {
    const plugins = clientSettings?.meeting_clientSettings[0]?.clientSettingsJson?.public?.plugins;
    // 4.0 servers set up before the rename configure the plugin as TourPlugin
    const tourPlugin = plugins?.find((plugin) => plugin.name === 'BbbPluginTour')
      ?? plugins?.find((plugin) => plugin.name === 'TourPlugin');
    if (tourPlugin && tourPlugin?.settings) {
      setSettings(tourPlugin.settings);
    }
  }, [clientSettings]);

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
  }, [currentLocale, settings, layoutInformation]);

  return null;
}

export default TourPlugin;
