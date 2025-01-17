import { Trans } from 'i18n'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ExternalLink } from 'theme/components'
import { darken } from 'polished'

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    margin: 20px auto;
  }
`

const ContentCard = styled.div`
  background: ${({ theme }) => theme.surface1};
  border-radius: 24px;
  padding: 32px 40px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 16px;
  }
`

const Title = styled(Text).attrs({ as: 'h1' })`
  && {
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 40px 0;
    text-align: center;
    color: ${({ theme }) => theme.neutral1};
    -webkit-background-clip: text;

    @media (max-width: 768px) {
      font-size: 24px;
      margin: 0 0 32px 0;
    }
  }
`

const StepTitle = styled(Text).attrs({ as: 'h2' })`
  && {
    font-size: 24px;
    font-weight: 600;
    margin: 32px 0 16px 0;
    color: ${({ theme }) => theme.neutral1};
    display: flex;
    align-items: center;

    &:first-of-type {
      margin-top: 0;
    }

    @media (max-width: 768px) {
      font-size: 20px;
      margin: 24px 0 12px 0;
    }
  }
`

const StepNumber = styled.span`
  color: ${({ theme }) => theme.accent1};
  margin-right: 12px;
`

const StepContent = styled(Text)`
  && {
    margin: 0 0 32px 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.neutral2};
    font-size: 16px;
    padding-left: 28px;

    @media (max-width: 768px) {
      font-size: 14px;
      padding-left: 20px;
      margin: 0 0 24px 0;
    }
  }
`

const NetworkDetails = styled.div`
  background: ${({ theme }) => theme.surface2};
  padding: 24px;
  border-radius: 20px;
  margin: 16px 0 32px 28px;
  border: 1px solid ${({ theme }) => theme.surface3};

  @media (max-width: 768px) {
    padding: 16px;
    margin: 12px 0 24px 20px;
    border-radius: 12px;
  }
`

const NetworkItem = styled(Text)`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.neutral2};
  font-size: 16px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  
  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${({ theme }) => theme.neutral1};
    margin-right: 8px;
    min-width: 180px;
    display: inline-block;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;

    strong {
      min-width: auto;
      margin-bottom: 4px;
    }
  }
`

const StyledExternalLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.accent1};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => darken(0.1, theme.accent1)};
    text-decoration: underline;
  }
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.neutral1};
  font-weight: 600;
`

export default function BuyDBC() {
  return (
    <Container>
      <ContentCard>
        <Title>
          <Trans>How to Purchase DBC and Transfer It to Your Wallet</Trans>
        </Title>

        <StepTitle>
          <StepNumber>1.</StepNumber>
          Buy DBC on Gate.io
        </StepTitle>
        <StepContent>
          Visit <StyledExternalLink href="https://gate.io">Gate.io</StyledExternalLink> to purchase DBC.
        </StepContent>

        <StepTitle>
          <StepNumber>2.</StepNumber>
          Add a Custom Network to Your Wallet
        </StepTitle>
        <StepContent>
          You can use wallets like <StyledExternalLink href="https://metamask.io">MetaMask</StyledExternalLink>, 
          <StyledExternalLink href="https://token.im"> ImToken</StyledExternalLink>, or 
          <StyledExternalLink href="https://www.tokenpocket.pro"> TokenPocket</StyledExternalLink>.
        </StepContent>

        <StepTitle>
          <StepNumber>3.</StepNumber>
          Configure the Network with the Following Details:
        </StepTitle>
        <NetworkDetails>
          <NetworkItem>
            <strong>Network Name:</strong>
            <Highlight>DeepBrainChain Mainnet</Highlight>
          </NetworkItem>
          <NetworkItem>
            <strong>Chain RPC URL:</strong>
            <StyledExternalLink href="https://rpc.dbcwallet.io">
              https://rpc.dbcwallet.io
            </StyledExternalLink>
          </NetworkItem>
          <NetworkItem>
            <strong>Chain ID:</strong>
            <Highlight>19880818</Highlight>
          </NetworkItem>
          <NetworkItem>
            <strong>Currency Symbol:</strong>
            <Highlight>DBC</Highlight>
          </NetworkItem>
        </NetworkDetails>

        <StepTitle>
          <StepNumber>4.</StepNumber>
          Withdraw DBC from Gate.io
        </StepTitle>
        <StepContent>
          When withdrawing, choose <Highlight>DBC EVM</Highlight> as the network.
        </StepContent>
      </ContentCard>
    </Container>
  )
} 