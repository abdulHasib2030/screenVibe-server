const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const express = require('express');
 const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000;
// ScreenVibe
// fO1rhQJ7zdkdGNnS


const uri = "mongodb+srv://ScreenVibe:fO1rhQJ7zdkdGNnS@cluster0.kpzks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const moviesCollection = client.db('movies').collection("movie");
    
    // await client.db("admin").command({ ping: 1 });

    app.get('/all-movies', async(req, res)=>{
        const cursor = moviesCollection.find()
        const result = await cursor.toArray()
        // console.log(result);
        res.send(result)
    })

    app.post('/add-movie',  async(req, res)=>{
       const newMovie = req.body;
    //    console.log(newMovie);
       const result = await moviesCollection.insertOne(newMovie)
        res.send(result)
    })

    app.get('/movie-details/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await moviesCollection.findOne(query)
        res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);




app.listen(port, ()=>{
    console.log("Coffee server running");
})



