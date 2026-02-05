// @ts-nocheck
'use strict';

console.log("BACKEND LOADED FROM:", __dirname);

let port = 3000;
let express = require("express");
let mongoDB = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
const cors = require("cors");

let books = require("./BookModule");
let app = express();


app.use(cors());                     
app.use(express.json());            
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/AddBook", async (req, res) => {
  console.log("Hit /AddBook route");

  try {
    let success = await books.AddBook(req, mongoDB);
    res.json(success);    
  } catch (e) {
    console.error("Error in /AddBook:", e);
    res.status(500).json(false);
  }
});



app.get("/Books", async (req, res) => {
  console.log("Hit /Books route");

  try {
    let list = await books.GetBooks(mongoDB);
    res.json(list);     
  } catch (e) {
    console.error("Error in /Books:", e);
    res.status(500).json([]);
  }
});



app.listen(port, () => {
  console.log("Listening on port", port);
});
