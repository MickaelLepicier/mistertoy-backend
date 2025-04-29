import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { toyService } from './services/toyService.js'
import { loggerService } from './services/loggerService.js'

const app = express()

app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174'
    ],
    credentials: true
  }
  app.use(cors(corsOptions))
}

// **************** Toys API ****************:
app.get('/api/toy', (req, res) => {
  const { filterBy = {}, sortBy = {}, pageIdx = 0 } = req.query
  toyService
    .query(filterBy, sortBy, +pageIdx)
    .then((toys) => res.send(toys))
    .catch((err) => {
      loggerService.error('Cannot load toys', err)
      res.status(400).send('Cannot load toys')
    })
})

app.get('/api/toy/labels', (req, res) => {
  return toyService
    .getLabels()
    .then((labels) => {
      res.send(labels)
    })
    .catch((err) => {
      loggerService.error('Cannot get labels', err)
      res.status(400).send(err)
    })
})

app.get('/api/toy/labels/count', (req, res) => {
  return toyService
    .getLabelsCount()
    .then((labelsCount) => res.send(labelsCount))
    .catch((err) => {
      loggerService.error('Cannot get labels count', err)
      res.status(400).send(err)
    })
})

app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  return toyService
    .get(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error('Cannot get toy', err)
      res.status(400).send(err)
    })
})

app.post('/api/toy', (req, res) => {
  const { name, price, labels } = req.body
  const toy = {
    name,
    price: +price,
    labels
  }
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => {
      loggerService.error('Cannot add toy', err)
      res.status(400).send('Cannot add toy')
    })
})

app.put('/api/toy', (req, res) => {
  const { name, price, _id, labels, inStock } = req.body
  const toy = {
    _id,
    name,
    price: +price,
    labels,
    inStock
  }
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => {
      loggerService.error('Cannot update toy', err)
      res.status(400).send('Cannot update toy')
    })
})

app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .remove(toyId)
    .then(() => {
      res.send()
    })
    .catch((err) => {
      loggerService.error('Cannot delete toy', err)
      res.status(400).send('Cannot delete toy', err)
    })
})

//* In production with Render
// app.get('/api/apikey', (req, res) => {
//    res.send(process.env.API_KEY)
// })

// Fallback
// app.get('/**', (req, res) => {
//   res.sendFile(path.resolve('public/index.html'))
// })

const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})

// http://127.0.0.1:3030/