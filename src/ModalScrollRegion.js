import classnames from 'classnames';
import SimpleBar from './SimpleBar';
import styles from './layouts.module.scss';

const ModalScrollRegion = ({ className, inset = false, children, ...props }) => (
  <SimpleBar className={classnames(styles['modal-scroll-region'], 'modal-scroll-region', inset && styles['is-inset'], className)} {...props}>
    <div className={styles['modal-scroll-region-inner']}>{children}</div>
  </SimpleBar>
);

export default ModalScrollRegion;
