'use strict';

/*var scott = {  
      name: 'Scott',
      twitter: '@ScottWRobinson'
};

usersDb.insert(scott, function(err, doc) {  
      console.log('Inserted', doc.name, 'with ID', doc._id);
});*/

var Datastore = require('nedb'),

devicesDb = new Datastore({
     filename: __dirname + '/../../db/devices.db',
     autoload: true
});

module.exports = devicesDb;
