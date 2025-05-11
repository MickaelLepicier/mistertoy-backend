import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'
import { userService } from '../api/user/userService.js'
import { loggerService } from './loggerService.js'

export const dbService = {
	getCollection,
}

// Connection URL
const url = 'mongodb://localhost:27017'

// Database name
const dbName = 'mistertoy_db'

var dbConn = null

async function getCollection(collectionName) {
	try {
		const db = await _connect()
		const collection = await db.collection(collectionName)
		return collection
	} catch (err) {
		loggerService.error('Failed to get Mongo collection', err)
		throw err
	}
}
// QUESTION:
// do I really need config.dbURL?
// change to config.dbURL

// do I need toyRoutes.get('/labels', getLabels) in the toyRoutes?
// don't need this - toyRoutes.get('/labels/count', getLabelsCount)

// how are my Commits?
// don't touch what inside the gitHub later on look that all of them start with big letter

async function _connect() {
	if (dbConn) return dbConn
	try {
		// const client = await MongoClient.connect(config.dbURL, { useUnifiedTopology: true })
		// const client = await MongoClient.connect(config.dbURL)
		// const db = client.db(config.dbName)

		const client = await MongoClient.connect(url)
		const db = client.db(dbName)
		dbConn = db
		return db
	} catch (err) {
		loggerService.error('Cannot Connect to DB', err)
		throw err
	}
}
