const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
// middleware
app.use(cors());
app.use(express.json());

const user = {
  name: "sujon",
  email: "sujon@gmail.com",
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vdxshj0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("userDB").collection("user");
    // posting coffee collection
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);

      console.log(newCoffee);
    });
    // for user collection
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);

      console.log(newUser);
    });
    app.patch("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      // console.log(filter);
      const updateDoc = {
        $set: {
          lastSignInAt: user.lastSignInAt,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // get user collection
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete user
    // delete user
    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // get coffee collection
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // update coffee collection
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          taste: updatedCoffee.taste,
          supplier: updatedCoffee.supplier,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updateCoffee,
        options
      );
      res.send(result);
    });

    // delete coffee
    app.delete("/coffee/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const query = { _id: new ObjectId(coffeeId) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(user);
});
app.listen(port, console.log(`coffee server listening on: ${port}`));
