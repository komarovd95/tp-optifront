import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { browserHistory } from 'react-router';
import shortid from 'shortid';
import BrandEditText from './BrandEditText';


class BrandEditForm extends Component {
  static propTypes = {
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    loadBrand: PropTypes.func.isRequired,
    resetBrand: PropTypes.func.isRequired,
    params: PropTypes.shape({
      brandId: PropTypes.string
    }).isRequired,
    saveBrand: PropTypes.func.isRequired,
    deleteBrand: PropTypes.func.isRequired
  };


  componentWillMount() {
    if (this.props.params.brandId) {
      this.brandId = this.props.params.brandId;
    } else {
      this.brandId = 'new';
    }
  }

  componentDidMount() {
    this.props.loadBrand(this.brandId);
  }

  componentWillUnmount() {
    this.props.resetBrand();
  }

  handleSubmit = values => this.props.saveBrand(this.brandId, values)
    .then(() => browserHistory.goBack())
    .catch(() => {});

  render() {
    const {
      handleSubmit, pristine, submitting, asyncValidating, formErrors, error, deleteBrand
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
                {this.brandId === 'new' ? 'Создать' : 'Редактировать'} марку автомобиля
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>

              <Field name="brandName" label="Марка" component={BrandEditText}/>

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
                  {(this.brandId !== 'new') && (
                    <a className="ui negative button" onClick={deleteBrand}>
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

export default BrandEditForm;
