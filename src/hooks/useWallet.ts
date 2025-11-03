import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, createElement } from 'react';
import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

let modalRef: any = null;

/**
 * WalletConnect modal is loaded dynamically ONLY on native + Dev Client.
 * - Web: returns a no-op Modal.
 * - Expo Go: shows an alert instead of attempting to open the modal.
 */
export function useWallet() {
  const [ModalComp, setModalComp] = useState<ComponentType<any> | null>(null);
  const ref = useRef<{ open?: () => void } | null>(null);

  useEffect(() => {
    let mounted = true;

    // Only try to load on native AND not in Expo Go (requires Dev Client)
    if (!isNative || isExpoGo) return;

    (async () => {
      try {
        // Dynamic import prevents Metro from loading native compat modules on web/Expo Go
  const mod = await import('@walletconnect/modal-react-native');
  if (mounted) setModalComp(() => mod.WalletConnectModal as ComponentType<any>);
      } catch (e) {
        console.warn('WalletConnect modal could not be loaded:', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    modalRef = ref.current;
  }, [ModalComp]);

  const openWalletModal = useCallback(() => {
    if (isExpoGo) {
      Alert.alert(
        'Wallet Connect',
        'The WalletConnect modal requires a custom Dev Client (not Expo Go). Build a dev client and try again.'
      );
      return;
    }
    modalRef?.open?.();
  }, []);

  // Provide a component that renders the modal if available; otherwise a no-op
  const Modal = useMemo(() => {
    if (!ModalComp) {
      return function Noop() {
        return null;
      };
    }
    return function WalletConnectModalHost() {
      return createElement(ModalComp, {
        ref,
        projectId,
        providerMetadata: {
          name: 'Sway',
          description: 'Prediction markets app',
          url: 'https://example.com',
          icons: ['https://walletconnect.com/walletconnect-logo.png'],
          redirect: { native: 'sway://', universal: 'https://example.com' },
        },
      });
    };
  }, [ModalComp]);

  return { openWalletModal, Modal };
}
