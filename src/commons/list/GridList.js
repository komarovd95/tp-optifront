import React from 'react';


export default class GridList extends React.Component {
  render() {
    const { itemsRenderer, itemRenderer, items } = this.props;

    if (items.length) {
      return itemsRenderer(items.map(item =>
        React.createElement(itemRenderer, {...item.toPlainObject(), key: item.id})));
    } else {
      return <p style={{textAlign: 'center'}}>Нет данных</p>;
    }
  }
}

GridList.propTypes = {
  items: React.PropTypes.array.isRequired,
  itemRenderer: React.PropTypes.func.isRequired,
  itemsRenderer: React.PropTypes.func.isRequired
};
