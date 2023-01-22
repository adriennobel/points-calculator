import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/hello', (req, res) => {
    res.send('Hello!');
});

app.post('/api/customer/enroll', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bookingdaysdb.nvf7jlo.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);

    const newID = Date.now().toString();

    const newCustomer = {
        _id: newID,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }

    try {
        await client.connect();
        await enrollThisCustomer(client, newCustomer);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    async function enrollThisCustomer(client, newCustomer) {
        const result = await client.db("points-calculator").collection("CustomerObjects").insertOne(newCustomer);
        res.send(`${req.body.firstName} ${req.body.lastName} was enrolled with the following id: ${result.insertedId}`);
        // res.send(newCustomer);
        console.log(`New customer enrolled with the following id: ${result.insertedId}`);
    }
});

app.get('/api/customer/check/:customerID', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bookingdaysdb.nvf7jlo.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);

    const { customerID } = req.params;

    try {
        await client.connect();
        await findThisCustomer(client, customerID);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    async function findThisCustomer(client, customerID) {
        const result = await client.db("points-calculator").collection("CustomerObjects").findOne({
            _id: customerID
        });

        if (result) {
            console.log(result);
            // res.send(`Welcome back, ${result.firstName} (id: ${customerID})`);
            res.send(result);
        } else {
            console.log(`${customerID} not found`);
            // res.send(`We didn't find an entry for id: ${customerID}`);
            // res.send({ empty: "" });
            res.send("null");
            // res.sendStatus(404);
        }
    }

});

app.post('/api/sale/record', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bookingdaysdb.nvf7jlo.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);

    const newID = Date.now().toString();

    const newSale = {
        _id: newID,
        customerID: req.body.customerID,
        sale: "$" + req.body.sale,
        points: req.body.points,
        date: new Date(`${req.body.date}`)
    }

    try {
        await client.connect();
        await recordThisSale(client, newSale);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    async function recordThisSale(client, newSale) {
        const result = await client.db("points-calculator").collection("TransactionObjects").insertOne(newSale);
        res.send(`New sale recorded today ${req.body.date} (id: ${result.insertedId})`);
        // res.send(newCustomer);
        console.log(`New sale recorded with the following id: ${result.insertedId}`);
    }
});


app.get('/api/transaction/calcpoints/:customerID/:fromdate', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bookingdaysdb.nvf7jlo.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);

    const { customerID } = req.params;
    const { fromdate } = req.params;

    try {
        await client.connect();
        await calcPoints(client, customerID, fromdate);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    async function calcPoints(client, customerID, fromdate) {
        const cursor = client.db("points-calculator").collection("TransactionObjects").find({
            customerID: customerID,
            date: { $gte: new Date(`${fromdate}`) }
        });

        const result = await cursor.toArray();

        if (result) {
            // console.log(result);
            // res.send(`Welcome back, ${result.firstName} (id: ${customerID})`);
            res.send(result);
        } else {
            console.log(`${customerID} not found`);
            res.send(`We didn't find an entry for id: ${customerID}`);
            // res.sendStatus(404);
        }
    }

});


app.listen(8001, () => {
    console.log('Server is listening on port 8001');
});