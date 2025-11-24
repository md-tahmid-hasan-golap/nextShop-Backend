const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




// middel ware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?appName=Cluster0`;









// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

        
       // all collaction
         const productCollaction = client.db("product-DB").collection("products");
         const importCollaction = client.db("product-DB").collection("imports");


        //  post api
        app.post("/products", async(req, res) => {
          const newProduct = req.body;
          const result = await productCollaction.insertOne(newProduct);
          res.send(result)
        })



        //  post api

        app.post("/imports", async(req, res) => {
          const newImport = req.body;
          const result = await importCollaction.insertOne(newImport);
          res.send(result)
        })




         app.get('/myImports', async(req, res) => {
            const result = await importCollaction.find().toArray()
            res.send(result)
         })

         app.get('/myProducts/:email', async(req, res) => {
          const email = req.params.email;
          const queary = {email}
          const result = await productCollaction.find(queary).toArray()
          res.send(result)
         })

        //  get api
        app.get("/products", async(req, res) => {
          const result = await productCollaction.find().limit(6).toArray()
          res.send(result)
        })
        //  get api
        app.get("/allProducts", async(req, res) => {
          const result = await productCollaction.find().toArray()
          res.send(result)
        })

        //  get api
        app.get("/productsDetails/:id", async(req, res) => {
          const id = req.params.id;
          const queary = {_id: new ObjectId(id)}
          const result = await productCollaction.findOne(queary)
          res.send(result)
        })

       
        //  get api
        app.delete("/deleteImportProduct/:id", async(req, res) => {
          const id = req.params.id;
          const queary = {_id: new ObjectId(id)}
          const result = await importCollaction.deleteOne(queary)
          res.send(result)
        })
        //  get api
        app.delete("/deleteMyProduct/:id", async(req, res) => {
          const id = req.params.id;
          const queary = {_id: new ObjectId(id)}
          const result = await productCollaction.deleteOne(queary)
          res.send(result)
        })


      
app.put("/updateImportProduct/:id", async (req, res) => {
  const id = req.params.id;
  const newImport = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: newImport };

  try {
    const result = await productCollaction.updateOne(filter, updateDoc);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to update import." });
  }
});














    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.get('/', (req, res) => {
  res.send('Backend server is running...')
})

app.listen(port, () => {
  console.log(`API server listening on port ${port}`)
})
