const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors());

const port = 5000

app.get('/', (req, res)=>{
  res.send('hello ema')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  
  app.post('/addProducts', (req, res)=>{
    const products = req.body;
    console.log(products)
    productCollection.insertOne(products)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res)=>{
    productCollection.find({}).limit(81)
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res)=>{
    productCollection.find({key: req.params.key}).limit(81)
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res)=>{
    const productKeys = req.body;
    productCollection.find({key: { $in: productKeys}})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

});


app.listen(port);