const express = require('express');
const Prometheus = require('express-prometheus-middleware');
const validate = require('jsonschema').validate;


const app = express();

app.use(express.json());
app.use(Prometheus({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
}));

const timeSchema = {
  "properties": {
    "epoch": {
      "description": "The current server time, in epoch seconds, at time of processing the request.",
      "type": "number"
    }
  },
  "required": ["epoch"],
  "type": "object"
};

function validateAgainstSchema(data, schema) {
  return validate(data, schema);
}

app.get('/time', (req, res) => {
  const currentTime = Math.floor(Date.now() / 1000);

  const response = {
    epoch: currentTime
  };

  const validationResult = validateAgainstSchema(response, timeSchema);

  if (!validationResult.valid) {
    return res.status(500).json({ error: validationResult.errors });
  }

  return res.json(response);
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType);
  return res.send(Prometheus.register.metrics());
});

app.use((req, res, next) => {
  const token = req.get('Authorization');

  if (token !== 'mysecrettoken') {
    return res.status(403).json({ error: 'Authorization token missing or invalid' });
  }

  return next();
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});
