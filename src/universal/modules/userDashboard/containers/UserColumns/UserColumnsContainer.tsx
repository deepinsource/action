import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {createFragmentContainer, graphql} from 'react-relay'
import TaskColumns from 'universal/components/TaskColumns/TaskColumns'
import {USER_DASH} from 'universal/utils/constants'
import getTaskById from 'universal/utils/getTaskById'
import {UserColumnsContainer_viewer} from '__generated__/UserColumnsContainer_viewer.graphql'

const mapStateToProps = (state) => {
  return {
    teamFilterId: state.userDashboard.teamFilterId
  }
}

interface Props {
  teamFilterId: string
  viewer: UserColumnsContainer_viewer
}

const UserColumnsContainer = (props: Props) => {
  const {
    teamFilterId,
    viewer: {contentFilter, tasks}
  } = props
  const filteredTasks = useMemo(() => {
    const contentFilterRegex = new RegExp(contentFilter!, 'i')
    const nodes = tasks.edges.map(({node}) => node)
    const contentFilteredNodes = contentFilter
      ? nodes.filter((task) => {
        return task.contentText && task.contentText.match(contentFilterRegex)
      })
      : nodes

    const teamFilteredNodes = teamFilterId
      ? contentFilteredNodes.filter((node) => node.team.id === teamFilterId)
      : contentFilteredNodes

    return teamFilteredNodes.map((node) => ({
      ...node
    }))
  }, [teamFilterId, tasks, contentFilter])
  {
    const {
      viewer: {teams}
    } = props

    return (
      <TaskColumns
        area={USER_DASH}
        getTaskById={getTaskById(filteredTasks)}
        tasks={filteredTasks}
        teams={teams}
      />
    )
  }
}

export default createFragmentContainer(
  connect(mapStateToProps)(UserColumnsContainer),
  graphql`
    fragment UserColumnsContainer_viewer on User {
      teams {
        id
        name
        meetingId
      }
      contentFilter
      tasks(first: 1000) @connection(key: "UserColumnsContainer_tasks") {
        edges {
          node {
            ...TaskColumns_tasks
            # grab these so we can sort correctly
            id
            content @__clientField(handle: "contentText")
            contentText
            status
            sortOrder
            team {
              id
            }
          }
        }
      }
    }
  `
)
