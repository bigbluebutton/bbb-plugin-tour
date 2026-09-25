import { createGlobalStyle } from 'styled-components';
import {
  borderRadiusDefault, colorBackgroundWhite, colorOverlay, colorShadowDefault,
} from '@bigbluebutton/bbb-ui-components-react';

const ShepherdStyle = createGlobalStyle`
  .shepherd-element {
    /* The library tokens reference these variables themselves, so they can't
       be bound through them. Left without a fallback, an unset client variable
       makes the binding invalid and the library falls back to its default. */
    --color-brand-1: var(--color-primary);
    --color-error: var(--color-danger);
    --color-error-dark: var(--color-danger-dark);
    --color-brand-light: var(--color-blue-aux);

    background: ${colorBackgroundWhite};
    border-radius: ${borderRadiusDefault};
    box-shadow: 0 1px 4px ${colorShadowDefault};
  }

  .shepherd-arrow:before {
    background: ${colorBackgroundWhite};
  }

  .shepherd-text {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .shepherd-modal-overlay-container.shepherd-modal-is-visible {
    opacity: 1;
  }

  .shepherd-modal-overlay-container path {
    fill: ${colorOverlay};
  }
`;

export default ShepherdStyle;
