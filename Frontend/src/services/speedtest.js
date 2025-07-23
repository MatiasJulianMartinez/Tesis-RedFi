import FastSpeedtest from "fast-speedtest-api";

const speedtest = new FastSpeedtest({
  token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // token público por defecto, no requiere registro
  verbose: false,
  timeout: 10000,
  https: true,
  urlCount: 5,
  bufferSize: 8,
  unit: FastSpeedtest.UNITS.Mbps,
});

export default speedtest;
