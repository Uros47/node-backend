import { createServer } from "http";
import { readFile, writeFile } from "fs";
let port = 8080;
let host = "localhost";

////   N  O  D  E .  J  S            S  E  R  V  E  R    ////////

const server = createServer((request, response) => {
  // function for writing data
  function writeData(body, file, flag) {
    request
      .on("data", (chunk) => {
        let obj = JSON.parse(chunk);
        body.push(obj);
      })
      .on("end", () => {
        writeFile(file, JSON.stringify(body), flag, () => { });
        response.write(Buffer.from(body));
        response.end();
      });
  }

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // GET DATA FROM AJAX
  if (request.url === "/get-data" && request.method === "GET") {
    response.setHeader("content-type", "application/json");
    readFile("logindata.json", (error, file) => {
      if (error) {
        throw error;
      } else {
        response.write(file);
        response.end();
      }
    });
  }
  // POST PLAYGROUND DATA
  else if (request.method === "POST" && request.url === "/post-data") {
    response.setHeader("content-type", "application/json");

    readFile("playgrounddata.json", (error, file) => {
      if (error) {
        throw error;
      } else {
        let data = [];
        if (file.length > 0) {
          data = JSON.parse(file);
        }
        writeData(data, "playgrounddata.json", { flag: "w+" });
      }
    })
  }
  // POST LOG IN DATA FROM AJAX
  else if (request.method === "POST" && request.url === "/post-login-data") {
    response.setHeader("content-type", "application/json");
    let data = [];
    writeData(data, "logindata.json");
  } else {
    response.end();
  }
});
server.listen(port, host, (error) => {
  if (error) {
    console.log("Something went wrong", error);
  } else {
    console.log(`Server is runing on http://${host}:${port}`);
  }
});
