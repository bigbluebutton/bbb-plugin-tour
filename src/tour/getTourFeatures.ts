import { IntlShape, defineMessages } from 'react-intl';
import { PluginApi } from 'bigbluebutton-html-plugin-sdk';
import type Tour from 'shepherd.js/src/types/tour';
import { Settings, TourFeature } from './types';
import { NAVIGATION_TOGGLE, setNavigationExpanded, uncoverMediaArea } from './sidebar';
import { TOUR_STEP_BUTTON_VARIANTS } from './step-content/constants';
import { TourStepButton } from './step-content/types';

const intlMessages = defineMessages({
  next: {
    id: 'app.tour.button.next',
    description: 'next button label',
  },
  back: {
    id: 'app.tour.button.back',
    description: 'Back button label',
  },
  knowMore: {
    id: 'app.tour.button.knowMore',
    description: 'Know more button label',
  },
  close: {
    id: 'app.tour.button.close',
    description: 'Close button label',
  },
  toggleMic: {
    id: 'app.tour.toggleMic',
    description: 'Toggle mic button label',
  },
  audio: {
    id: 'app.tour.audio',
    description: 'Audio button label',
  },
  selectorAudio: {
    id: 'app.tour.selectorAudio',
    description: 'Selector audio device button label',
  },
  leaveAudio: {
    id: 'app.tour.leaveAudio',
    description: 'Leave audio button label',
  },
  video: {
    id: 'app.tour.video',
    description: 'Video button label',
  },
  screenshare: {
    id: 'app.tour.screenshare',
    description: 'Screenshare button label',
  },
  reactions: {
    id: 'app.tour.reactions',
    description: 'Reactions button label',
  },
  raiseHand: {
    id: 'app.tour.raiseHand',
    description: 'Raise Hand button label',
  },
  whiteboardTitle: {
    id: 'app.tour.whiteboard.title',
    description: 'Whiteboard title label',
  },
  whiteboardIntro: {
    id: 'app.tour.whiteboard.intro',
    description: 'Whiteboard intro label',
  },
  whiteboardUpload: {
    id: 'app.tour.whiteboard.upload',
    description: 'Whiteboard Upload label',
  },
  whiteboardToolbar: {
    id: 'app.tour.whiteboard.toolbar',
    description: 'Whiteboard toolbar label',
  },
  whiteboardMultiuser: {
    id: 'app.tour.whiteboard.multiuser',
    description: 'Whiteboard multiuser label',
  },
  closePresentation: {
    id: 'app.tour.closePresentation',
    description: 'Close presentation label',
  },
  mediaArea: {
    id: 'app.tour.mediaArea',
    description: 'Media Area label',
  },
  userListToggle: {
    id: 'app.tour.userListToggle',
    description: 'User list toggle label',
  },
  profileSettings: {
    id: 'app.tour.panel.profileSettings',
    description: 'Profile Settings label',
  },
  userList: {
    id: 'app.tour.panel.userList',
    description: 'User List label',
  },
  sharedNotes: {
    id: 'app.tour.panel.sharedNotes',
    description: 'Shared Notes label',
  },
  chat: {
    id: 'app.tour.panel.chat',
    description: 'Chat label',
  },
  appsGallery: {
    id: 'app.tour.panel.appsGallery',
    description: 'Apps Gallery label',
  },
  sessionDetails: {
    id: 'app.tour.sessionDetails',
    description: 'Session details label',
  },
  recording: {
    id: 'app.tour.recording',
    description: 'Recording button label',
  },
  connectionStatus: {
    id: 'app.tour.connectionStatus',
    description: 'Connection status button label',
  },
  leave: {
    id: 'app.tour.leave',
    description: 'Leave button label',
  },
  moreOptions: {
    id: 'app.tour.moreOptions',
    description: 'More options button label',
  },
  endTour: {
    id: 'app.tour.endTour',
    description: 'End tour button label',
  },
});

const getNextButton = (intl: IntlShape, tour: Tour): TourStepButton => ({
  text: intl.formatMessage(intlMessages.next),
  action: () => tour.next(),
  variant: TOUR_STEP_BUTTON_VARIANTS.PRIMARY,
});

const getBackButton = (intl: IntlShape, tour: Tour): TourStepButton => ({
  text: intl.formatMessage(intlMessages.back),
  action: () => tour.back(),
  variant: TOUR_STEP_BUTTON_VARIANTS.SECONDARY,
});

const getKnowMoreButton = (intl: IntlShape, url?: string): TourStepButton => ({
  text: intl.formatMessage(intlMessages.knowMore),
  action: () => { window.open(url, '_blank', 'noopener,noreferrer'); },
  variant: TOUR_STEP_BUTTON_VARIANTS.TERTIARY,
});

