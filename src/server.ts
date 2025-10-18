
const express = require('express');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
