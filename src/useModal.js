import { createRef, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
import Modal from './Modal';
import { ModalLayerContext, rootModalPatchRef } from './ModalLayerContext';
import { lockParentScroll } from './lockParentScroll';
import { findExamplePhoneMountNode, useScrollElement } from '@kne/responsive-utils';

let hookModalUuid = 0;

/** 与 Modal / useDrawer 一致：示例手机框挂载根 */
const VIEWPORT_EXAMPLE_SELECTORS = ['.example-driver-device-scroll'];

const HookModal = forwardRef(({ config, afterClose: hookAfterClose }, ref) => {
  const [open, setOpen] = useState(true);
  const [innerConfig, setInnerConfig] = useState(config);

  const close = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    destroy: close,
    update: newConfig => {
      setInnerConfig(origin => Object.assign({}, origin, typeof newConfig === 'function' ? newConfig(origin) : newConfig));
    }
  }));

  const { afterClose: userAfterClose, onClose: userOnClose, onConfirm: userOnConfirm, onCancel: userOnCancel, ...restConfig } = innerConfig;

  return (
    <Modal
      {...restConfig}
      open={open}
      onClose={() => {
        userOnClose?.();
        close();
      }}
      onCancel={(...args) => {
        userOnCancel?.(...args);
        close();
      }}
      onConfirm={async (...args) => {
        const res = await Promise.resolve(userOnConfirm?.(...args));
        if (res !== false) {
          close();
        }
        return res;
      }}
      afterClose={(...args) => {
        hookAfterClose?.(...args);
        userAfterClose?.(...args);
      }}
    />
  );
});

/**
 * 命令式内容弹窗：就近 patch 到 ModalLayerProvider（多层）或根 ModalContextHolder。
 * 不走 App.modal.info / ConfirmDialog，层级交给 antd ZIndexContext。
 *
 * 打开时用 document.activeElement 解析示例手机框（与 useDrawer 一致），
 * 使 useFormModal 在手机预览内也能挂进 `.example-driver-device-scroll`，
 * 而不是落到 Global Holder 所在的外层 body。
 */
export const useModal = () => {
  const layer = useContext(ModalLayerContext);
  const getScrollElement = useScrollElement();
  const [actionQueue, setActionQueue] = useState([]);

  useEffect(() => {
    if (actionQueue.length) {
      const cloneQueue = [...actionQueue];
      cloneQueue.forEach(action => action());
      setActionQueue([]);
    }
  }, [actionQueue]);

  return useCallback(
    props => {
      hookModalUuid += 1;
      const modalRef = createRef();
      const api = {};
      let closeFunc;
      let unlock = () => {};

      const resolvePatch = () => layer?.patchElement || rootModalPatchRef.current;

      const runOpen = () => {
        const patch = resolvePatch();
        if (typeof patch !== 'function') {
          throw new Error('useModal requires <ModalContextHolder /> mounted inside <App> before calling useModal()');
        }
        unlock = lockParentScroll(getScrollElement);
        const { afterClose: userAfterClose, getContainer: customGetContainer, ...restProps } = props;

        // Holder 在 Global 外层；用点击焦点定位示例手机框（对齐 useDrawer / FileModal）
        const openAnchor = typeof document !== 'undefined' ? document.activeElement : null;
        const exampleMount = findExamplePhoneMountNode(openAnchor, VIEWPORT_EXAMPLE_SELECTORS);
        const examplePhoneProps =
          exampleMount && !customGetContainer
            ? {
                getContainer: () => exampleMount,
                isMobile: true,
                fixedModeClass: 'kne-is-boundary'
              }
            : customGetContainer
              ? { getContainer: customGetContainer }
              : {};

        const modalEl = (
          <HookModal
            key={`react-modal-${hookModalUuid}`}
            ref={modalRef}
            config={{
              ...restProps,
              ...examplePhoneProps,
              afterClose: (...args) => {
                unlock();
                userAfterClose?.(...args);
              }
            }}
            afterClose={() => {
              closeFunc && closeFunc();
            }}
          />
        );

        closeFunc = patch(modalEl);
      };

      if (resolvePatch()) {
        runOpen();
      } else {
        setActionQueue(prev => [...prev, runOpen]);
      }

      api.close = () => {
        if (modalRef.current) {
          modalRef.current.destroy();
        } else {
          setActionQueue(prev => [...prev, () => modalRef.current?.destroy()]);
        }
      };

      return api;
    },
    [getScrollElement, layer]
  );
};

export default useModal;
