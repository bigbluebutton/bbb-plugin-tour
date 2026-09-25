import { TOUR_STEP_BUTTON_VARIANTS } from './constants';

type TourStepButtonVariant =
    typeof TOUR_STEP_BUTTON_VARIANTS[keyof typeof TOUR_STEP_BUTTON_VARIANTS];

interface TourStepButton {
    text: string,
    action: () => void,
    variant: TourStepButtonVariant,
}

interface TourStepContentProps {
    text: string,
    buttons: TourStepButton[],
    closeLabel: string,
    onClose: () => void,
}

export { TourStepButton, TourStepButtonVariant, TourStepContentProps };
