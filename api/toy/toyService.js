import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/loggerService.js'
import { utilService } from '../../services/util.service.js'

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
  getById,
  remove,
  add,
  update,
  getLabels,
  getLabelsCount,
  addMsg,
  removeMsg
}

async function query(filterBy = {}, sortBy = {}, pageIdx) {
  try {
    const criteria = _buildCriteria(filterBy)
    const sortOptions = _buildSort(sortBy)

    const collection = await dbService.getCollection(dbName)
    const skip = pageIdx !== undefined ? pageIdx * PAGE_SIZE : 0

    const filteredToys = await collection
      .find(criteria)
      .collation({ locale: 'en' })
      .sort(sortOptions)
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray()

    const totalCount = filteredToys.length
    const maxPage = Math.ceil(totalCount / PAGE_SIZE)

    return { toys: filteredToys, maxPage }
  } catch (err) {
    loggerService.error('Failed to query toys', err)
    throw err
  }
}

async function getById(toyId) {
  try {
    // TODO - use zod library for that
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

async function add(toy) {
  try {
    toy.inStock = true
    const collection = await dbService.getCollection(dbName)
    await collection.insertOne(toy)
    return toy
  } catch (err) {
    loggerService.error('Cannot insert toy', err)
    throw err
  }
}

async function update(toy) {
  try {
    const { name, price, labels } = toy
    const toyToUpdate = {
      name,
      price,
      labels
    }
    const collection = await dbService.getCollection(dbName)
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toy._id) },
      { $set: toyToUpdate }
    )
    return toy
  } catch (err) {
    loggerService.error(`Cannot update toy ${toy._id}`, err)
    throw err
  }
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

async function addMsg(toyId, msg) {
  try {
    msg.id = utilService.makeId()

    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toyId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    loggerService.error(`Cannot add message to toy ${toyId}`, err)
    throw err
  }
}

async function removeMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toyId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (error) {
    loggerService.error(`Cannot remove message from toy ${toyId}`, error)
    throw error
  }
}

function _buildCriteria(filterBy) {
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

function _buildSort(sortBy) {
  const sortOptions = {}
  if (sortBy.type) {
    const direction = +sortBy.desc
    sortOptions[sortBy.type] = direction
  } else sortCriteria.createdAt = -1
  return sortOptions
}
