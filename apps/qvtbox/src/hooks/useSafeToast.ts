// src/hooks/useSafeToast.ts
import { useToast as useOriginalToast } from '@/hooks/use-toast';

type ToastInput =
  | string
  | {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
      duration?: number;
      // action?: React.ReactNode; // si ton use-toast supporte une action
    };

type ToastAPI = {
  toast: (input: ToastInput) => void;
  dismiss: (id?: string | number) => void;
  toasts: any[];
};

const isBrowser = typeof window !== 'undefined';

// Mémo anti-spam très simple partagé au niveau module
let lastSig = '';
let lastTs = 0;

export const useSafeToast = (): ToastAPI => {
  try {
    const api = useOriginalToast();

    // Wrapper pour accepter string OU objet + anti-doublon
    const safeToast: ToastAPI['toast'] = (input) => {
      try {
        const opts = typeof input === 'string' ? { title: input } : input || {};
        const sig = `${opts.title ?? ''}|${opts.description ?? ''}|${opts.variant ?? ''}`;
        const now = Date.now();
        if (sig && sig === lastSig && now - lastTs < 600) return; // ignore doublon <600ms
        lastSig = sig;
        lastTs = now;

        // @ts-expect-error: on passe les options telles que supportées par ton use-toast
        api.toast(opts);
      } catch {
        /* noop */
      }
    };

    return {
      toast: safeToast,
      dismiss: api.dismiss ?? (() => {}),
      toasts: api.toasts ?? [],
    };
  } catch {
    // Fallback si le provider/use-toast n'est pas disponible
    const noop = () => {};
    const fallbackToast: ToastAPI['toast'] = (input) => {
      if (!isBrowser) return;
      if ((import.meta as any)?.env?.DEV) {
        const opts = typeof input === 'string' ? { title: input } : input || {};
        // eslint-disable-next-line no-console
        console.warn('[toast:fallback]', opts.title ?? opts.description ?? opts);
      }
    };

    return {
      toast: fallbackToast,
      dismiss: noop,
      toasts: [],
    };
  }
};
