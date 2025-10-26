// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lftgrs4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



// app.get('/',(req,res)=>{
//     res.send('founder is on the way')
// });

// app.listen(port, ()=>{
//     console.log(`the founder server is running on port ${port}`);
// })

// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lftgrs4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("founderDB");
    const requestsCollection = db.collection("callRequests");

    // ✅ POST: Save request call form data
    app.post("/api/request-call", async (req, res) => {
      const { name, email, goals } = req.body;
      if (!name || !email || !goals) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const result = await requestsCollection.insertOne({
        name,
        email,
        goals,
        date: new Date(),
      });

      res.send({
        success: true,
        message: "Request saved successfully!",
        data: result,
      });
    });

    // ✅ Default route
    app.get("/", (req, res) => {
      res.send("🚀 The Founder server is running successfully!");
    });

    app.listen(port, () => {
      console.log(`✅ The Founder server is running on port ${port}`);
    });

    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);
