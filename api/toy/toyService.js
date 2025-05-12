import fs from 'fs'
import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/dbService.js'
import { loggerService } from '../../services/loggerService.js'
import { ObjectId } from 'mongodb'

const PAGE_SIZE = 6
const dbName = 'toy_db'

// const toys = utilService.readJsonFile('data/toy.json')
const labels = [
  'On wheels',
  'Box game',
  'Art',
  'Baby',
  'Doll',
  'Puzzle',
  'Outdoor',
  'Battery Powered'
]

export const toyService = {
  query,
  get,
  remove,
  save,
  getLabels,
  getLabelsCount,
  addToyMsg,
  removeToyMsg
}


async function query(filterBy = {}, sortBy = {}, pageIdx) {
  try {
    const criteria = _buildCriteria(filterBy)
    const sortOptions = _buildSort(sortBy)

    const collection = await dbService.getCollection(dbName)
    const toys = await collection
      .find(criteria)
      .sort(sortOptions)
      .skip(pageIdx !== undefined ? pageIdx * PAGE_SIZE : 0)
      .limit(PAGE_SIZE)
      .toArray()

    return toys
  } catch (err) {
    loggerService.error('Failed to query toys', err)
    throw err
  }
}

async function get(toyId) {
  try {
    if (!ObjectId.isValid(toyId)) {
      loggerService.error('Invalid ObjectId format')
      throw new Error('Invalid ObjectId format')
    }

    const collection = await dbService.getCollection(dbName)
    const toy = await collection.findOne({
      _id: ObjectId.createFromHexString(toyId)
    })
    return toy
  } catch (err) {
    loggerService.error(`Failed to get toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    if (!ObjectId.isValid(toyId)) {
      loggerService.error('Invalid ObjectId format')
      throw new Error('Invalid ObjectId format')
    }

    const collection = await dbService.getCollection(dbName)
    const { deleteCount } = await collection.deleteOne({
      _id: ObjectId.createFromHexString(toyId)
    })
    return deleteCount
  } catch (err) {
    loggerService.error(`Failed to remove toy ${toyId}`, err)
    throw err
  }
}

async function save(toy) {
  const collection = await dbService.getCollection(dbName)
  console.log('toy: ',toy)
  if (toy._id) {
    // Update
    const toyId = toy._id
    delete toy._id
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toyId) },
      { $set: toy }
    )
    toy._id = toyId
  } else {
    // Create
    toy.createdAt = Date.now()
    toy.inStock = true
    await collection.insertOne(toy)
  }
  return toy
}

function getLabels() {
  return Promise.resolve(labels)
}

async function getLabelsCount() {
  try {
    const collection = await dbService.getCollection(dbName)
    const toys = await collection.find().toArray()
    const labelCounts = {}

    toys.forEach((toy) => {
      toy.labels.forEach((label) => {
        if (!labelCounts[label]) labelCounts[label] = { total: 0, inStock: 0 }
        labelCounts[label].total++
        if (toy.inStock) labelCounts[label].inStock++
      })
    })

    return labelCounts
  } catch (err) {
    loggerService.error('Failed to count labels', err)
    throw err
  }
}

async function addToyMsg(toyId, msg) {
  const collection = await dbService.getCollection(dbName)
  await collection.updateOne(
    { _id: new ObjectId(toyId) },
    { $push: { msgs: msg } }
  )
  return msg
}

async function removeToyMsg(toyId, msgId) {
  const collection = await dbService.getCollection(dbName)
  await collection.updateOne(
    { _id: new ObjectId(toyId) },
    { $pull: { msgs: { _id: msgId } } }
  )
  return msgId
}


function _buildCriteria(filterBy){
  const criteria = {}

    if (filterBy.txt) {
      criteria.name = { $regex: filterBy.txt, $options: 'i' }
    }

    if (filterBy.inStock !== undefined) {
      criteria.inStock = JSON.parse(filterBy.inStock)
    }

    if (filterBy.labels && filterBy.labels.length) {
      criteria.labels = { $all: filterBy.labels }
    }
    return criteria
}

function _buildSort(sortBy){
  const sortOptions = {}
    if (sortBy.type) {
      const direction = +sortBy.desc
      sortOptions[sortBy.type] = direction
    }
    return sortOptions
}

/*

function _makeId(length = 5) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const toysStr = JSON.stringify(toys, null, 4)
    fs.writeFile('data/toy.json', toysStr, (err) => {
      if (err) {
        return console.log(err)
      }
      resolve()
    })
  })
}

*/
