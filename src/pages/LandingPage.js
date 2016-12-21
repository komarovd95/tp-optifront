import React from 'react';
import Animation from '../commons/Animation';
import { Link } from 'react-router';

const LandingPage = () => (
  <Animation>
    <div id="hero" className="ui middle aligned one column centered padded grid">
        <div className="row">
          <div className="column">
            <img src={require('../images/logo.png')} />
            <h1 className="ui huge inverted header">
              Устал от пробок? Мы знаем как проехать быстрее
            </h1>
            <Link to="signup" className="ui violet inverted huge button">
              Присоединяйся
            </Link>
          </div>
        </div>
    </div>
    <div id="landing-content">

      <div className="ui centered stackable grid container">
        <div className="three column row">
          <div className="column">
            <img className="ui medium circular image"
                 src="http://www.freeiconspng.com/uploads/red-square-png-14.png" />
            <h4 className="ui header">Маршруты</h4>
            <p>Создайте свой маршрут или выберите из уже существующих</p>
          </div>
          <div className="column">

            <img className="ui medium circular image" src="http://www.freeiconspng.com/uploads/red-square-png-14.png" />
            <h4 className="ui header">Поиск</h4>
            <p>Задайте один из трех критериев поиска оптимального пути</p>
          </div>
          <div className="column">
            <img className="ui medium circular image" src="http://www.freeiconspng.com/uploads/red-square-png-14.png" />
            <h4 className="ui header">Лучший результат</h4>
            <p>Получите наиболее подходящий вариант для вашей поездки</p>
          </div>
        </div>
      </div>

      <div className="ui centered grid">
        <div className="teal one column row">
          <div className="column">
            <h2 className="ui inverted header">
              Забудь о пробках прямо сейчас
            </h2>
            <p>Присоединяйся к OptiPath - это совершенно бесплатно</p>
            <Link to="signup" className="ui inverted huge button">
              Создать аккаунт
            </Link>
            <Link to="new-route" className="ui inverted huge button">
              Попробовать
            </Link>
          </div>
        </div>
      </div>

      <div id="landing-footer" className="ui grid">
        <div className="black one column row">
          <div className="column">
            <div className="ui container">
            <h4 className="ui header">
              <b>Opti</b>
              <b>Path</b>
            </h4>
            <div className="ui inverted link list">
              <a className="item">О нас</a>
              <a className="item">О программе</a>
              <a className="item">Новый маршрут</a>
              <a className="item">FAQ</a>
              <a className="disabled item">Самара 2016</a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Animation>
);

export default LandingPage;
