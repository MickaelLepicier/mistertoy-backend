import { toyService } from './toyService.js'
import { loggerService } from '../../services/loggerService.js'

// **************** Toys ****************:
export async function getToys(req, res) {
  try {
    const { txt, inStock, labels, sortType, sortDesc } = req.query

    const filterBy = {
      txt: txt || '',
      inStock: inStock || undefined,
      labels: labels ? labels.split(',') : []
    }

    const sortBy = {
      type: sortType || '',
      desc: sortDesc || 1
    }
    const pageIdx = req.query.pageIdx ? +req.query.pageIdx : 0

    const toys = await toyService.query(filterBy, sortBy, pageIdx)
    res.status(200).send(toys)
  } catch (err) {
    loggerService.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

export async function getToysById(req, res) {
  try {
    const { toyId } = req.params
    const toy = await toyService.getById(toyId)
    res.status(200).send(toy)
  } catch (err) {
    loggerService.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

export async function addToy(req, res) {
  try {
    const toy = req.body
    const savedToy = await toyService.add(toy)
    res.status(200).send(savedToy)
  } catch (err) {
    loggerService.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const { toyId } = req.params
    const toy = { ...req.body, _id: toyId }
    console.log('updateToy - toy: ', toy)
    const updateToy = await toyService.update(toy)
    res.status(200).send(updateToy)
  } catch (err) {
    loggerService.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const { toyId } = req.params
    const deletedCount = await toyService.remove(toyId)
    res.status(200).send(`${deletedCount} toys removed`)
  } catch (err) {
    loggerService.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

// **************** Labels ****************:

export async function getLabels(req, res) {
  try {
    const labels = await toyService.getLabels()
    res.status(200).send(labels)
  } catch (err) {
    loggerService.error('Cannot get labels', err)
    res.status(500).send({ err: 'Cannot get labels' })
  }
}

export async function getLabelsCount(req, res) {
  try {
    const labelsCount = await toyService.getLabelsCount()
    res.status(200).send(labelsCount)
  } catch (err) {
    loggerService.error('Cannot get labels count', err)
    res.status(500).send({ err: 'Cannot get labels count' })
  }
}

// **************** Msgs ****************:

export async function addToyMsg(req, res) {
  const { loggedinUser } = req

  try {
    const { toyId } = req.params
    const { txt } = req.body
    const { _id, fullname } = loggedinUser

    const msg = {
      txt,
      by: { _id, fullname }
    }
    const addedMsg = await toyService.addMsg(toyId, msg)
    res.json(addedMsg)
  } catch (err) {
    loggerService.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToyMsg(req, res) {
  try {
    const { toyId, msgId } = req.params
    const removedId = await toyService.removeMsg(toyId, msgId)
    res.status(200).send(removedId)
  } catch (err) {
    loggerService.error('Failed to remove toy msg', err)
    res.status(500).send({ err: 'Failed to remove toy msg' })
  }
}
