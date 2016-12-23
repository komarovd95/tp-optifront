const getPoliceman = policeman => {
  switch (policeman) {
    case 'greedy':
      return {
        time: 0.25,
        cost: 2000
      };

    case 'honest':
      return {
        time: 0.25,
        cost: 1000
      };

    case 'slow':
      return {
        time: 0.5,
        cost: 1000
      };

    default:
      return {
        time: 0.25,
        cost: 1000
      };
  }
};

const functions = {
  length: (car, driveStyle, node, edge) => Number.parseInt(edge.length),
  velocity: (car, driveStyle, node, edge) => {
    if ((edge.traffic || edge.traffic === 0) && edge.traffic < edge.limit) {
      return Math.min(edge.traffic, car.maxVelocity);
    } else {
      if (driveStyle === 'LAW_ABIDING') {
        return Math.min(edge.limit, car.maxVelocity);
      } else {
        return car.maxVelocity;
      }
    }
  },
  wastedTime: (car, driveStyle, node) => (node.light) ? node.light.redPhase : 0,
  pauseTime: (car, driveStyle, node, edge) => {
    if (edge.policeman && driveStyle !== 'LAW_ABIDING') {
      return getPoliceman(edge.policeman).time;
    } else {
      return 0;
    }
  },
  time: (car, driveStyle, node, edge) => {
    return (functions.length(car, driveStyle, node, edge) /
              functions.velocity(car, driveStyle, node, edge) / 1000 *
      (edge.coverType ? edge.coverType.slowdown : 1)) +
      functions.wastedTime(car, driveStyle, node) +
      functions.pauseTime(car, driveStyle, node, edge);
  },
  cost: (car, driveStyle, node, edge, cost) => {
    return (functions.length(car, driveStyle, node, edge) / 100000 * car.fuelConsumption * cost) +
      ((edge.policeman && driveStyle !== 'LAW_ABIDING') ? getPoliceman(edge.policeman).cost : 0);
  }
};

export default functions;
