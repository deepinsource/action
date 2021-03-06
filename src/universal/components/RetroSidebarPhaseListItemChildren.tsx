import {RetroSidebarPhaseListItemChildren_viewer} from '__generated__/RetroSidebarPhaseListItemChildren_viewer.graphql'
import React from 'react'
import {createFragmentContainer, graphql} from 'react-relay'
import RetroSidebarDiscussSection from 'universal/components/RetroSidebarDiscussSection'
import {useGotoStageId} from 'universal/hooks/useMeeting'
import {NewMeetingPhaseTypeEnum} from 'universal/types/graphql'

interface Props {
  gotoStageId: ReturnType<typeof useGotoStageId>
  phaseType: keyof typeof NewMeetingPhaseTypeEnum | string
  viewer: RetroSidebarPhaseListItemChildren_viewer
}

const RetroSidebarPhaseListItemChildren = (props: Props) => {
  const {gotoStageId, phaseType, viewer} = props
  const {team} = viewer
  const {newMeeting} = team!
  if (
    phaseType === NewMeetingPhaseTypeEnum.discuss &&
    newMeeting &&
    newMeeting.localPhase &&
    newMeeting.localPhase.phaseType === phaseType
  ) {
    return <RetroSidebarDiscussSection gotoStageId={gotoStageId} viewer={viewer} />
  }
  return null
}

export default createFragmentContainer(
  RetroSidebarPhaseListItemChildren,
  graphql`
    fragment RetroSidebarPhaseListItemChildren_viewer on User {
      team(teamId: $teamId) {
        newMeeting {
          localPhase {
            phaseType
          }
        }
      }
      ...RetroSidebarDiscussSection_viewer
    }
  `
)
