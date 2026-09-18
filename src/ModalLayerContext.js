import { createContext, useContext, useMemo } from 'react';
import usePatchElement from './usePatchElement';

/** 当前 Modal 层的 patchElement；仅声明式/命令式内容弹窗内提供，根 Holder 不提供。 */
export const ModalLayerContext = createContext(null);

export const useModalLayer = () => useContext(ModalLayerContext);

/**
 * 挂在 Modal 内容树内（antd ZIndexContext 之下），
 * 使就近 useModal 打开的内层成为本层 React 子树，从而自动叠层。
 */
export const ModalLayerProvider = ({ children }) => {
  const [elements, patchElement] = usePatchElement();
  const value = useMemo(() => ({ patchElement }), [patchElement]);
  return (
    <ModalLayerContext.Provider value={value}>
      {children}
      {elements}
    </ModalLayerContext.Provider>
  );
};

/** 根级命令式打开（页面首次弹层）；不包 ModalLayerContext。 */
export const rootModalPatchRef = { current: null };

export const ModalContextHolder = () => {
  const [elements, patchElement] = usePatchElement();
  rootModalPatchRef.current = patchElement;
  return <>{elements}</>;
};
