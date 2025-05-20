import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

import { ObjectId } from 'mongodb'


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
    const collection = await dbService.getCollection('user_db')
    var users = await collection.find(criteria).sort({ username: 1 }).toArray()
    users = users.map((user) => {
      delete user.password
      // user.isHappy = true
      user.createdAt = user._id.getTimestamp()
      return user
    })
    return users
  } catch (err) {
    loggerService.error('Cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user_db')
    const user = await collection.findOne({
      _id: ObjectId.createFromHexString(userId)
    })
    delete user.password
    return user
  } catch (err) {
    loggerService.error(`While finding user ${userId}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user_db')
    await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
  } catch (err) {
    loggerService.error(`Cannot remove user ${userId}`, err)
    throw err
  }
}

async function add(user) {
  try {
    const { username, password, fullname } = user
    if (!username || !password || !fullname) {
      throw new Error('User details are missing')
    }

    const existUser = await getByUsername(user.username)
    if (existUser) throw new Error('Username taken')

    const userToAdd = {
      username,
      password,
      fullname,
      isAdmin: false
      // score: user.score || 0,
    }
    const collection = await dbService.getCollection('user_db')
    await collection.insertOne(userToAdd)
    
    delete userToAdd.password
    return userToAdd
  } catch (err) {
    loggerService.error('Cannot insert user', err)
    throw err
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user_db')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    loggerService.error(`While finding user ${username}`, err)
    throw err
  }
}

async function update(user) {
  console.log('user: ', user)
  try {
    const { _id, username, fullname } = user
    const userId = ObjectId.createFromHexString(_id)
    const userToSave = { username, fullname }

    const collection = await dbService.getCollection('user_db')
    await collection.updateOne({ _id: userId }, { $set: userToSave })
    return { _id: userId, ...userToSave }
  } catch (err) {
    loggerService.error(`Cannot update user ${user._id}`, err)
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
