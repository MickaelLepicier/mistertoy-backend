import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { loggerService } from './services/logger.service.js'
import { fileURLToPath } from 'url'
import { log } from './middlewares/logger.middleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

loggerService.info('server.js loaded...')

const app = express()
// app.use(log)

app.use(express.json())
app.use(cookieParser())
app.set('query parser', 'extended')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
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

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/toy', toyRoutes)

//* In production with Render
app.get('/api/apikey', (req, res) => {
  res.send(process.env.API_KEY)
})

// Fallback
app.get('/*all', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})

// http://127.0.0.1:3030/
