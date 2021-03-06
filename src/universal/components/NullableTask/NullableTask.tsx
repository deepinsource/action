import {convertFromRaw} from 'draft-js'
import React, {useEffect, useMemo} from 'react'
import NullCard from 'universal/components/NullCard/NullCard'
import OutcomeCardContainer from 'universal/modules/outcomeCard/containers/OutcomeCard/OutcomeCardContainer'
import {createFragmentContainer, graphql} from 'react-relay'
import useAtmosphere from 'universal/hooks/useAtmosphere'
import {NullableTask_task} from '__generated__/NullableTask_task.graphql'

interface Props {
  area: string
  hasDragStyles?: boolean
  isAgenda?: boolean
  isDragging?: boolean
  isPreview?: boolean
  measure?: () => void
  task: NullableTask_task
}

const propsAreEqual = (prevProps: Props, nextProps: Props) => {
  const {isPreview, task} = nextProps
  return isPreview
    ? task.status === prevProps.task.status && task.content === prevProps.task.content
    : false
}

const NullableTask = React.memo((props: Props) => {
  const {area, hasDragStyles, isAgenda, task, isDragging} = props
  const {content, createdBy, assignee} = task
  const {preferredName} = assignee
  const contentState = useMemo(() => {
    return convertFromRaw(JSON.parse(content))
  }, [content])

  const atmosphere = useAtmosphere()
  useEffect(() => {
    let isMounted = true
    setTimeout(() => {
      isMounted && props.measure && props.measure()
    })
    return () => {
      isMounted = false
    }
  }, [])

  const showOutcome = contentState.hasText() || createdBy === atmosphere.viewerId
  return showOutcome ? (
    <OutcomeCardContainer
      area={area}
      contentState={contentState}
      hasDragStyles={hasDragStyles}
      isDragging={isDragging}
      isAgenda={isAgenda}
      task={task}
    />
  ) : (
    <NullCard preferredName={preferredName} />
  )
}, propsAreEqual)

export default createFragmentContainer(
  NullableTask,
  graphql`
    fragment NullableTask_task on Task {
      content
      createdBy
      status
      assignee {
        ... on TeamMember {
          preferredName
        }
      }
      ...OutcomeCardContainer_task
    }
  `
)
