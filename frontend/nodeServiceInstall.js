const Service = require('node-windows').Service;

//  run this script like this: node .\nodeServiceInstall.js

// Create a new service object
const svc = new Service({
  name: 'Frontend',
  description: 'Poortjes & Garderobe',
  script:
    'C:\\Users\\mickey.DNK.000\\Desktop\\React\\yesplan-2022\\frontend\\node_modules\\react-scripts\\scripts\\start.js',
  maxRestarts: 5,
  maxRetries: 5,
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();
