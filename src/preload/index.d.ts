import { clipBoardType } from '../types/clipboard';

export { };

declare global {
  interface Window {
    electronAPI: {
      getClipboardContent: () => Promise<clipBoardType>;
      ask: (prompt: string) => Promise<string>;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      shortcut: (callback: () => void) => void;
    };
  }
}