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
import { TransferTokenCard } from './components/TransferTokenCard'


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
      <TransferTokenCard />
    </Trace>
  )
} 