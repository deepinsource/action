import React, {ReactNode} from 'react'
import styled from 'react-emotion'
import {PALETTE} from '../styles/paletteV2'
import Header from './AuthPage/Header'
import BACKGROUND = PALETTE.BACKGROUND
import TEXT = PALETTE.TEXT

const PageContainer = styled('div')({
  alignItems: 'center',
  backgroundColor: BACKGROUND.MAIN,
  color: TEXT.MAIN,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  minHeight: '100vh'
})

const CenteredBlock = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  maxWidth: '100%',
  padding: '2rem 1rem',
  width: '100%'
})

interface Props {
  children: ReactNode
}

function TeamInvitationWrapper (props: Props) {
  const {children} = props
  return (
    <PageContainer>
      <Header />
      <CenteredBlock>{children}</CenteredBlock>
    </PageContainer>
  )
}

export default TeamInvitationWrapper
