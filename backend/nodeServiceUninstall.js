const Service = require('node-windows').Service;

//  run this script like this: node .\nodeServiceUninstall.js

// Create a new service object
const svc = new Service({
  name: 'Backend',
  description: 'Poortjes & Garderobe',
  script: 'C:\\Users\\mickey.DNK.000\\Desktop\\React\\yesplan-2022\\backend\\server.js',
  maxRestarts: 5,
  maxRetries: 5,
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
