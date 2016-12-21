import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCarToUser, removeCarFromUser } from '../list';
import { Car } from '../../model';


class CarsListAddButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(Car),
    addCar: PropTypes.func.isRequired,
    removeCar: PropTypes.func.isRequired
  };

  state = {
    loading: false
  };

  handleAddClick = () => {
    this.setState({ loading: true });
    this.props.addCar(this.props.item)
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  };

  handleRemoveClick = () => {
    this.setState({ loading: true });
    this.props.removeCar(this.props.item)
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    const { item: car } = this.props;
    const { loading } = this.state;

    if (car.owned) {
      return (
        <button className={`ui negative icon labeled tiny ${loading ? 'loading' : ''} button`}
                onClick={this.handleRemoveClick}
                disabled={loading}>
          <i className="remove icon"/> Удалить
        </button>
      );
    } else {
      return (
        <button className={`ui positive icon labeled tiny ${loading ? 'loading' : ''} button`}
                onClick={this.handleAddClick}
                disabled={loading}>
          <i className="plus icon"/> Добавить
        </button>
      );
    }
  }
}

export default connect(null,
  dispatch => ({
    addCar: car => dispatch(addCarToUser(car)),
    removeCar: car => dispatch(removeCarFromUser(car))
  })
)(CarsListAddButton);
