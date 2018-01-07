import {approveToOrgInvitationUpdater} from 'universal/mutations/ApproveToOrgMutation';
import {cancelTeamInviteInvitationUpdater} from 'universal/mutations/CancelTeamInviteMutation';
import {inviteTeamMembersInvitationUpdater} from 'universal/mutations/InviteTeamMembersMutation';

const subscription = graphql`
  subscription InvitationSubscription($teamId: ID!) {
    invitationSubscription(teamId: $teamId) {
      __typename
      ...ApproveToOrgMutation_invitation
      ...CancelTeamInviteMutation_invitation
      ...InviteTeamMembersMutationAnnounce_invitation
      ...ResendTeamInviteMutation_invitation
    }
  }
`;

const InvitationSubscription = (environment, queryVariables) => {
  const {teamId} = queryVariables;
  return {
    subscription,
    variables: {teamId},
    updater: (store) => {
      const payload = store.getRootField('invitationSubscription');
      const type = payload.getValue('__typename');
      switch (type) {
        case 'ApproveToOrgPayload':
          approveToOrgInvitationUpdater(payload, store);
          break;
        case 'CancelTeamInvitePaylaod':
          cancelTeamInviteInvitationUpdater(payload, store);
          break;
        case 'InviteTeamMembersAnnouncePayload':
          inviteTeamMembersInvitationUpdater(payload, store);
          break;
        default:
          console.error('InvitationSubscription case fail', type);
      }
    }
  };
};

export default InvitationSubscription;
