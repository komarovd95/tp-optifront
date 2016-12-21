import React from 'react';
import CarsListContainer from '../cars/list';


export default class CarsListProfilePage extends React.Component {
  render() {
    return (
      <div className="ui grid" style={{ height: '100%', flexDirection: 'column' }}>
        <div className="one column row">
          <div className="column">
            <h2 className="ui dividing header">
              Автомобили
            </h2>
          </div>
        </div>
        <div className="one column row" style={{ flex: '1' }}>
          <div className="column">
            <CarsListContainer/>
          </div>
        </div>
      </div>
    );
  }
}
