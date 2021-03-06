import {DashAlertOverLimit_viewer} from '__generated__/DashAlertOverLimit_viewer.graphql'
import React from 'react'
import styled from 'react-emotion'
import {createFragmentContainer, graphql} from 'react-relay'
import DashAlertBar from 'universal/components/DashAlertBar'
import DashAlertLink from 'universal/components/DashAlertLink'

const MessageBlock = styled('div')({
  fontWeight: 600
})

const StyledAnchor = DashAlertLink.withComponent('a')

interface Props {
  viewer: DashAlertOverLimit_viewer
}

const DashAlertOverLimit = (props: Props) => {
  const {viewer} = props
  const {overLimitCopy} = viewer
  if (!overLimitCopy) return null
  const extractedEmails = overLimitCopy.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
  const emailStr = extractedEmails ? extractedEmails[0] : null
  const [prefix, suffix] = emailStr ? overLimitCopy.split(emailStr) : [overLimitCopy, '']

  return (
    <DashAlertBar>
      <MessageBlock>{prefix}</MessageBlock>
      <StyledAnchor
        rel='noopener noreferrer'
        target='_blank'
        href={`mailto:${emailStr}?subject=Free extension for growing teams`}
      >
        {emailStr}
      </StyledAnchor>
      <MessageBlock>{suffix}</MessageBlock>
    </DashAlertBar>
  )
}

export default createFragmentContainer(
  DashAlertOverLimit,
  graphql`
    fragment DashAlertOverLimit_viewer on User {
      overLimitCopy
    }
  `
)
