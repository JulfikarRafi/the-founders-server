


const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

// MongoDB URI
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lftgrs4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1eyo3nk.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let callRequestCollection;

// Connect to MongoDB and start server
async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const db = client.db("founderAcademy");
    callRequestCollection = db.collection("callRequests");

    // Health check
    app.get("/", (req, res) => {
      res.send("Founder Academy Server Running 🚀");
    });

    // POST /request-call
    app.post("/request-call", async (req, res) => {
      try {
        const { name, email, company, goals } = req.body;

        if (!name || !email || !goals) {
          return res.status(400).send({ message: "Required fields missing" });
        }

        const newRequest = {
          name,
          email,
          company,
          goals,
          createdAt: new Date(),
        };

        const result = await callRequestCollection.insertOne(newRequest);

        res.send({
          success: true,
          message: "Request saved successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    app.listen(port, () => {
      console.log(`🔥 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

startServer();
