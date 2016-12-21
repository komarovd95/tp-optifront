import React, { Component, PropTypes } from 'react';
import Animation from '../../commons/Animation';


class Profile extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  render() {
    return (
      <Animation>
        <div className="ui padded grid" style={{ height: '100%' }}>
          <div className="row" style={{ flex: 1, overflowY: 'auto', background: '#dadada' }}>
            <div className="sixteen wide column">
              <div className="ui raised segment">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </Animation>
    );
  }
}

export default Profile;
