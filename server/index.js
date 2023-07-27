const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const connectionString =
  "mongodb+srv://dictatemd:Ti8IkgAXpC9KRlYY@cluster0.jknesuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(bodyParser.json());

const DocumentSchema = new mongoose.Schema({
  name: String,
  author: String,
  date: Date,
  text: String,
});

const Document = mongoose.model("Document", DocumentSchema);

// in-memory cache, not good for distributed systems. Use redis instead.
let cache = {};

app.post("/upload", async (req, res) => {
  const newDocument = new Document(req.body);

  try {
    const doc = await newDocument.save();
    return res.status(200).send(doc);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (cache[query]) {
    return res.status(200).send(cache[query]);
  } else {
    try {
      const docs = await Document.find({
        $or: [
          { name: new RegExp(query, "i") },
          { author: new RegExp(query, "i") },
          { text: new RegExp(query, "i") },
        ],
      });

      cache[query] = docs;
      return res.status(200).send(docs);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
});

app.listen(80, () => console.log("Server started on port 80"));
