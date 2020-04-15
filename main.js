const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const follow = require('./scripts/follow');
const unfollow = require('./scripts/unfollow');

  // Mantén una referencia global del objeto window, si no lo haces, la ventana 
  // se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
  let win;
  
  function createWindow () {
    // Crea la ventana del navegador.
    win = new BrowserWindow({ width: 700, height: 800, backgroundColor: '#2e2c29'});
  
    // y carga el archivo index.html de la aplicación.
    win.loadFile('index.html');

    // Abre las herramientas de desarrollo (DevTools).
    //win.webContents.openDevTools();
  
    //Menu
    const template = [
      { label: 'Report Issue',
        click: () => {
          console.log('reportIssue');
        } },
      { label: 'Help',
        submenu: [
          { label: 'About' },
          { type: 'separator' },
          { label: 'View license',
            click: () => {
              Electron.shell.openExternal('https://electronjs.org/');
            } },
          { type: 'separator' },
          { label: 'Privacy Statement' },
          { type: 'separator' },
          { label: 'Disclaimer' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    // Emitido cuando la ventana es cerrada.
    win.on('closed', () => {
      // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
      // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
      // en el que deberías borrar el elemento correspondiente.
      win = null;
    });
  }

  ipcMain.on('request-mainprocess-action', (event, arg) => {
    console.log(
        arg
    );
    if (arg.action === 'follow') {
      const fllw = follow(arg.username, arg.password, arg.target, arg.amount).catch( () => {
        event.sender.send('mainprocess-response', 'cancelFollow');
        console.log('Follow closed');
      });   
    }
    if (arg.action === 'unfollow') {
      const unfllw = unfollow(arg.username, arg.password, arg.username, arg.amount).catch( () => {
        event.sender.send('mainprocess-response', 'cancelUnfollow');
        console.log('Unfollow closed');
      });
    }
  });

  // Este método será llamado cuando Electron haya terminado
  // la inicialización y esté listo para crear ventanas del navegador.
  // Algunas APIs pueden usarse sólo después de que este evento ocurra.
  app.on('ready', createWindow);

  // Sal cuando todas las ventanas hayan sido cerradas.
  app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })
  
  app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.
    if (win === null) {
      createWindow();
    }
  });
  
  // En este archivo puedes incluir el resto del código del proceso principal de
  // tu aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.