const getCloseTourButton = (intl: IntlShape, tour: Tour): TourStepButton => ({
  text: intl.formatMessage(intlMessages.close),
  action: () => tour.complete(),
  variant: TOUR_STEP_BUTTON_VARIANTS.PRIMARY,
});

/**
 * Defines the features to be presented in the tour
 */
const getTourFeatures = (
  intl: IntlShape,
  tour: Tour,
  URLS: Settings['url'],
  pluginApi: PluginApi,
  presentationInitiallyOpened: boolean,
): TourFeature[] => {
  const actions = {
    expandNavigation: () => setNavigationExpanded(true),
    uncoverMediaArea: () => uncoverMediaArea(pluginApi),
    openPresentation: () => {
      if (!presentationInitiallyOpened) {
        pluginApi.uiCommands.presentationArea.open();
      }
    },
  };

  const microphoneToggleFeature: TourFeature = {
    name: 'microphoneToggle',
    date: new Date(0),
    steps: [
      {
        id: 'microphoneToggle',
        attachTo: {
          element: '[data-test="muteMicButton"], [data-test="unmuteMicButton"]',
          on: 'top',
        },
        text: intl.formatMessage(intlMessages.toggleMic),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const audioJoinFeature: TourFeature = {
    name: 'audio',
    date: new Date(0),
    steps: [
      {
        id: 'audio',
        attachTo: { element: '[data-test="joinAudio"]', on: 'top' },
        text: intl.formatMessage(intlMessages.audio),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const audioSelectorFeature: TourFeature = {
    name: 'audioSelector',
    date: new Date(0),
    steps: [
      {
        id: 'audioSelector',
        attachTo: { element: '[data-test="audioDropdownMenu"]', on: 'top' },
        text: intl.formatMessage(intlMessages.selectorAudio),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const leaveAudioFeature: TourFeature = {
    name: 'leaveAudio',
    date: new Date(0),
    steps: [
      {
        id: 'leaveAudio',
        attachTo: { element: '[data-test="leaveListenOnly"]', on: 'top' },
        text: intl.formatMessage(intlMessages.leaveAudio),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const videoFeature: TourFeature = {
    name: 'video',
    date: new Date(0),
    steps: [
      {
        id: 'video',
        attachTo: { element: '[data-test="joinVideo"]', on: 'top' },
        text: intl.formatMessage(intlMessages.video),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const screnshareFeature: TourFeature = {
    name: 'screenshare',
    date: new Date(0),
    steps: [
      {
        id: 'screenshare',
        attachTo: {
          element: '[data-test="startScreenShare"]',
          on: 'top',
        },
        text: intl.formatMessage(intlMessages.screenshare),
        buttons: [
          getKnowMoreButton(intl, URLS?.screenshare),
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const reactionsFeature: TourFeature = {
    name: 'reactions',
    date: new Date(0),
    steps: [
      {
        id: 'reactions',
        attachTo: {
          element: '[data-test="reactionsButton"]',
          on: 'top',
        },
        text: intl.formatMessage(intlMessages.reactions),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const raiseHandFeature: TourFeature = {
    name: 'raiseHand',
    date: new Date(0),
    steps: [
      {
        id: 'raiseHand',
        attachTo: {
          element: '[data-test="raiseHandBtn"]',
          on: 'top',
        },
        text: intl.formatMessage(intlMessages.raiseHand),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const whiteboardFeature: TourFeature = {
    name: 'whiteboard',
    date: new Date(0),
    steps: [
      {
        id: 'whiteboard.intro',
        attachTo: { element: '[id="whiteboard-element"]', on: 'top' },
        title: intl.formatMessage(intlMessages.whiteboardTitle),
        text: intl.formatMessage(intlMessages.whiteboardIntro),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.openPresentation(),
        },
      },
      {
        id: 'whiteboard.upload',
        attachTo: { element: '[id="whiteboard-element"]', on: 'top' },
        title: intl.formatMessage(intlMessages.whiteboardTitle),
        text: intl.formatMessage(intlMessages.whiteboardUpload),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.openPresentation(),
        },
      },
      {
        id: 'whiteboard.toolbar',
        attachTo: { element: '[class="tlui-toolbar__inner"]', on: 'top-start' },
        title: intl.formatMessage(intlMessages.whiteboardTitle),
        text: intl.formatMessage(intlMessages.whiteboardToolbar),
        buttons: [
          getKnowMoreButton(intl, URLS?.whiteboard),
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.openPresentation(),
        },
      },
      {
        id: 'whiteboard.multiuser',
        attachTo: { element: '[data-test="turnMultiUsersWhiteboardOn"]', on: 'bottom' },
        title: intl.formatMessage(intlMessages.whiteboardTitle),
        text: intl.formatMessage(intlMessages.whiteboardMultiuser),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.openPresentation(),
        },
      },
    ],
  };

  const closePresentationFeature: TourFeature = {
    name: 'closePresentation',
    date: new Date(0),
    steps: [
      {
        id: 'closePresentation',
        attachTo: { element: '[data-test="minimizePresentation"]', on: 'top' },
        text: intl.formatMessage(intlMessages.closePresentation),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const mediaAreaFeature: TourFeature = {
    name: 'closePresentation',
    date: new Date(0),
    steps: [
      {
        id: 'mediaArea',
        attachTo: { element: '[data-test="mediaAreaButton"]', on: 'top' },
        text: intl.formatMessage(intlMessages.mediaArea),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const userListToggleFeature: TourFeature = {
    name: 'userListToggle',
    date: new Date(0),
    steps: [
      {
        id: 'userListToggle',
        attachTo: { element: NAVIGATION_TOGGLE, on: 'bottom' },
        text: intl.formatMessage(intlMessages.userListToggle),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const panelFeature: TourFeature = {
    name: 'panel',
    date: new Date(0),
    steps: [
      {
        id: 'panel.profile',
        attachTo: { element: '[data-test="profileSidebarButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.profileSettings),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.expandNavigation,
      },
      {
        id: 'panel.userList',
        attachTo: { element: '[data-test="usersListSidebarButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.userList),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.expandNavigation,
      },
      {
        id: 'panel.chat',
        attachTo: { element: '[data-test="messagesSidebarButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.chat),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.expandNavigation,
      },
      {
        id: 'panel.sharedNotes',
        attachTo: { element: '[data-test="sharedNotesSidebarButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.sharedNotes),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.expandNavigation,
      },
      {
        id: 'panel.appsGallery',
        attachTo: { element: '[data-test="appsGallerySidebarButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.appsGallery),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.expandNavigation,
      },
    ],
  };

  const sessionDetailsFeature: TourFeature = {
    name: 'sessionDetails',
    date: new Date(0),
    steps: [
      {
        id: 'sessionDetails',
        attachTo: { element: '[data-test="presentationTitle"]', on: 'top' },
        text: intl.formatMessage(intlMessages.sessionDetails),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        beforeShowPromise: actions.uncoverMediaArea,
      },
    ],
  };

  const recordingFeature: TourFeature = {
    name: 'recording',
    date: new Date(0),
    steps: [
      {
        id: 'recording',
        attachTo: { element: '[data-test="recordingIndicator"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.recording),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const connectionStatusFeature: TourFeature = {
    name: 'connectionStatus',
    date: new Date(0),
    steps: [
      {
        id: 'connectionStatus',
        attachTo: { element: '[data-test="connectionStatusButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.connectionStatus),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const leaveFeature: TourFeature = {
    name: 'leave',
    date: new Date(0),
    steps: [
      {
        id: 'leave',
        attachTo: { element: '[data-test="leaveMeetingDropdown"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.leave),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const moreOptionsFeature: TourFeature = {
    name: 'moreOptions',
    date: new Date(0),
    steps: [
      {
        id: 'moreOptions',
        attachTo: { element: '[data-test="optionsButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.moreOptions),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const endTourFeature: TourFeature = {
    name: 'endTour',
    date: new Date(0),
    steps: [
      {
        id: 'endTour',
        attachTo: { element: '[data-test="optionsButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.endTour),
        buttons: [
          getKnowMoreButton(intl, URLS?.general),
          getBackButton(intl, tour),
          getCloseTourButton(intl, tour),
        ],
      },
    ],
  };

  const features = [
    panelFeature,
    microphoneToggleFeature,
    audioJoinFeature,
    leaveAudioFeature,
    audioSelectorFeature,
    videoFeature,
    screnshareFeature,
    reactionsFeature,
    raiseHandFeature,
    whiteboardFeature,
    closePresentationFeature,
    mediaAreaFeature,
    userListToggleFeature,
    sessionDetailsFeature,
    recordingFeature,
    connectionStatusFeature,
    leaveFeature,
    moreOptionsFeature,
    endTourFeature,
  ];

  // removes back button from the first step visible to user
  const firstVisibleStep = features[0].steps.find((step) => step.buttons);
  if (firstVisibleStep?.buttons) {
    firstVisibleStep.buttons = firstVisibleStep.buttons
      .filter((button) => button.text !== intl.formatMessage(intlMessages.back));
  }

  return features;
};

export default getTourFeatures;
