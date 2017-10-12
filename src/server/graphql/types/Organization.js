import {GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import getRethink from 'server/database/rethinkDriver';
import CreditCard from 'server/graphql/types/CreditCard';
import GraphQLISO8601Type from 'server/graphql/types/GraphQLISO8601Type';
import GraphQLURLType from 'server/graphql/types/GraphQLURLType';
import OrgUser from 'server/graphql/types/OrgUser';
import OrgUserCount from 'server/graphql/types/OrgUserCount';
import TierEnum from 'server/graphql/types/TierEnum';
import User from 'server/graphql/types/User';
import {BILLING_LEADER} from 'universal/utils/constants';


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
      description: 'The safe credit card details'
    },
    name: {type: GraphQLString, description: 'The name of the organization'},
    picture: {
      type: GraphQLURLType,
      description: 'The org avatar'
    },
    tier: {
      type: TierEnum,
      description: 'The level of access to features on the parabol site'
    },
    periodEnd: {
      type: GraphQLISO8601Type,
      description: 'THe datetime the current billing cycle ends'
    },
    periodStart: {
      type: GraphQLISO8601Type,
      description: 'The datetime the current billing cycle starts'
    },

    stripeId: {
      type: GraphQLID,
      description: 'The customerId from stripe'
    },
    stripeSubscriptionId: {
      type: GraphQLID,
      description: 'The subscriptionId from stripe'
    },
    updatedAt: {
      type: GraphQLISO8601Type,
      description: 'The datetime the organization was last updated'
    },
    orgUsers: {
      type: new GraphQLList(OrgUser),
      description: 'The users that belong to this org'
    },
    orgUserCount: {
      type: OrgUserCount,
      description: 'The count of active & inactive users',
      resolve: async (source) => {
        const {orgUserCount, id} = source;
        const r = getRethink();
        if (orgUserCount) return orgUserCount;
        return r.table('Organization').get(id)
          .do((org) => {
            return org('orgUsers')
              .filter({inactive: true})
              .count()
              .default(0)
              .do((inactiveUserCount) => {
                return {
                  activeUserCount: org('orgUsers').count().sub(inactiveUserCount),
                  inactiveUserCount
                };
              });
          });
      }
    },
    /* GraphQL Sugar */
    billingLeaders: {
      type: new GraphQLList(User),
      description: 'The leaders of the org',
      resolve: async ({id}) => {
        const r = getRethink();
        return r.table('User')
          .getAll(id, {index: 'userOrgs'})
          .filter((user) => user('userOrgs')
            .contains((userOrg) => userOrg('id').eq(id).and(userOrg('role').eq(BILLING_LEADER))))
          .run();
      }
    }
  })
});

export default Organization;
