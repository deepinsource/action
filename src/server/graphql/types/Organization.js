import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
import {forwardConnectionArgs} from 'graphql-relay'
import CreditCard from 'server/graphql/types/CreditCard'
import GraphQLISO8601Type from 'server/graphql/types/GraphQLISO8601Type'
import GraphQLURLType from 'server/graphql/types/GraphQLURLType'
import OrgUserCount from 'server/graphql/types/OrgUserCount'
import TierEnum from 'server/graphql/types/TierEnum'
import User from 'server/graphql/types/User'
import {BILLING_LEADER} from 'universal/utils/constants'
import {resolveForBillingLeaders} from 'server/graphql/resolvers'
import Team from 'server/graphql/types/Team'
import {OrganizationUserConnection} from 'server/graphql/types/OrganizationUser'
import {getUserId, isSuperUser, isUserBillingLeader} from 'server/utils/authorization'

const Organization = new GraphQLObjectType({
  name: 'Organization',
  description: 'An organization',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The unique organization ID'},
    createdAt: {
      type: new GraphQLNonNull(GraphQLISO8601Type),
      description: 'The datetime the organization was created'
    },
    creditCard: {
      type: CreditCard,
      description: 'The safe credit card details',
      resolve: resolveForBillingLeaders('creditCard')
    },
    isBillingLeader: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'true if the viewer is the billing leader for the org',
      resolve: async ({id: orgId}, args, {authToken, dataLoader}) => {
        const viewerId = getUserId(authToken)
        return isUserBillingLeader(viewerId, orgId, dataLoader)
      }
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the organization'
    },
    picture: {
      type: GraphQLURLType,
      description: 'The org avatar'
    },
    teams: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Team))),
      description: 'all the teams the viewer is on in the organization',
      resolve: async ({id: orgId}, args, {authToken, dataLoader}) => {
        const allTeamsOnOrg = await dataLoader.get('teamsByOrgId').load(orgId)
        return isSuperUser(authToken)
          ? allTeamsOnOrg
          : allTeamsOnOrg.filter((team) => authToken.tms.includes(team.id))
      }
    },
    tier: {
      type: TierEnum,
      description: 'The level of access to features on the parabol site'
    },
    periodEnd: {
      type: GraphQLISO8601Type,
      description: 'THe datetime the current billing cycle ends',
      resolve: resolveForBillingLeaders('periodEnd')
    },
    periodStart: {
      type: GraphQLISO8601Type,
      description: 'The datetime the current billing cycle starts',
      resolve: resolveForBillingLeaders('periodStart')
    },
    retroMeetingsOffered: {
      deprecationReason: 'Unlimited retros for all!',
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The total number of retroMeetings given to the team'
    },
    retroMeetingsRemaining: {
      deprecationReason: 'Unlimited retros for all!',
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of retro meetings that can be run (if not pro)'
    },
    stripeId: {
      type: GraphQLID,
      description: 'The customerId from stripe',
      resolve: resolveForBillingLeaders('stripeId')
    },
    stripeSubscriptionId: {
      type: GraphQLID,
      description: 'The subscriptionId from stripe',
      resolve: resolveForBillingLeaders('stripeSubscriptionId')
    },
    upcomingInvoiceEmailSentAt: {
      type: GraphQLISO8601Type,
      description: 'The last upcoming invoice email that was sent, null if never sent'
    },
    updatedAt: {
      type: GraphQLISO8601Type,
      description: 'The datetime the organization was last updated'
    },
    organizationUsers: {
      args: {
        ...forwardConnectionArgs
      },
      type: new GraphQLNonNull(OrganizationUserConnection),
      resolve: async ({id: orgId}, {first}, {dataLoader}) => {
        const organizationUsers = await dataLoader.get('organizationUsersByOrgId').load(orgId)
        organizationUsers.sort((a, b) => (a.orgId > b.orgId ? 1 : -1))
        const edges = organizationUsers.map((node) => ({
          cursor: node.id,
          node
        }))
        // TODO implement pagination
        const firstEdge = edges[0]
        return {
          edges,
          pageInfo: {
            endCursor: firstEdge ? edges[edges.length - 1].cursor : null,
            hasNextPage: false
          }
        }
      }
    },
    orgUserCount: {
      type: new GraphQLNonNull(OrgUserCount),
      description: 'The count of active & inactive users',
      resolve: async ({id: orgId}, _args, {dataLoader}) => {
        const organizationUsers = await dataLoader.get('organizationUsersByOrgId').load(orgId)
        const inactiveUserCount = organizationUsers.filter(({inactive}) => inactive).length
        return {
          inactiveUserCount,
          activeUserCount: organizationUsers.length - inactiveUserCount
        }
      }
    },
    billingLeaders: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      description: 'The leaders of the org',
      resolve: async ({id: orgId}, args, {dataLoader}) => {
        const organizationUsers = await dataLoader.get('organizationUsersByOrgId').load(orgId)
        const billingLeaderUserIds = organizationUsers
          .filter((organizationUser) => organizationUser.role === BILLING_LEADER)
          .map(({userId}) => userId)
        return dataLoader.get('users').loadMany(billingLeaderUserIds)
      }
    }
  })
})

export default Organization
