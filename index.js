// File: index.js
const express = require('express')

// NEW: get the prom-client object
const promClient = require('prom-client')

const app = express()
const port = 3000

// NEW: create our metric object. This object defines
//      a named metric in our system, and other code
//      will use this object.
const counter = new promClient.Counter({
  name: 'my_metric_identifier',
  help: 'an example counter metric for this tutorial',
});

app.get('/stuff', function (req, res) {
  // NEW: here we _use_ the metric object.  Counter metric
  //      are _incremented_ -- i.e. we "inc"ement the same
  //      way a bouncer or fire marshall at bar would increment
  //      a counter to keep track of how many people are inside.
  counter.inc()
  res.type('json')
  res.send(JSON.stringify({hello:"world"}))
})

// NEW: here we expose a `/metrics` endpoint in our service
//      that will return _all_ the Prometheus metrics.  The
//      "register" object is the global registry that
//      all metrics will be added to by default.  The `metrics()`
//      method is a method that returns all the current metric
//      values in the system in a custom plain text format
app.get('/metrics', function (req, res) {
  res.send( require('prom-client').register.metrics())
})

app.listen(
  port,
  function() {
    console.log(`Example app listening at http://localhost:${port}`)
  }
)