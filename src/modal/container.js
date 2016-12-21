import { connect } from 'react-redux';
import { closeModal } from './modal';
import AppModal from './components/AppModal';


export default connect(
  state => ({
    isOpen: state.modal.isOpen,
    ...state.modal.modalInfo
  }),
  dispatch => ({
    close: () => dispatch(closeModal())
  })
)(AppModal);


