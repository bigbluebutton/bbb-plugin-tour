import styled from 'styled-components';
import { spacingSmall, spacingMedium } from '@bigbluebutton/bbb-ui-components-react';

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Body = styled.div`
  padding: 0 ${spacingSmall};
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${spacingSmall};
  margin-top: ${spacingMedium};
`;

export default { Header, Body, Footer };
