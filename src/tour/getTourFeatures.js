/**
 * @typedef {Object} TourFeature Represents a feature to be presented in the tour
 * @property {string} name Identifies the feature
 * @property {Date} date Refers to when the feature was "released".
 * This is used to only present features newer than the last time the user saw the tour.
 * @property {Object[]} steps An array of objects where
 * each object is the options to a Step (Shepherd.js)
 * Docs: https://shepherdjs.dev/docs/Step.html#Step
 */

/**
 * Defines the features to be presented in the tour
 *
 * @param {IntlShape} intl An intl object from react-intl
 * @returns {TourFeature[]>}
 */

import { defineMessages } from 'react-intl';

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
  interactions: {
    id: 'app.tour.interactions',
    description: 'Interactions button label',
  },
  raiseHand: {
    id: 'app.tour.raiseHand',
    description: 'Raise hand button label',
  },
  leaveSession: {
    id: 'app.tour.leaveSession',
    description: 'Leave session button label',
  },
  interactionsMore: {
    id: 'app.tour.interactionsMore',
    description: 'More Interactions button label',
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
  userListToggle: {
    id: 'app.tour.userListToggle',
    description: 'User list toggle label',
  },
  sharedNotes: {
    id: 'app.tour.panel.sharedNotes',
    description: 'Shared Notes label',
  },
  chat: {
    id: 'app.tour.panel.chat',
    description: 'Chat label',
  },
  questions: {
    id: 'app.tour.panel.questions',
    description: 'Questions label',
  },
  plusActions: {
    id: 'app.tour.plusActions',
    description: 'Plus actions label',
  },
  recording: {
    id: 'app.tour.recording',
    description: 'Recording button label',
  },
  connectionStatus: {
    id: 'app.tour.connectionStatus',
    description: 'Connection status button label',
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

const getNextButton = (intl, tour) => ({
  text: intl.formatMessage(intlMessages.next),
  action: tour.next,
});

const getBackButton = (intl, tour) => ({
  text: intl.formatMessage(intlMessages.back),
  action: tour.back,
  secondary: true,
});

const getKnowMoreButton = (intl, url) => ({
  text: intl.formatMessage(intlMessages.knowMore),
  action: () => { window.open(url, '_blank', 'noopener,noreferrer'); },
  secondary: true,
});

const getCloseTourButton = (intl, tour) => ({
  text: intl.formatMessage(intlMessages.close),
  action: tour.complete,
});

const getTourFeatures = (
  intl,
  tour,
  URLS,
  pluginApi,
  userListOpened,
  presentationInitiallyOpened,
) => {
  const actions = {
    closePanel: () => {
      pluginApi.uiCommands.sidekickOptionsContainer.close();
    },
    openUserList: () => {
      if (!userListOpened) {
        pluginApi.uiCommands.sidekickOptionsContainer.open();
      }
    },
    openPresentation: () => {
      if (!presentationInitiallyOpened) {
        pluginApi.uiCommands.presentationArea.open();
      }
    },
  };

  const microphoneToggleFeature = {
    name: 'microphoneToggle',
    date: new Date(0),
    steps: [
      {
        id: 'microphoneToggle',
        attachTo: { element: '[data-test="muteMicButton"]', on: 'top' },
        text: intl.formatMessage(intlMessages.toggleMic),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const audioJoinFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const audioSelectorFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const leaveAudioFeature = {
    name: 'leaveAudio',
    date: new Date(0),
    steps: [
      {
        id: 'leaveAudio',
        attachTo: { element: '[data-key="joinAudio"]', on: 'top' },
        text: intl.formatMessage(intlMessages.leaveAudio),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const videoFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const screnshareFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const interactionsFeature = {
    name: 'interactions',
    date: new Date(0),
    steps: [
      {
        id: 'interactions',
        attachTo: {
          element: '[id="interactionsButton"]',
          on: 'top',
        },
        text: intl.formatMessage(intlMessages.interactions),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const raiseHandFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const whiteboardFeature = {
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

  const closePresentationFeature = {
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
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const userListToggleFeature = {
    name: 'userListToggle',
    date: new Date(0),
    steps: [
      {
        id: 'userListToggle',
        attachTo: { element: '[data-test="toggleUserList"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.userListToggle),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const panelFeature = {
    name: 'panel',
    date: new Date(0),
    steps: [
      {
        id: 'panel.sharedNotes',
        attachTo: { element: '[data-test="sharedNotesButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.sharedNotes),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.openUserList(),
        },
      },
      {
        id: 'panel.chat',
        attachTo: { element: '[data-test="chatButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.chat),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
      {
        id: 'panel.questions',
        attachTo: { element: '[data-test="questionsButton"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.questions),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const plusActionsFeature = {
    name: 'plusActions',
    date: new Date(0),
    steps: [
      {
        id: 'plusActions',
        attachTo: { element: '[data-test="actionsButton"]', on: 'top' },
        text: intl.formatMessage(intlMessages.plusActions),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
        when: {
          'before-show': () => actions.closePanel(),
        },
      },
    ],
  };

  const recordingFeature = {
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

  const connectionStatusFeature = {
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

  const leaveSessionFeature = {
    name: 'leaveSession',
    date: new Date(0),
    steps: [
      {
        id: 'leaveSession',
        attachTo: { element: '[data-test="leaveMeetingDropdown"]', on: 'bottom' },
        text: intl.formatMessage(intlMessages.leaveSession),
        buttons: [
          getBackButton(intl, tour),
          getNextButton(intl, tour),
        ],
      },
    ],
  };

  const moreOptionsFeature = {
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

  const endTourFeature = {
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
    plusActionsFeature,
    microphoneToggleFeature,
    audioJoinFeature,
    leaveAudioFeature,
    audioSelectorFeature,
    videoFeature,
    screnshareFeature,
    interactionsFeature,
    raiseHandFeature,
    whiteboardFeature,
    closePresentationFeature,
    userListToggleFeature,
    recordingFeature,
    connectionStatusFeature,
    leaveSessionFeature,
    moreOptionsFeature,
    endTourFeature,
  ];

  // removes back button from the first step visible to user
  const firstVisibleStep = features[0].steps.find((step) => step.buttons);
  firstVisibleStep.buttons = firstVisibleStep.buttons
    .filter((button) => button.text !== intl.formatMessage(intlMessages.back));

  return features;
};

export default getTourFeatures;
