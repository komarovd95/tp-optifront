import React from 'react';


export class AuthFormField extends React.Component {
  render() {
    const {icon, meta: {touched, error, asyncValidating}, input, ...props} = this.props;

    const hasError = touched && error;

    return (
      <div className={`field ${hasError ? 'error' : ''}`}>
        <div className={`ui left icon input ${asyncValidating ? 'loading' : ''}`}>
          <i className={`${icon} icon`}/>
          <input {...props} {...input}/>
        </div>
      </div>
    );
  }
}
