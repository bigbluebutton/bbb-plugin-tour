/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as React from 'react';
import { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import { IntlShape, createIntl, defineMessages } from 'react-intl';
import {
  BbbPluginSdk, OptionsDropdownOption, PluginApi,
  pluginLogger, IntlLocaleUiDataNames,
  LayoutPresentationAreaUiDataNames, UiLayouts,
} from 'bigbluebutton-html-plugin-sdk';
import { TourPluginProps, Settings, ClientSettingsSubscriptionResultType } from './types';
import getTourFeatures from './getTourFeatures';
import 'shepherd.js/dist/css/shepherd.css';
import './custom.css';

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

/**
 * Starts the tour with the steps defined by getTourFeatures()
 * @param {IntlShape} intl Intl object from react-intl
 * @param {Object} URLS object with urls to link in know more buttons (from settings)
 */
export function startTour(
  intl: IntlShape,
  URLS: object,
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
      } as Parameters<typeof tour.addStep>[0]);
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

  let messages = {};
  try {
    messages = require(`../locales/${currentLocale.locale.replace('-', '_')}.json`);
  } catch {
    messages = require(`../locales/${currentLocale.fallbackLocale.replace('-', '_')}.json`);
  }

  const intl = createIntl({
    locale: currentLocale.locale,
    messages,
    fallbackOnEmptyString: true,
  });

  useEffect(() => {
    const plugins = clientSettings?.meeting_clientSettings[0]?.clientSettingsJson?.public?.plugins;
    const tourPlugin = plugins?.find((plugin) => plugin.name === 'TourPlugin');
    if (tourPlugin && tourPlugin?.settings) {
      setSettings(tourPlugin.settings);
    }
  }, [clientSettings]);

  useEffect(() => {
    const endTourEvents = ['cancel', 'complete'];

    // restores the panel state after finishing the tour
    endTourEvents.forEach((event) => Shepherd.on(event, () => {
      // reopen sidebar
      pluginApi.uiCommands.sidekickOptionsContainer.open();
      // restores presentation state after finishing the tour
      if (presentationInitiallyOpened !== layoutInformation[0]?.isOpen) {
        if (presentationInitiallyOpened) {
          pluginApi.uiCommands.presentationArea.open();
        } else {
          pluginApi.uiCommands.presentationArea.close();
        }
      }
      // removes events
      endTourEvents.forEach((event) => Shepherd.off(event, undefined));
    }));
    return () => {
      // removes events
      endTourEvents.forEach((event) => Shepherd.off(event, undefined));
    };
  }, [layoutInformation]);

  useEffect(() => {
    pluginApi.setOptionsDropdownItems([
      new OptionsDropdownOption({
        label: intl.formatMessage(intlMessages.start),
        icon: 'presentation',
        onClick: async () => {
          setPresentationInitiallyOpened(layoutInformation[0]?.isOpen);
          pluginLogger.info({
            logCode: 'plg_started',
          }, `Plugin started: ${pluginApi.pluginName}`);
          // ensure only userList is open (to also work on Mobile)
          pluginApi.uiCommands.sidekickOptionsContainer.close();
          pluginApi.uiCommands.sidekickOptionsContainer.open();
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
