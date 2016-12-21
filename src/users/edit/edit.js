import React from 'react';
import { showModal } from '../../modal/modal';
import { deleteUser } from '../profile/profile';
import { browserHistory } from 'react-router';


export const showDeleteModal = () => (dispatch, getState) => {
  const user = getState().users.profile.user;

  dispatch(showModal({
    title: 'Удалить пользователя',
    message: (
      <p>Вы действительно желаете удалить пользователя
        <b> {user.username}</b>?
      </p>
    ),
    accept: () => dispatch(deleteUser()).then(() => browserHistory.push("/"))
  }));
};
