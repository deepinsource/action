import {NewMeetingSummary_viewer} from '__generated__/NewMeetingSummary_viewer.graphql'
import React from 'react'
import Helmet from 'react-helmet'
import {createFragmentContainer, graphql} from 'react-relay'
import ui from 'universal/styles/ui'
import {MEETING_SUMMARY_LABEL} from 'universal/utils/constants'
import makeHref from 'universal/utils/makeHref'
import {meetingTypeToLabel, meetingTypeToSlug} from 'universal/utils/meetings/lookups'
import {demoTeamId} from 'universal/modules/demo/initDB'
import MeetingSummaryEmail from 'universal/modules/email/components/SummaryEmail/MeetingSummaryEmail/MeetingSummaryEmail'

interface Props {
  viewer: NewMeetingSummary_viewer
  urlAction?: 'csv' | undefined
}

const NewMeetingSummary = (props: Props) => {
  const {
    urlAction,
    viewer: {newMeeting}
  } = props
  const {
    id: meetingId,
    meetingNumber,
    meetingType,
    team: {id: teamId, name: teamName}
  } = newMeeting
  const meetingLabel = meetingTypeToLabel[meetingType]
  const title = `${meetingLabel} Meeting ${MEETING_SUMMARY_LABEL} | ${teamName} ${meetingNumber}`
  const slug = meetingTypeToSlug[meetingType]
  const meetingUrl = makeHref(`/${slug}/${teamId}`)
  const teamDashUrl = `/team/${teamId}`
  const emailCSVUrl = `/new-summary/${meetingId}/csv`
  return (
    <div style={{backgroundColor: ui.emailBackgroundColor, minHeight: '100vh'}}>
      <Helmet title={title} />
      <MeetingSummaryEmail
        urlAction={urlAction}
        isDemo={teamId === demoTeamId}
        meeting={newMeeting}
        referrer='meeting'
        meetingUrl={meetingUrl}
        teamDashUrl={teamDashUrl}
        emailCSVUrl={emailCSVUrl}
      />
    </div>
  )
}

export default createFragmentContainer(
  NewMeetingSummary,
  graphql`
    fragment NewMeetingSummary_viewer on User {
      newMeeting(meetingId: $meetingId) {
        ...MeetingSummaryEmail_meeting
        id
        team {
          id
          name
        }
        meetingType
        meetingNumber
      }
    }
  `
)
