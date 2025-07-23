const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.raw({ limit: '100mb', type: '*/*' }));

// Endpoint para ping
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Endpoint para descarga (simula archivo grande)
app.get("/garbage", (req, res) => {
const size = 200 * 1024 * 1024; // 200MB
  const buffer = Buffer.alloc(size, "0");
res.set("Content-Type", "application/octet-stream");
res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
res.set("Pragma", "no-cache");
res.set("Expires", "0");
res.set("Surrogate-Control", "no-store");
res.send(buffer);
});

// Endpoint para subida
app.post("/empty", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`LibreSpeed backend escuchando en http://localhost:${port}`);
});
