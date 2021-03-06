import {GraphQLObjectType} from 'graphql'
import StandardMutationError from 'server/graphql/types/StandardMutationError'
import {getUserId} from '../../utils/authorization'
import AtlassianAuth from './AtlassianAuth'
import User from './User'

const AddAtlassianAuthPayload = new GraphQLObjectType({
  name: 'AddAtlassianAuthPayload',
  fields: () => ({
    error: {
      type: StandardMutationError
    },
    atlassianAuth: {
      type: AtlassianAuth,
      description: 'The newly created auth',
      resolve: async ({atlassianAuthId}, _args, {dataLoader}) => {
        return dataLoader.get('atlassianAuths').load(atlassianAuthId)
      }
    },
    user: {
      type: User,
      description: 'The user with updated atlassianAuth',
      resolve: (_source, _args, {authToken, dataLoader}) => {
        const viewerId = getUserId(authToken)
        return dataLoader.get('users').load(viewerId)
      }
    }
  })
})

export default AddAtlassianAuthPayload
