const mongoose = require('mongoose');
const bluebird = require('bluebird');

const db = mongoose.connection;
const options = {
    promiseLibrary: bluebird,
    autoReconnect: true,
    useNewUrlParser: true,
    replicaSet: 'rs1'
};

const mongodbURL = "mongodb://10.8.201.228:27017,10.8.201.228:27018/testdb";
mongoose.Promise = bluebird;
mongoose.connect(mongodbURL, options);

db.on('error', (err) => {
    console.error('mongodb connect error, url: ' + mongodbURL, err);
});
db.once('open', () => {
    console.info('mongodb connection open, url: ' + mongodbURL);
});
db.on('connected', () => {
    console.info('mongodb connected , url: ' + mongodbURL);
});
db.on('reconnected', () => {
    console.info('mongodb reconnected , url: ' + mongodbURL);
});


module.exports = mongoose;
