import { app, shell, BrowserWindow, ipcMain, clipboard, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import Groq from 'groq-sdk';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { clipBoardType } from '../types/clipboard';
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const assetsDir = path.join(__dirname, '../renderer/assets');
const icoFile = fs.readdirSync(assetsDir).find(file => file.endsWith('.ico'));
const iconPath = icoFile ? path.join(assetsDir, icoFile) : undefined;

function createWindow(): void {

  const mainWindow = new BrowserWindow({
    title: 'Ctrl+AI',
    icon: iconPath,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
    * {
      user-select: none !important;
    }

    .allow-select, .allow-select * {
      user-select: text !important;
    }
  `);
  });
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  globalShortcut.register('Control+I', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (!win) return;
    if (win.isFocused()) return

    if (win.isMinimized()) {
      win.restore();
    }

    if (!win.isFocused()) {
      win.focus();
    }

    win.webContents.send('shortcut-detected');
  });

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.setName('Ctrl+AI');

ipcMain.handle('get-clipboard-content', async (): Promise<clipBoardType> => {
  const image = clipboard.readImage();

  if (!image.isEmpty()) {
    return {
      type: 'image',
      content: image.toDataURL(),
    };
  }

  const text = clipboard.readText();
  if (text.trim() !== '') {
    return {
      type: 'text',
      content: text
    };
  }

  return {
    type: 'empty',
    content: null,
  };
});


ipcMain.handle('gpt-call', async (_e, prompt) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `Responda diretamente sem precisar explicar:\n ${prompt}` }],
    model: 'openai/gpt-oss-20b',
  });

  return completion.choices[0].message.content;
});
ipcMain.handle('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.handle('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

ipcMain.handle('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
