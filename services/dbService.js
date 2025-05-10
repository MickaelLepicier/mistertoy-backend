import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'

export const dbService = {
	getCollection,
}

// Connection URL
const url = 'mongodb://localhost:27017'

// Database name
const dbName = 'toy_db'

var dbConn = null

async function getCollection(collectionName) {
	try {
		const db = await _connect()
		const collection = await db.collection(collectionName)
		return collection
	} catch (err) {
		logger.error('Failed to get Mongo collection', err)
		throw err
	}
}

async function _connect() {
	if (dbConn) return dbConn
	try {
		// const client = await MongoClient.connect(config.dbURL, { useUnifiedTopology: true })
		const client = await MongoClient.connect(url)
		const db = client.db(dbName)
		// const client = await MongoClient.connect(config.dbURL)
		// const db = client.db(config.dbName)
		dbConn = db
		return db
	} catch (err) {
		logger.error('Cannot Connect to DB', err)
		throw err
	}
}
