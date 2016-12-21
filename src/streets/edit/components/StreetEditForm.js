import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { browserHistory } from 'react-router';
import shortid from 'shortid';
import StreetEditText from './StreetEditText';
import StreetEditSelect from './StreetEditSelect';


class StreetEditForm extends Component {
  static propTypes = {
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    loadCache: PropTypes.func.isRequired,
    loadStreet: PropTypes.func.isRequired,
    resetStreet: PropTypes.func.isRequired,
    streetTypes: PropTypes.array,
    params: PropTypes.shape({
      streetId: PropTypes.string
    }).isRequired,
    saveStreet: PropTypes.func.isRequired,
    deleteStreet: PropTypes.func.isRequired
  };

  static defaultProps = {
    streetTypes: []
  };


  componentWillMount() {
    if (this.props.params.streetId) {
      this.streetId = this.props.params.streetId;
    } else {
      this.streetId = 'new';
    }
  }

  componentDidMount() {
    this.props.loadCache()
      .then(() => this.props.loadStreet(this.streetId));
  }

  componentWillUnmount() {
    this.props.resetStreet();
  }

  handleSubmit = values => this.props.saveStreet(this.streetId, values)
    .then(() => browserHistory.goBack())
    .catch(() => {});

  render() {
    const {
      handleSubmit, pristine, submitting, asyncValidating, formErrors, error, deleteStreet,
      streetTypes
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
                {this.streetId === 'new' ? 'Создать' : 'Редактировать'} улицу
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>

              <Field name="streetType" label="Тип улицы" component={StreetEditSelect}>
                <option value="">Тип улицы</option>
                {streetTypes.map(type =>
                  <option value={type} key={shortid.generate()}>{type}</option>
                )}
              </Field>
              <Field name="streetName" label="Название улицы" component={StreetEditText}/>


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
                  {(this.streetId !== 'new') && (
                    <a className="ui negative button" onClick={deleteStreet}>
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

export default StreetEditForm;
