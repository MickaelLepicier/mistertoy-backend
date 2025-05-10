import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { toyService } from './services/toyService.js'
import { loggerService } from './services/loggerService.js'
import { fileURLToPath } from 'url'


// TODOs:
// [v] Add data to MongoDB
// [v] Play with MongoDB shell commands
// [] Change server to MongoDB
// 
// 

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

loggerService.info('server.js loaded...')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))



if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.resolve(__dirname,'public')))
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

import { toyRoutes } from './api/toy/toyRoutes.js'


app.use('/api/toy', toyRoutes)


// **************** Toys API ****************:
app.get('/api/toy', async (req, res) => {
  const { filterBy = {}, sortBy = {}, pageIdx = 0 } = req.query

  try {
    const toys = await toyService.query(filterBy, sortBy, +pageIdx)
    res.status(200).send(toys)
  } catch (err) {
    loggerService.error('Cannot load toys', err)
    res.status(500).send('Cannot load toys')
  }
})

app.get('/api/toy/labels', async (req, res) => {
  try {
    const labels = await toyService.getLabels()
    res.status(200).send(labels)
  } catch (err) {
    loggerService.error('Cannot get labels', err)
    res.status(500).send(err)
  }
})

app.get('/api/toy/labels/count', async (req, res) => {
  try {
    const labelsCount = await toyService.getLabelsCount()
    res.status(200).send(labelsCount)
  } catch (err) {
    loggerService.error('Cannot get labels count', err)
    res.status(500).send(err)
  }
})

app.get('/api/toy/:toyId', async (req, res) => {
  const { toyId } = req.params

  try {
    const toy = await toyService.get(toyId)
    res.status(200).send(toy)
  } catch (err) {
    loggerService.error('Cannot get toy', err)
    res.status(500).send(err)
  }
})

app.post('/api/toy', async (req, res) => {
  const { name, price, labels } = req.body
  const toy = {
    name,
    price: +price,
    labels
  }

  try {
    const savedToy = await toyService.save(toy)
    res.status(200).send(savedToy)
  } catch (err) {
    loggerService.error('Cannot add toy', err)
    res.status(500).send('Cannot add toy')
  }
})

app.put('/api/toy', async (req, res) => {
  const { name, price, _id, labels, inStock } = req.body
  const toy = {
    _id,
    name,
    price: +price,
    labels,
    inStock
  }

  try {
    const savedToy = await toyService.save(toy)
    res.status(200).send(savedToy)
  } catch (err) {
    loggerService.error('Cannot update toy', err)
    res.status(500).send('Cannot update toy')
  }
})

app.delete('/api/toy/:toyId', async (req, res) => {
  const { toyId } = req.params

  try {
    await toyService.remove(toyId)
    res.status(200).send()
  } catch (err) {
    loggerService.error('Cannot delete toy', err)
    res.status(500).send('Cannot delete toy')
  }
})

//* In production with Render
// app.get('/api/apikey', (req, res) => {
//    res.send(process.env.API_KEY)
// })

// Fallback
app.get('/*all', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})

// http://127.0.0.1:3030/
