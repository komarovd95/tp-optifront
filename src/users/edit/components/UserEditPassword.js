import React, { Component, PropTypes } from 'react';


class UserEditPassword extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    input: PropTypes.object,
    label: PropTypes.string
  };

  render() {
    const { name, label, input, meta: { error, touched } } = this.props;

    const hasError = error && touched;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <div className={`field ${hasError ? 'error' : ''}`}>
            <input type="password" id={name} {...input}/>
          </div>
        </div>
      </div>
    );
  }
}

export default UserEditPassword;
