import React, {lazy} from 'react'
import styled from 'react-emotion'
import {Route} from 'react-router'
import {matchPath, RouteComponentProps, Switch, withRouter} from 'react-router-dom'
import TeamSettingsToggleNav from 'universal/modules/teamDashboard/components/TeamSettingsToggleNav/TeamSettingsToggleNav'

const TeamSettings = lazy(() =>
  import(/* webpackChunkName: 'TeamSettingsRoot' */ 'universal/modules/teamDashboard/components/TeamSettingsRoot')
)
const Providers = lazy(() =>
  import(/* webpackChunkName: 'TeamIntegrationsRoot' */ 'universal/modules/teamDashboard/containers/TeamIntegrationsRoot/TeamIntegrationsRoot')
)
const SlackIntegrations = lazy(() =>
  import(/* webpackChunkName: 'SlackIntegrationsRoot' */ 'universal/modules/teamDashboard/containers/SlackIntegrationsRoot/SlackIntegrationsRoot')
)

interface Props extends RouteComponentProps<{teamId: string}> {
  teamMemberId: string
}

const IntegrationPage = styled('div')({
  alignItems: 'center',
  padding: '0 16px',
  display: 'flex',
  flexDirection: 'column'
})
const TeamSettingsWrapper = (props: Props) => {
  const {
    location: {pathname},
    match,
    teamMemberId
  } = props
  const {
    params: {teamId}
  } = match
  const areaMatch = matchPath(pathname, {path: `${match.url}/:area?`}) || {params: {area: ''}}
  return (
    <IntegrationPage>
      <TeamSettingsToggleNav activeKey={(areaMatch.params as any).area || ''} teamId={teamId} />
      <Switch>
        <Route exact path={match.url} render={(p) => <TeamSettings {...p} teamId={teamId} />} />
        <Route
          path={`${match.url}/integrations/slack`}
          render={(p) => <SlackIntegrations {...p} teamMemberId={teamMemberId} />}
        />
        />
        <Route
          exact
          path={`${match.url}/integrations`}
          render={(p) => <Providers {...p} teamMemberId={teamMemberId} />}
        />
        />
      </Switch>
    </IntegrationPage>
  )
}

export default withRouter(TeamSettingsWrapper)
