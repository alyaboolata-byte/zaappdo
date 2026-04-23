const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getTasks:   ()       => ipcRenderer.invoke('get-tasks'),
  saveTasks:  (tasks)  => ipcRenderer.invoke('save-tasks', tasks),
  getSub:     ()       => ipcRenderer.invoke('get-sub'),
  saveSub:    (data)   => ipcRenderer.invoke('save-sub', data),
  startTrial: ()       => ipcRenderer.invoke('start-trial'),
  close:      ()       => ipcRenderer.send('win-close'),
  minimize:   ()       => ipcRenderer.send('win-minimize'),
});
