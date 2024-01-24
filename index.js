const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfz3k0z.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("rentNest").collection('users');
    const featuredHouseCollection = client.db("rentNest").collection('featuredHouse');
    const allHouseCollection = client.db("rentNest").collection('allHouse');
    const reservedHouseCollection = client.db("rentNest").collection('reservedHouse');

    app.post('/users', async(req, res)=> {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/featuredHouse' , async(req, res) => {
      const result = await featuredHouseCollection.find().toArray();
      res.send(result);
    })


    app.get('/allHouse' , async(req, res) => {
      const filter = req.query;
const search = filter.search || '';
const query = {
  title: {$regex: search, $options: 'i'}
};
const result = await allHouseCollection.find(query).toArray();
res.send(result);
    })


     // Getting all product by id for the product details page
    app.get('/allHouse/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const options = {
        projection: {_id: 1, img:1, title:1, description:1, city:1, bedrooms:1, bathrooms:1, availability:1, size:1, price:1, rating:1, houseType:1}
      };
      const result = await allHouseCollection.findOne(query, options);
      res.send(result);
      
    })

    app.get('/featuredHouse/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const options = {
        projection: {_id: 1, img:1, title:1, description:1, city:1, bedrooms:1, bathrooms:1, availability:1, size:1, price:1, rating:1, houseType:1}
      };
      const result = await featuredHouseCollection.findOne(query, options);
      res.send(result);
      
    })


    app.post('/reservedHouse', async(req, res)=> {
      const user = req.body;
      const query = {email: user.email};
      const isReserveEsists = await reservedHouseCollection.countDocuments(query);
      if(isReserveEsists >= 2 ){
        return res.send({ message: 'Can not reserve two house at a time', insertedId: null})
      }
      const result = await reservedHouseCollection.insertOne(user);
      res.send(result);
  })



      app.post('/allHouse', async(req, res) => {
      const houseInfo = req.body;
      const result = await allHouseCollection.insertOne(houseInfo);
      res.send(result);
    });


        // Get house data for specific user
        app.get('/allHouse' , async(req, res)=>{
          const email = req.query.email;
          const query = {email : email};
          const cursor = allHouseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });


    // app.put('/heroSection/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const query = {_id : new ObjectId(id)};
    //   const updatedData = req.body;
    //   const updatedDoc = {
    //     $set : {
    //       subtitle: updatedData.subtitle,
    //       title: updatedData.title,
    //       description: updatedData.description,
    //       currentPrice: updatedData.currentPrice,
    //       image: updatedData.image
    //     }
    //   }
    //   const result = await heroSectionCollection.updateOne(query, updatedDoc);
    //   res.send(result);
    // })

    // app.post('/heroSection', async(req, res) => {
    //   const item = req.body;
    //   const result = await heroSectionCollection.insertOne(item);
    //   res.send(result);
    // })


    // app.get('/allProducts', async(req, res) => {
    //   const result = await allProductsCollection.find().toArray();
    //   res.send(result);
    // })







    // app.post('/wishlist', async(req, res) => {
    //   const cartItem = req.body;
    //   const result = await wishlistCollection.insertOne(cartItem);
    //   res.send(result);
    // });

    //     // Get wishlist data for specific user
    //     app.get('/wishlist' , async(req, res)=>{
    //       const email = req.query.email;
    //       const query = {email : email};
    //       const cursor = wishlistCollection.find(query);
    //         const result = await cursor.toArray();
    //         res.send(result)
    //     });










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
    res.send("Rent Is Going")
})

app.listen(port, () => {
    console.log(`Rent Is Going on port ${port}`);
})