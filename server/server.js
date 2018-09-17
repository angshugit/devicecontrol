const express = require('express');
const port = process.env.PORT || 5000;

var deviceRouter = require('./routes/device');
const app = express();

app.use('/devices', deviceRouter);

app.get('/api/login', (req, res) => {
  res.send({ user: 'parent' });
});
/*app.get('/api/device-list', (req, res) => {
  res.send({devices:[ {id: 1, devicename: 'roku', status: 'unpaused'},
  {id: 2, devicename: 'roku', status: 'unpaused'},
  {id: 3, devicename: 'roku', status: 'unpaused'}]});

});*/
app.listen(port, () => console.log(`Listening on port ${port}`));

