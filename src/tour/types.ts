import type Step from 'shepherd.js/src/types/step';

interface TourPluginProps {
    pluginName: string,
    pluginUuid: string,
}

interface Settings {
    url?: {
        general?: string
        screenshare?: string
        whiteboard?: string
    },
}

interface ClientSettingsSubscriptionResultType {
    meeting_clientSettings?: {
        clientSettingsJson: {
            public?: { plugins?: [{ name?: string, settings?: Settings }] },
        }
    }[];
}

// Shepherd step options, attached to the element a selector finds
interface TourStep extends Step.StepOptions {
    attachTo: {
        element: string,
        on: Step.PopperPlacement,
    },
}

// A feature presented in the tour
interface TourFeature {
    name: string,
    // When the feature was released, for showing only what is new since the last tour
    date: Date,
    steps: TourStep[],
}

export {
  TourPluginProps, Settings, ClientSettingsSubscriptionResultType, TourStep, TourFeature,
};
