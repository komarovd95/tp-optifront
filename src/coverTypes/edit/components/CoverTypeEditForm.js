import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { browserHistory } from 'react-router';
import shortid from 'shortid';
import CoverTypeEditText from './CoverTypeEditText';
import CoverTypeEditNumber from './CoverTypeEditNumber';


class CoverTypeEditForm extends Component {
  static propTypes = {
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    loadCoverType: PropTypes.func.isRequired,
    resetCoverType: PropTypes.func.isRequired,
    params: PropTypes.shape({
      coverTypeId: PropTypes.string
    }).isRequired,
    saveCoverType: PropTypes.func.isRequired,
    deleteCoverType: PropTypes.func.isRequired
  };


  componentWillMount() {
    if (this.props.params.coverTypeId) {
      this.coverTypeId = this.props.params.coverTypeId;
    } else {
      this.coverTypeId = 'new';
    }
  }

  componentDidMount() {
    this.props.loadCoverType(this.coverTypeId);
  }

  componentWillUnmount() {
    this.props.resetCoverType();
  }

  handleSubmit = values => this.props.saveCoverType(this.coverTypeId, values)
    .then(() => browserHistory.goBack())
    .catch(() => {});

  render() {
    const {
      handleSubmit, pristine, submitting, asyncValidating, formErrors, error, deleteCoverType
    } = this.props;

    let errors = [];

    if (formErrors) {
      errors = Object.keys(formErrors)
        .map(key => formErrors[key])
        .filter(e => e)
        .reduce((arr, e) => arr.concat(e), []);
    }

    if (error) {
      errors.push(error);
    }

    const loading = submitting || asyncValidating;

    return (
      <div className="ui padded grid">
        <div className="one center aligned column row">
          <div className="column">
            <h3 className="ui icon header">
              <i className="configure icon"/>
              <div className="content">
                {this.coverTypeId === 'new' ? 'Создать' : 'Редактировать'} тип покрытия
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>

              <Field name="coverTypeName" label="Тип покрытия" component={CoverTypeEditText}/>
              <Field name="slowdown" label="Коэфф. замедления" component={CoverTypeEditNumber}
                     min={0} max={1} step={0.01}/>

              <div className="row">
                <div className="eight wide column"/>
                <div className="eight wide column">
                  <div className="ui error message">
                    <ul className="list">
                      {errors.map(e => <li key={shortid.generate()}>{e}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="eight wide column" style={{ textAlign: 'right' }}>
                  <button className={`ui positive ${loading ? 'loading' : ''} button`}
                          disabled={loading || pristine || errors.length > 0}>
                    Сохранить
                  </button>
                </div>
                <div className="eight wide column">
                  {(this.coverTypeId !== 'new') && (
                    <a className="ui negative button" onClick={deleteCoverType}>
                      Удалить
                    </a>
                  )}
                  <a className="ui button" onClick={() => browserHistory.goBack()}>
                    Отмена
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CoverTypeEditForm;
