import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Field, reduxForm, getFormSyncErrors, formValueSelector } from 'redux-form';
import { getCache } from '../../../cache';
import { updateEdge, removeEdge } from '../manipulation';
import mapNormalizedToArray from '../../../utils/mapNormalizedToArray';
import { validateField } from '../../../forms/actions';


class RouteEdgeEdit extends Component {
  static propTypes = {
    edge: PropTypes.object.isRequired,
    directedRoad: PropTypes.bool,
    formErrors: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    streets: PropTypes.array,
    coverTypes: PropTypes.array
  };

  handleSubmit = values => {
    const { onUpdate, onCancel, edge, coverTypes, streets, directedRoad } = this.props;

    const changeDirection = directedRoad && values.changeDirection;

    onUpdate({
      ...values,
      id: edge.id,
      from: changeDirection ? edge.to : edge.from,
      to: changeDirection ? edge.from : edge.to,
      coverType: coverTypes.find(coverType => coverType.coverTypeName === values.coverType),
      street: streets.find(street => street.streetName === values.street)
    });
    onCancel();
  };

  handleDelete = () => {
    this.props.onRemove(this.props.edge);
    this.props.onCancel();
  };

  render() {
    const {
      pristine, handleSubmit, streets, coverTypes, onCancel, formErrors, directedRoad
    } = this.props;

    const errors = [];
    if (formErrors && formErrors.length) {
      errors.push(formErrors.length);
    }

    if (formErrors && formErrors.limit) {
      errors.push(formErrors.limit);
    }

    if (formErrors && formErrors.coverType) {
      errors.push(formErrors.coverType);
    }

    if (formErrors && formErrors.street) {
      errors.push(formErrors.street);
    }

    return (
      <div className="ui raised segment route-edit-form">
        <h4>Редактирование участка дороги</h4>
        <form className={`ui ${errors.length > 0 ? 'error' : ''} form`}
              onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="field">
            <div className="ui checkbox">
              <Field name="directed" component="input" type="checkbox"/>
              <label>Односторонняя</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <Field name="changeDirection" component="input" type="checkbox"
                     disabled={!directedRoad}/>
              <label>Сменить направление</label>
            </div>
          </div>
          <div className="field">
            <label>Длина</label>
            <Field name="length" component="input" type="number" min={100} max={10000} step={10}/>
          </div>
          <div className="field">
            <label>Ограничение скорости</label>
            <Field name="limit" component="input" type="number" min={20} max={120} step={5}/>
          </div>
          <div className="field">
            <label>Тип покрытия</label>
            <Field name="coverType" component="select">
              <option value="">Тип покрытия</option>
              {coverTypes.map(cT =>
                <option value={cT.coverTypeName} key={shortid.generate()}>
                  {`${cT.coverTypeName} (${cT.slowdown})`}
                </option>
              )}
            </Field>
          </div>
          <div className="field">
            <label>Название улицы</label>
            <Field name="street" component="select">
              <option value="">Название улицы</option>
              {streets.map(s =>
                <option value={s.streetName} key={shortid.generate()}>
                  {`${s.streetType} ${s.streetName}`}
                </option>
              )}
            </Field>
          </div>
          <div className="ui error message">
            <ul className="list">
              {errors.map(e => <li key={shortid.generate()}>{e}</li>)}
            </ul>
          </div>
          <div className="fluid ui buttons">
            <button className="ui primary button" disabled={pristine || errors.length > 0}>
              Сохранить
            </button>
            <a className="ui negative button" onClick={this.handleDelete}>Удалить</a>
            <a className="ui button" onClick={onCancel}>Отмена</a>
          </div>
        </form>
      </div>
    );
  }
}


const validate = values => {
  if (!values) {
    return {};
  }

  const { length, limit, coverType, street } = values;
  const errors = {};

  errors.length = validateField(length, {
    required: {
      message: 'Введите длину участка дороги'
    },
    min: {
      val: 100,
      message: 'Участок дороги не может быть короче 100м'
    },
    max: {
      val: 50000,
      message: 'Участок дороги не может быть длиннее 50000м'
    }
  });

  errors.limit = validateField(limit, {
    min: {
      val: 20,
      message: 'Ограничение скорости не может быть меньше 20 км/ч'
    },
    max: {
      val: 110,
      message: 'Ограничение скорости не может быть больше 110 км/ч'
    }
  });

  errors.coverType = validateField(coverType, {
    required: {
      message: 'Укажите тип покрытия'
    }
  });

  errors.street = validateField(street, {
    required: {
      message: 'Укажите название улицы для участка дороги'
    }
  });

  return errors;
};


const EdgeEditForm = reduxForm({
  form: 'EdgeEditForm',
  enableReinitialize: true,
  validate
})(RouteEdgeEdit);


const getFormErrors = getFormSyncErrors('EdgeEditForm');
const getFormValues = formValueSelector('EdgeEditForm');
const getStreetsCache = getCache('streets');
const getCoverTypesCache = getCache('coverTypes');

export default connect(
  (state, { edge }) => ({
    initialValues: {
      id: edge.id,
      street: edge.street ? edge.street.streetName : '',
      coverType: edge.coverType ? edge.coverType.coverTypeName : '',
      directed: edge.directed,
      length: edge.length,
      limit: edge.limit || 60
    },
    streets: mapNormalizedToArray(getStreetsCache(state)),
    coverTypes: mapNormalizedToArray(getCoverTypesCache(state)),
    formErrors: getFormErrors(state),
    directedRoad: getFormValues(state, 'directed')
  }),
  dispatch => ({
    onUpdate: edge => dispatch(updateEdge(edge)),
    onRemove: edge => dispatch(removeEdge(edge))
  })
)(EdgeEditForm);

