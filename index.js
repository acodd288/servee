const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const libp2p = require('libp2p')
var storage = require('node-persist')

storage.initSync();

app.use(bodyParser.json());

app.get('/:key', function (req, res) {
  var key = req.params.key;
  storage.getItem(key).then(function (value) {
    res.set('Content-Type', 'text/html');
    res.send(value);
  });
});

app.post('/:key', function (req, res) {
  var key = req.params.key;
  var value = req.body.value;
  console.log(value);
  storage.setItem(key, value).then(function() {
    res.set('Content-Type', 'text/html');
    res.send(value);
  });
});

app.listen(3005, function () {
  console.log('Example app listening on port 3001!')
});

const IPFS = require('ipfs-daemon/src/ipfs-node-daemon')
const OrbitDB = require('orbit-db')

const ipfs = new IPFS()

ipfs.on('error', (e) => console.error(e))
ipfs.on('ready', (e) => {
  const orbitdb = new OrbitDB(ipfs)

  const db = orbitdb.eventlog("feed name")

  db.add("hello world")
    .then(() => {
      const latest = db.iterator({ limit: 5 }).collect()
      console.log(JSON.stringify(latest, null, 2))
    })
})
