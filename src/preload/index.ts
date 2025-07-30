import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getClipboardContent: () => ipcRenderer.invoke('get-clipboard-content'),
  ask: (prompt: string) => ipcRenderer.invoke('gpt-call', prompt),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  shortcut: (callback: () => void) => ipcRenderer.on('shortcut-detected', callback)
});