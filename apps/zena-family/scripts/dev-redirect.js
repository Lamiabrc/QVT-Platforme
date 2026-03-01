import http from "node:http";

const target = "https://www.qvtbox.com/famille";
const port = Number(process.env.PORT || 4174);

const server = http.createServer((_req, res) => {
  res.statusCode = 302;
  res.setHeader("Location", target);
  res.end(`Redirecting to ${target}`);
});

server.listen(port, () => {
  console.log(`zena-family redirect dev server listening on http://localhost:${port}`);
  console.log(`All requests redirect to ${target}`);
});
