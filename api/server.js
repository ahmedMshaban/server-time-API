const express = require('express');
const Prometheus = require('express-prometheus-middleware');
const validate = require('jsonschema').validate;


const app = express();

app.use(express.json());

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

// Middleware to check Authorization header
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = 'mysecrettoken';

  if (!authHeader || authHeader !== token) {
    res.status(403).json({ message: 'Authorization token missing or invalid' });
    return;
  }

  next();
};

// Apply the middleware to all routes
app.use(authMiddleware);
app.use(Prometheus({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
}));

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


app.listen(8080, () => {
  console.log('API listening on port 8080');
});
