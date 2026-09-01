import Modal from './Modal';

const createModalRender = modalDefaults => hostProps => <Modal {...modalDefaults} {...hostProps} />;

export default createModalRender;
