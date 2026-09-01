import { Tabs } from 'antd';
import classnames from 'classnames';
import styles from './layouts.module.scss';

const ModalTabsLayout = ({ className, destroyOnHidden = true, ...props }) => <Tabs className={classnames(styles['modal-tabs-layout'], className)} destroyOnHidden={destroyOnHidden} {...props} />;

export default ModalTabsLayout;
