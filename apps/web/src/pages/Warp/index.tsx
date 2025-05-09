import { useWeb3React } from '@web3-react/core'
import { Trace } from 'analytics'
import { ButtonPrimary } from 'components/Button'
import { DarkCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { ThemedText } from 'theme/components'
import styled from 'styled-components'
import { useCallback, useState } from 'react'
import { Trans } from 'i18n'
import { NumberType, useFormatter } from 'utils/formatNumbers'
import { useToggleAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    max-width: 800px;
    padding-top: 48px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    max-width: 500px;
    padding-top: 20px;
  }
`

const InputWrapper = styled(DarkCard)`
  padding: 24px;
  gap: 16px;
  display: flex;
  flex-direction: column;
`

const StyledInput = styled.input`
  font-size: 24px;
  line-height: 44px;
  padding: 0 12px;
  background: ${({ theme }) => theme.surface2};
  color: ${({ theme }) => theme.neutral1};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 12px;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.accent1};
  }
`

export default function WarpPage() {
  const { account } = useWeb3React()
  const [amount, setAmount] = useState('')
  const toggleWalletDrawer = useToggleAccountDrawer()
  const { formatNumber } = useFormatter()

  const handleWarp = useCallback(() => {
    // TODO: 实现Warp逻辑
    console.log('Warp amount:', amount)
  }, [amount])

  return (
    <Trace page="warp">
      <PageWrapper gap="lg">
        <RowBetween>
          <ThemedText.HeadlineLarge>
            <Trans>Warp</Trans>
          </ThemedText.HeadlineLarge>
        </RowBetween>

        <InputWrapper>
          <ThemedText.SubHeader>
            <Trans>输入Warp金额</Trans>
          </ThemedText.SubHeader>
          
          <StyledInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />

          {!account ? (
            <ButtonPrimary onClick={toggleWalletDrawer}>
              <Trans>连接钱包</Trans>
            </ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleWarp}>
              <Trans>Warp</Trans>
            </ButtonPrimary>
          )}
        </InputWrapper>
      </PageWrapper>
    </Trace>
  )
} 