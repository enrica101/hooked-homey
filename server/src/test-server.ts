// src/test-server.ts
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test server working!' });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});