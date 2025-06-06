import { Trace } from 'analytics'
import { TransferTokenCard } from './components/TransferTokenCard'


export default function WarpPage() {


  return (
    <Trace page="warp">
      <TransferTokenCard />
    </Trace>
  )
} 