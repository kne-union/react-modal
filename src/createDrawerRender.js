import Drawer from './Drawer';

const createDrawerRender = drawerDefaults => hostProps => <Drawer {...drawerDefaults} {...hostProps} />;

export default createDrawerRender;
