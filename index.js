const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m3bow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carmechanic');
        const serviceCollection = database.collection('services');

        //Get api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;       // [req er params theke id pawa jay]
            // console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //POST api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitiing the post api')
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        //Delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }


}

run().catch(console.dir);



// get root|default api
app.get('/', (req, res) => {
    res.send('welcome to my server')
})

app.listen(port, () => {
    console.log('hitting the port no', port)
})

