import moment from 'moment';


moment.locale('ru');

const formatString = 'DD.MM.YYYY, HH:mm:ss';

export const convertDate = (dateString) => {
  const dateMoment = moment(dateString);

  if (dateMoment.isValid()) {
    return dateMoment.format(formatString);
  } else {
    return dateString;
  }
};

export const formatDate = (dateString) => {
  return moment(dateString).format(formatString);
};

export const getTimeAgo = dateString => {
  return moment(dateString).fromNow();
};
