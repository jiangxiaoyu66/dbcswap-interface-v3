import styled from 'styled-components';
import { TransferTokenForm } from './TransferTokenForm';

const CardContainer = styled.div`
  width: 100%;
  padding: 0 16px;
  border-radius: 16px;
  margin-top: 40px;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    margin-top: 0;
  }
`;

export function TransferTokenCard() {
  return (
    <CardContainer>
      <TransferTokenForm title="Cross-Chain USDT Transfer" />
    </CardContainer>
  );
}
