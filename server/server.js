const express = require('express');
const path = require('path');
const  bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const port = process.env.PORT || 5000;

const app = express();

// enhance your app security with Helmet
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// enable all CORS requests
app.use(cors());
//
// log HTTP requests
app.use(morgan('combined'));

var deviceRouter = require('./routes/device');
app.use('/devices', deviceRouter);

app.get('/api/login', (req, res) => {
  res.send({ user: 'parent' });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '/../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
    });
}
    //
app.listen(port, () => console.log(`Listening on port ${port}`));

