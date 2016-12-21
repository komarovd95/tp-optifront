import React, { PureComponent, PropTypes } from 'react';


class TableBody extends PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      renderer: PropTypes.func
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })).isRequired
  };

  render() {
    const { columns, items } = this.props;

    if (items.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center' }}>
              Нет данных
            </td>
          </tr>
        </tbody>
      );
    }

    const renderers = columns.map(
      ({ key, renderer }) => (renderer
        ? renderer.prototype.isReactComponent
            ? i => React.createElement(renderer, { item: i })
            : i => renderer(i)
        : i => i[key])
    );

    return (
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            {renderers.map((renderer, i) => (
              <td key={`${i}-${item.id}`}>
                {renderer(item)
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
