import { t } from 'i18n'
import { useProposals } from 'pages/Stake/hooks/romulus/useProposals'
import React, { useEffect, useState } from 'react'
import { Box, Card, Text } from 'rebass'
import styled from 'styled-components'
import Loader from '../Loader'
import Modal from '../Modal'
import { ProposalCard } from './Proposals/ProposalCard'

import { CloseIcon } from 'theme/components'
import { RowBetween } from '../Row'

const DetailsHeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 24px 20px 4px 20px;
`

const ModalBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

const ProposalContainer = styled(Box)`
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => `${theme.primary5}`};
  padding: 4px;
`

const DetailsContainer = styled.div`
  overflow-y: auto;
`

interface ViewProposalModalProps {
  proposalId: string
  isNewContract: boolean
  isOpen: boolean
  onDismiss: () => void
}

export const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  isOpen,
  onDismiss,
  proposalId,
  isNewContract,
}: ViewProposalModalProps) => {
  const [proposal, setProposal] = useState<any>(undefined)
  const proposals = useProposals()

  useEffect(() => {
    if (proposals && proposals.length > 1) {
      const foundProp = proposals.find(
        (prop) => prop.args.id.toString() === proposalId && prop.blockNumber > (isNewContract ? 25_000_000 : 0)
      )
      setProposal(foundProp)
    }
  }, [proposalId, proposals, isNewContract])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {proposal ? (
        <ModalBodyWrapper>
          <RowBetween style={{ padding: '16px' }}>
            <Text fontWeight={500} fontSize={16}>
              View Proposal
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <ProposalContainer>
            <ProposalCard proposalEvent={proposal} clickable={false} showId={true} showAuthor={true} outline={false} />
          </ProposalContainer>
          <DetailsContainer>
            <DetailsHeaderContainer>
              <Text fontWeight={600} fontSize={16}>
                {t`Details`}
              </Text>
            </DetailsHeaderContainer>

            <Box style={{ margin: '8px 20px', paddingBottom: '24px', fontSize: '14px' }}>
              <Card>
                <Box mb={1}>
                  <Text>
                    {proposal.args.description === ''
                      ? 'No description.'
                      : proposal.args.description.split('\n').map((line: any, idx: number) => (
                          <Text
                            sx={{
                              display: 'block',
                              overflowWrap: 'anywhere',
                              paddingBottom: '8px',
                            }}
                            key={idx}
                          >
                            {line}
                          </Text>
                        ))}
                  </Text>
                </Box>
              </Card>
            </Box>
          </DetailsContainer>
        </ModalBodyWrapper>
      ) : (
        <>
          <Box style={{ margin: '45px', padding: '128px' }}>
            <Loader size="48px"></Loader>
          </Box>
        </>
      )}
    </Modal>
  )
}
