import Raven from 'raven-js';


export const ravenMiddleware = store => next => action => {
  try {
    if (action.logged) {
      Raven.captureMessage('TP-OptiPath logged error', {
        extra: {
          action,
          state: store.getState()
        }
      });
    }

    return next(action);
  } catch (err) {
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw err;
  }
};


export const createLoggedError = (type) => (payload) => ({
  type,
  payload,
  logged: true
});
