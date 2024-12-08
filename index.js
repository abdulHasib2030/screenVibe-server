require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.MONGODBNAME}:${process.env.MONGODBPASS}@cluster0.kpzks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const moviesCollection = client.db('movies').collection("movie");
    const favoritesCollection = client.db('movies').collection("favorite")
    
    // await client.db("admin").command({ ping: 1 });

    app.get('/all-movies', async(req, res)=>{
        // const cursor = moviesCollection.find()
        // const result = await cursor.toArray()
       
      const {searchParams} = req.query

      let option = {};
      let result = [];

      if (searchParams && searchParams.trim() !== "") {
          option = { title: { $regex: searchParams, $options: "i" } };
          result = await moviesCollection.find(option).toArray();
      } else {
          result = await moviesCollection.find().toArray();
      }

  const actionDrama = await moviesCollection.find({ genres: { $in: ['drama', 'action'] } }).toArray();
    
        res.send({result, actionDrama})
    })

    app.post('/add-movie',  async(req, res)=>{
       const newMovie = req.body;
   
       const result = await moviesCollection.insertOne(newMovie)
        res.send(result)
    })

    app.get('/movie-details/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await moviesCollection.findOne(query)
        res.send(result)
    })

    app.delete('/movie-delete/:id', async(req, res)=>{
        const id = req.params.id;
        const query =  {_id: new ObjectId(id)}
        // console.log(typeof query);

        const favDel = await favoritesCollection.deleteMany({id:id})
        console.log(favDel);
        const result = await moviesCollection.deleteOne(query)
        res.send({result})
        
    })
    app.post('/favorite', async(req, res)=>{
      const data = req.body;
        const result = await favoritesCollection.insertOne(data)
        res.send(result)

    })

    app.get('/favorite/:id/:email', async(req, res)=>{
      const id = req.params.id;
      const email =req.params.email
      // console.log(id, email);
      const query = {id: (id), email:email}
     
      const result = await favoritesCollection.findOne(query)
      if (result){
        res.send(result)
      }
      else{
        res.send({"error": "not find"})
      }
    })


    app.get('/my-favorite/:email', async(req, res)=>{
      const email = req.params.email
     const result = await favoritesCollection.find({email:email}).toArray()
      // console.log(result);
      res.send(result)

    })

    app.delete('/favorite-delete/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await favoritesCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/', async(req, res)=>{
      const result = await moviesCollection.find().sort({rating:-1}).limit(6).toArray()
      res.send(result)
    })

    app.put('/movie/update/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateMovie = req.body;
      // console.log(updateMovie);
      const movie = {
        $set:{
          poster: updateMovie.poster,
          title: updateMovie.title,
          genres: updateMovie.genres,
          duration: updateMovie.duration,
          year: updateMovie.year,
          rating: updateMovie.rating,
          summary: updateMovie.summary,
        }
      }
      const result = await moviesCollection.updateOne(filter, movie, options)
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



