import { toyService } from './toyService'
import { loggerService } from '../../services/loggerService'

// **************** Toys ****************:
export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || '',
      inStock: req.query.inStock,
      labels: req.query.labels ? req.query.labels.split(',') : []
    }

    const sortBy = {
      type: req.query.sortType || '',
      desc: req.query.sortDesc || 1
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
    const toyId = req.params.id
    const toy = await toyService.get(toyId)
    res.status(200).send(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

export async function addToy(req, res) {
  try {
    const toy = req.body
    const savedToy = await toyService.save(toy)
    res.status(200).send(savedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const toy = { ...req.body, _id: req.params.id }
    const updateToy = await toyService.save(toy)
    res.status(200).send(updateToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const deletedCount = await toyService.remove(toyId)
    res.status(200).send(`${deletedCount} toys removed`)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

// **************** Labels ****************:

export async function getLabels(req, res) {
  try {
    const labels = await toyService.getLabels()
    res.status(200).send(labels)
  } catch (err) {
    logger.error('Cannot get labels', err)
    res.status(500).send({ err: 'Cannot get labels' })
  }
}

export async function getLabelsCount(req, res) {
  try {
    const labelsCount = await toyService.getLabelsCount()
    res.status(200).send(labelsCount)
  } catch (err) {
    logger.error('Cannot get labels count', err)
    res.status(500).send({ err: 'Cannot get labels count' })
  }
}

// **************** Msgs ****************:

export async function addToyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
      createdAt: Date.now()
    }
    const savedMsg = await toyService.addToyMsg(toyId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const { msgId } = req.params

    const removedId = await toyService.removeToyMsg(toyId, msgId)
    res.status(200).send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy msg', err)
    res.status(500).send({ err: 'Failed to remove toy msg' })
  }
}
