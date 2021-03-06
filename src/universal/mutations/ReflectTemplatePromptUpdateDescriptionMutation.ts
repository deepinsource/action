import {ReflectTemplatePromptUpdateDescriptionMutation} from '__generated__/ReflectTemplatePromptUpdateDescriptionMutation.graphql'
import {commitMutation, graphql} from 'react-relay'
import {Disposable} from 'relay-runtime'
import Atmosphere from 'universal/Atmosphere'
import {IReflectTemplatePromptUpdateDescriptionOnMutationArguments} from 'universal/types/graphql'
import {LocalHandlers} from '../types/relayMutations'

graphql`
  fragment ReflectTemplatePromptUpdateDescriptionMutation_team on ReflectTemplatePromptUpdateDescriptionPayload {
    prompt {
      description
    }
  }
`

const mutation = graphql`
  mutation ReflectTemplatePromptUpdateDescriptionMutation($promptId: ID!, $description: String!) {
    reflectTemplatePromptUpdateDescription(promptId: $promptId, description: $description) {
      error {
        message
      }
      ...ReflectTemplatePromptUpdateDescriptionMutation_team @relay(mask: false)
    }
  }
`

const ReflectTemplatePromptUpdateDescriptionMutation = (
  atmosphere: Atmosphere,
  variables: IReflectTemplatePromptUpdateDescriptionOnMutationArguments,
  {onError, onCompleted}: LocalHandlers
): Disposable => {
  return commitMutation<ReflectTemplatePromptUpdateDescriptionMutation>(atmosphere, {
    mutation,
    variables,
    onCompleted,
    onError,
    optimisticUpdater: (store) => {
      const {description, promptId} = variables
      const prompt = store.get(promptId)
      if (!prompt) return
      prompt.setValue(description, 'description')
    }
  })
}

export default ReflectTemplatePromptUpdateDescriptionMutation
