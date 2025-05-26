import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const reviewService = { query, remove, add }

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review_db')

    var reviews = await collection
      .aggregate([
        {
          $match: criteria
        },
        {
          $lookup: {
            localField: 'byUserId',
            from: 'user_db',
            foreignField: '_id',
            as: 'byUser'
          }
        },
        {
          $unwind: '$byUser'
        },
        {
          $lookup: {
            localField: 'aboutToyId',
            from: 'toy_db',
            foreignField: '_id',
            as: 'aboutToy'
          }
        },
        {
          $unwind: '$aboutToy'
        },
        {
          $project: {
            txt: true,
            createdAt: { $toDate: '$_id' },
            'byUser._id': true,
            'byUser.fullname': true,
            'aboutToy._id': true,
            'aboutToy.name': true,
            'aboutToy.price': true
          }
        }
      ])
      .toArray()

    return reviews
  } catch (err) {
    loggerService.error('cannot get reviews', err)
    throw err
  }
}

async function remove(reviewId) {
  try {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const collection = await dbService.getCollection('review_db')

    const criteria = { _id: ObjectId.createFromHexString(reviewId) }

    // remove only if user is owner/admin
    if (!loggedinUser.isAdmin) {
      criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
    }

    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      byUserId: ObjectId.createFromHexString(review.byUserId),
      aboutToyId: ObjectId.createFromHexString(review.aboutToyId),
      txt: review.txt
    }

    const collection = await dbService.getCollection('review_db')
    await collection.insertOne(reviewToAdd)

    return reviewToAdd
  } catch (err) {
    loggerService.error('cannot add review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.byUserId) {
    criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
  }

  if (filterBy.aboutToyId) {
    criteria.aboutToyId = ObjectId.createFromHexString(filterBy.aboutToyId)
  }
  return criteria
}
