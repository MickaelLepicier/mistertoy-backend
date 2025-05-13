import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/loggerService.js'

import { ObjectId } from 'mongodb'
const dbName = 'user_db'

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection(dbName)
    var users = await collection.find(criteria).sort({ username: 1 }).toArray()
    users = users.map((user) => {
      delete user.password
      // user.isHappy = true
      user.createdAt = user._id.getTimestamp()
      return user
    })
    return users
  } catch (err) {
    loggerService.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection(dbName)
    const user = await collection.findOne({
      _id: ObjectId.createFromHexString(userId)
    })
    delete user.password
    return user
  } catch (err) {
    loggerService.error(`while finding user ${userId}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection(dbName)
    await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
  } catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function add(user) {
  try {
    const existUser = await getByUsername(user.username)
    if (existUser) throw new Error('Username taken')

    const userToAdd = {
      username: user.username,
      password: user.password,
      fullname: user.fullname,
	  isAdmin: false,
      // score: user.score || 0,
    }
    const collection = await dbService.getCollection(dbName)
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    loggerService.error('cannot insert user', err)
    throw err
  }
}

async function getByUsername(username) {
	try {
	  const collection = await dbService.getCollection(dbName)
	  const user = await collection.findOne({ username })
	  return user
	} catch (err) {
	  loggerService.error(`while finding user ${username}`, err)
	  throw err
	}
  }

  async function update(user) {
	try {
	  const userToSave = {
		_id: ObjectId.createFromHexString(user._id),
		username: user.username,
		fullname: user.fullname
		// score: user.score,
	  }
	  const collection = await dbService.getCollection(dbName)
	  await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
	  return userToSave
	} catch (err) {
	  loggerService.error(`cannot update user ${user._id}`, err)
	  throw err
	}
  }


function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria
      },
      {
        fullname: txtCriteria
      }
    ]
  }
  // if (filterBy.minBalance) {
  // 	criteria.score = { $gte: filterBy.minBalance }
  // }
  return criteria
}
