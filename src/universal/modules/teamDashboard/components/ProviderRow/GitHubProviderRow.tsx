import {GitHubProviderRow_viewer} from '__generated__/GitHubProviderRow_viewer.graphql'
import React from 'react'
import styled from 'react-emotion'
import {createFragmentContainer, graphql} from 'react-relay'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import FlatButton from 'universal/components/FlatButton'
import GitHubConfigMenu from 'universal/components/GitHubConfigMenu'
import GitHubProviderLogo from 'universal/components/GitHubProviderLogo'
import GitHubSVG from 'universal/components/GitHubSVG'
import Icon from 'universal/components/Icon'
import ProviderCard from 'universal/components/ProviderCard'
import RowActions from 'universal/components/Row/RowActions'
import RowInfo from 'universal/components/Row/RowInfo'
import RowInfoCopy from 'universal/components/Row/RowInfoCopy'
import withAtmosphere, {
  WithAtmosphereProps
} from 'universal/decorators/withAtmosphere/withAtmosphere'
import {MenuPosition} from 'universal/hooks/useCoords'
import useMenu from 'universal/hooks/useMenu'
import {PALETTE} from 'universal/styles/paletteV2'
import {ICON_SIZE} from 'universal/styles/typographyV2'
import {Layout, Providers} from 'universal/types/constEnums'
import {IntegrationServiceEnum} from 'universal/types/graphql'
import handleOpenOAuth from 'universal/utils/handleOpenOAuth'
import withMutationProps, {
  MenuMutationProps,
  WithMutationProps
} from 'universal/utils/relay/withMutationProps'

const StyledButton = styled(FlatButton)({
  borderColor: PALETTE.BORDER.LIGHT,
  color: PALETTE.TEXT.MAIN,
  fontSize: 14,
  fontWeight: 600,
  paddingLeft: 0,
  paddingRight: 0,
  width: '100%'
})

const ProviderActions = styled(RowActions)({
  marginLeft: 'auto',
  paddingLeft: Layout.ROW_GUTTER,
  maxWidth: '10rem'
})

interface Props extends WithAtmosphereProps, WithMutationProps, RouteComponentProps<{}> {
  teamId: string
  viewer: GitHubProviderRow_viewer
}

const MenuButton = styled(FlatButton)({
  color: PALETTE.PRIMARY.MAIN,
  fontSize: ICON_SIZE.MD18,
  height: 24,
  userSelect: 'none',
  marginLeft: 4,
  padding: 0,
  width: 24
})

const StyledIcon = styled(Icon)({
  fontSize: ICON_SIZE.MD18
})

const ListAndMenu = styled('div')({
  display: 'flex',
  position: 'absolute',
  right: 16,
  top: 16
})

const GitHubLogin = styled('div')({})

const ProviderName = styled('div')({
  color: PALETTE.TEXT.MAIN,
  fontSize: 18,
  lineHeight: '24px',
  alignItems: 'center',
  display: 'flex',
  marginRight: 16,
  verticalAlign: 'middle'
})

const GitHubProviderRow = (props: Props) => {
  const {atmosphere, viewer, teamId, submitting, submitMutation, onError, onCompleted} = props
  const mutationProps = {submitting, submitMutation, onError, onCompleted} as MenuMutationProps
  const {githubAuth} = viewer
  const accessToken = (githubAuth && githubAuth.accessToken) || undefined
  const openOAuth = handleOpenOAuth({
    name: IntegrationServiceEnum.GitHubIntegration,
    submitting,
    submitMutation,
    atmosphere,
    onError,
    onCompleted,
    teamId
  })
  const {togglePortal, originRef, menuPortal, menuProps} = useMenu(MenuPosition.UPPER_RIGHT)
  return (
    <ProviderCard>
      <GitHubProviderLogo />
      <RowInfo>
        <ProviderName>{Providers.GITHUB_NAME}</ProviderName>
        <RowInfoCopy>{Providers.GITHUB_DESC}</RowInfoCopy>
      </RowInfo>
      {!accessToken && (
        <ProviderActions>
          <StyledButton key='linkAccount' onClick={openOAuth} palette='warm' waiting={submitting}>
            {'Connect'}
          </StyledButton>
        </ProviderActions>
      )}
      {accessToken && (
        <ListAndMenu>
          <GitHubLogin title={githubAuth!.login}>
            <GitHubSVG />
          </GitHubLogin>
          <MenuButton onClick={togglePortal} innerRef={originRef}>
            <StyledIcon>more_vert</StyledIcon>
          </MenuButton>
          {menuPortal(
            <GitHubConfigMenu menuProps={menuProps} mutationProps={mutationProps} teamId={teamId} />
          )}
        </ListAndMenu>
      )}
    </ProviderCard>
  )
}

graphql`
  fragment GitHubProviderRowViewer on User {
    githubAuth(teamId: $teamId) {
      accessToken
      login
    }
  }
`

export default createFragmentContainer(
  withAtmosphere(withMutationProps(withRouter(GitHubProviderRow))),
  graphql`
    fragment GitHubProviderRow_viewer on User {
      ...GitHubProviderRowViewer @relay(mask: false)
    }
  `
)
