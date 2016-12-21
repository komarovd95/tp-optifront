import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { set } from '../settings';


class RouteSettings extends Component {
  static propTypes = {
    settings: PropTypes.shape({
      lights: PropTypes.bool,
      length: PropTypes.bool,
      coverTypes: PropTypes.bool,
      streetNames: PropTypes.bool,
      limits: PropTypes.bool,
      traffic: PropTypes.bool
    }).isRequired,
    setSettings: PropTypes.func.isRequired
  };

  handleChange(propertyName) {
    this.props.setSettings(propertyName);
  }

  render() {
    const { settings } = this.props;

    return (
      <div className="ui raised segment route-settings">
        <h4>Настройки карты</h4>
        <form className="ui form">
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.lights}
                     onChange={this.handleChange.bind(this, "lights")}/>
              <label>Показывать светофоры</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.length}
                     onChange={this.handleChange.bind(this, "length")}/>
              <label>Показывать длину участков</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.coverTypes}
                     onChange={this.handleChange.bind(this, "coverTypes")}/>
              <label>Показывать тип покрытия</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.streetNames}
                     onChange={this.handleChange.bind(this, "streetNames")}/>
              <label>Показывать названия улиц</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.limits}
                     onChange={this.handleChange.bind(this, "limits")}/>
              <label>Показывать ограничение скорости</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.traffic}
                     onChange={this.handleChange.bind(this, "traffic")}/>
              <label>Показывать пробки</label>
            </div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" defaultChecked={settings.police}
                     onChange={this.handleChange.bind(this, "police")}/>
              <label>Показывать патрульных</label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


export default connect(
  state => ({
    settings: state.routes.view.settings
  }),
  dispatch => ({
    setSettings: settingName => dispatch(set(settingName))
  })
)(RouteSettings);
