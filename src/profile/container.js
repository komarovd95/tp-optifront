import React, { Component, PropTypes } from 'react';
import Animation from '../commons/Animation';
import Profile from './components/Profile';
import ProfileSidebar from './components/ProfileSideBar';
import { connect } from 'react-redux';
import { fetchUser } from '../users/profile/profile';
import { PathUser } from '../users/model';
import { isUserEditable } from '../users/selectors';
import { SecuredComponent } from '../users/auth';


class ProfileContainer extends Component {
  static propTypes = {
    params: PropTypes.shape({
      userId: PropTypes.string
    }).isRequired,
    isEditable: PropTypes.bool,
    loggedUser: PropTypes.instanceOf(PathUser),
    fetchedUser: PropTypes.instanceOf(PathUser),
    fetchUser: PropTypes.func.isRequired,
    resetUser: PropTypes.func.isRequired,
    children: PropTypes.element
  };

  componentWillMount() {
    this.props.fetchUser(this.props.params.userId || this.props.loggedUser.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.userId && this.props.params.userId !== nextProps.params.userId) {
      this.props.fetchUser(nextProps.params.userId);
    }
  }

  componentWillUnmount() {
    this.props.resetUser();
  }

  render() {
    const { fetchedUser, isEditable, children } = this.props;

    return (
      <Animation>
        <div className="profile-page">
          <div className="profile-sidebar">
            <ProfileSidebar user={fetchedUser} isEditable={isEditable} />
          </div>
          <div className="profile-content">
            <Profile>
              {children}
            </Profile>
          </div>
        </div>
      </Animation>
    );
  }
}

export default SecuredComponent(
  connect(
    state => ({
      loggedUser: state.auth.user,
      fetchedUser: state.users.profile.user,
      isEditable: isUserEditable(state)
    }),
    dispatch => ({
      fetchUser: id => dispatch(fetchUser(id)),
      resetUser: () => console.log('reseted!!!')
    })
  )(ProfileContainer)
);
