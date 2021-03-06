import {NewMeetingAvatarMenu_newMeeting} from '__generated__/NewMeetingAvatarMenu_newMeeting.graphql'
import {NewMeetingAvatarMenu_teamMember} from '__generated__/NewMeetingAvatarMenu_teamMember.graphql'
import React from 'react'
import {createFragmentContainer, graphql} from 'react-relay'
import DropdownMenuLabel from 'universal/components/DropdownMenuLabel'
import MenuItem from 'universal/components/MenuItem'
import Menu from 'universal/components/Menu'
import withAtmosphere, {
  WithAtmosphereProps
} from 'universal/decorators/withAtmosphere/withAtmosphere'
import {MenuProps} from 'universal/hooks/useMenu'
import PromoteNewMeetingFacilitatorMutation from 'universal/mutations/PromoteNewMeetingFacilitatorMutation'
import {LOBBY} from 'universal/utils/constants'
import {phaseLabelLookup} from 'universal/utils/meetings/lookups'
import UNSTARTED_MEETING from 'universal/utils/meetings/unstartedMeeting'

interface Props extends WithAtmosphereProps {
  newMeeting: NewMeetingAvatarMenu_newMeeting
  teamMember: NewMeetingAvatarMenu_teamMember
  menuProps: MenuProps
  handleNavigate?: () => void
}

const NewMeetingAvatarMenu = (props: Props) => {
  const {atmosphere, newMeeting, teamMember, menuProps, handleNavigate} = props
  const meeting = newMeeting || UNSTARTED_MEETING
  const {localPhase, facilitatorUserId, meetingId} = meeting
  const {meetingMember, isConnected, isSelf, preferredName, userId} = teamMember
  const isCheckedIn = meetingMember ? meetingMember.isCheckedIn : null
  const connected = isConnected ? 'connected' : 'disconnected'
  const checkedIn = isCheckedIn ? ' and checked in' : ''
  const headerLabel = `${isSelf ? 'You are' : `${preferredName} is`} ${connected} ${checkedIn}`
  const promoteToFacilitator = () => {
    PromoteNewMeetingFacilitatorMutation(atmosphere, {facilitatorUserId: userId, meetingId})
  }
  const avatarIsFacilitating = teamMember.userId === facilitatorUserId
  const handlePromote = isConnected ? promoteToFacilitator : undefined
  const phaseLabel = localPhase ? phaseLabelLookup[localPhase.phaseType] : LOBBY
  const owner = isSelf ? 'your' : `${preferredName}’s`
  return (
    <Menu ariaLabel={'Select what to do with this team member'} {...menuProps}>
      <DropdownMenuLabel>{headerLabel}</DropdownMenuLabel>
      {handleNavigate && (
        <MenuItem
          key='handleNavigate'
          label={`See ${owner} ${phaseLabel}`}
          onClick={handleNavigate}
        />
      )}
      {localPhase &&
        !avatarIsFacilitating &&
        !window.location.pathname.startsWith('/retrospective-demo') && (
          <MenuItem
            key='promoteToFacilitator'
            label={`Promote ${isSelf ? 'yourself' : preferredName} to Facilitator`}
            onClick={handlePromote}
          />
        )}
    </Menu>
  )
}

export default createFragmentContainer(
  withAtmosphere(NewMeetingAvatarMenu),
  graphql`
    fragment NewMeetingAvatarMenu_newMeeting on NewMeeting {
      meetingId: id
      facilitatorUserId
      localPhase {
        phaseType
      }
    }

    fragment NewMeetingAvatarMenu_teamMember on TeamMember {
      meetingMember {
        isCheckedIn
      }
      isConnected
      isSelf
      preferredName
      userId
    }
  `
)
