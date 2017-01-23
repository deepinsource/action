import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import Avatar from 'universal/components/Avatar/Avatar';

const DashboardAvatars = (props) => {
  const {teamMembers, styles} = props;
  return (
    <div className={css(styles.root)}>
      {
        teamMembers.map((avatar, index) =>
          <div className={css(styles.item)} key={`dbAvatar${index}`}>
            <Avatar {...avatar} hasBadge  isConnected={avatar.presence.length > 0} size="smaller" />
          </div>
        )
      }
    </div>
  );
};

DashboardAvatars.propTypes = {
  styles: PropTypes.object,
  teamMembers: PropTypes.array
};

const styleThunk = () => ({
  root: {
    fontSize: 0,
    paddingBottom: '1rem',
    position: 'relative',
    textAlign: 'right',
    width: '100%'
  },

  item: {
    display: 'inline-block',
    margin: '0 .75rem',
    position: 'relative',
    verticalAlign: 'middle'
  }
});

export default withStyles(styleThunk)(DashboardAvatars);
