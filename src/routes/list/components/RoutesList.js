import React, { Component, PropTypes } from 'react';
import { CardsGrid } from '../../../grid';
import RoutesListItem from './RoutesListItem';
import RoutesListToolbar from './RoutesListToolbar';
import { PathRoute } from '../../model';
import { Pageable } from '../../../utils/CallAPI';


class RoutesList extends Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.instanceOf(PathRoute)),
    pageable: PropTypes.instanceOf(Pageable).isRequired,
    filter: PropTypes.string,
    isFetching: PropTypes.bool,
    requestData: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  componentDidMount() {
    this.requestData();
  }

  requestData = (p, s, f) => {
    if (this.props.location.pathname.startsWith("/admin")) {
      return this.props.requestData(true, p, s, f);
    } else {
      return this.props.requestData(false, p, s, f);
    }
  };

  onFilterChange = name => this.requestData(undefined, undefined, { name });
  onSortChange   = sort => this.requestData(undefined, sort, undefined);
  onPageChange   = page => this.requestData({ page });

  render() {
    const { routes, pageable, isFetching, filter } = this.props;

    const toolbar = (<RoutesListToolbar filter={filter}
                                        onFilterChange={this.onFilterChange}
                                        onSortChange={this.onSortChange}
                                        refresh={() => this.requestData()}/>);

    return (
      <CardsGrid items={routes}
                 toolbar={toolbar}
                 pageable={pageable}
                 loading={isFetching}
                 onPageChange={this.onPageChange}
                 component={RoutesListItem}/>
    );
  }
}

export default RoutesList;
