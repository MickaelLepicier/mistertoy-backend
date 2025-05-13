import { MongoClient } from 'mongodb'

const filter = { balance: { $gt: 400 } }

const projection = {
	fullName: true,
	balance: true,
}

const sort = {
	balance: -1,
}

const skip = 1
const limit = 3

const client = await MongoClient.connect('mongodb://localhost:27017/')
const coll = client.db('CaEveJul24').collection('customer')

const cursor = coll.find(filter, { projection, sort, skip, limit })
const result = await cursor.toArray()
await client.close()
