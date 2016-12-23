import React from 'react';


const AboutPage = () => (
  <div className="ui text container" style={{ marginTop: '2rem' }}>
    <h1 className="ui header">
      OptiPath
      <div className="sub header">
        О программе
      </div>
    </h1>
    <p>
      Приложение OptiPath для поиска кратчайших путей на графе, выполнено в качестве лабораторного
      практикума студентами группы 6401Б:
    </p>
    <ul>
      <li>Комаров Дмитрий</li>
      <li>Кудрявцева Тамара</li>
      <li>Кузенная Анастасия</li>
      <li>Скоков Алексей</li>
    </ul>
    <p>
      Для разработки были использованы следующие технологии:
    </p>
    <ul>
      <li>React</li>
      <li>Redux</li>
      <li>Spring</li>
      <li>WebPack</li>
      <li>Babel</li>
      <li>Hibernate</li>
      <li>H2</li>
      <li>axios</li>
      <li>ES6</li>
      <li>PostgreSQL</li>
      <li>и многие другие</li>
    </ul>
  </div>
);

export default AboutPage;
