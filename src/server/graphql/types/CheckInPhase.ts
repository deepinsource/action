import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql'
import CheckInStage from 'server/graphql/types/CheckInStage'
import MeetingGreeting from 'server/graphql/types/MeetingGreeting'
import NewMeetingPhase, {newMeetingPhaseFields} from 'server/graphql/types/NewMeetingPhase'
import {ICheckInPhase} from 'universal/types/graphql'

const CheckInPhase = new GraphQLObjectType({
  name: 'CheckInPhase',
  description: 'The meeting phase where all team members check in one-by-one',
  interfaces: () => [NewMeetingPhase],
  fields: () => ({
    ...newMeetingPhaseFields(),
    checkInGreeting: {
      type: new GraphQLNonNull(MeetingGreeting),
      description: 'The checkIn greeting (fun language)'
    },
    checkInQuestion: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The checkIn question of the week (draft-js format)'
    },
    stages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CheckInStage))),
      resolve: ({phaseType, stages}: ICheckInPhase) => {
        return stages.map((stage) => ({
          ...stage,
          phaseType
        }))
      }
    }
  })
})

export default CheckInPhase
