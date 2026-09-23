import * as React from 'react';
import { MdClose } from 'react-icons/md';
import { BBButton, BBBTypography } from '@bigbluebutton/bbb-ui-components-react';
import { TourStepContentProps } from './types';
import Styled from './styles';

function TourStepContent({
  text, buttons, closeLabel, onClose,
}: TourStepContentProps): React.ReactElement {
  return (
    <>
      <Styled.Header>
        <BBButton
          layout="circle"
          variant="subtle"
          size="sm"
          icon={<MdClose />}
          ariaLabel={closeLabel}
          onClick={onClose}
        />
      </Styled.Header>
      <Styled.Body>
        <BBBTypography>{text}</BBBTypography>
      </Styled.Body>
      {buttons.length > 0 && (
        <Styled.Footer>
          {buttons.map((button) => (
            <BBButton
              key={button.text}
              label={button.text}
              variant={button.variant}
              size="sm"
              onClick={button.action}
            />
          ))}
        </Styled.Footer>
      )}
    </>
  );
}

export default TourStepContent;
