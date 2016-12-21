import React, { PureComponent, PropTypes } from 'react';


class TableHeader extends PureComponent {
  static propTypes = {
    column: PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string
    }).isRequired
  };

  render() {
    const { key, name } = this.props.column;

    return <th>{name || key}</th>;
  }
}

export default TableHeader;
