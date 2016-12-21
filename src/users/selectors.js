import { createSelector } from 'reselect';


const getLoggedUser = state => state.auth.user;
const getProfileUser = state => state.users.profile.user;

export const isUserEditable = createSelector(getLoggedUser, getProfileUser,
  (loggedUser, profileUser) => loggedUser && profileUser &&
    (loggedUser.id === profileUser.id || (loggedUser.isAdmin() && !profileUser.isAdmin()))
);

export const isUserCouldBeDeleted = createSelector(getLoggedUser, getProfileUser, isUserEditable,
  (loggedUser, profileUser, isEditable) => isEditable && loggedUser.id !== profileUser.id
);


const getUsersEntities = state => state.users.list.data.entities;
const getUsersResult   = state => state.users.list.data.result;

export const getUsersArray = createSelector(getUsersEntities, getUsersResult,
  (entities, result) => result ? result.map(id => entities[id]) : []);


