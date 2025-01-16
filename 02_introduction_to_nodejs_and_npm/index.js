const fs = require("fs");
const http = require("http");
const { dirname } = require("path");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

/////////////////////////--FILES--//////////////////////////
//Blocking - Synchronous way

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// // console.log(textIn);

// const textOut = `This is: ${textIn} ${Date.now()}`;
// console.log(textOut);

// fs.writeFileSync("./txt/output.txt", textOut);

//Non-Blocking - Asynchronous way

// fs.readFile("./txt/start1.txt", "utf-8", (err, data) => {
//   if (err) return console.log(err);

//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);

//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("File has been updated.");
//         }
//       );
//     });
//   });
// });
// console.log("will read file...");

/////////////////////////--SERVER--//////////////////////////

let tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
let tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
let tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

let data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// const slugs = dataObj.map((el) => {
//   return slugify(el.productName, { lower: true });
// });
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj.map((ele) => replaceTemplate(tempCard, ele));
    tempOverview = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(tempOverview);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    const product = replaceTemplate(tempProduct, dataObj[query.id]);

    res.end(product);

    //API
  } else if (pathname === "/api") {
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, { "Content-type": "text/html", my_own: "Helloooo" });
    res.end("<h1>404: NOT FOUND<h1/>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on port 8000");
});
