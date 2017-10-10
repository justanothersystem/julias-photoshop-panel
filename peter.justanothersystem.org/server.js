import express from 'express'
import path from 'path'
import compression from 'compression'

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// compress responses with gzip
app.use(compression())

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.get('/', (req, res) => {
  // Calculate Amazon Web Services post policy.

  /*
  const expirationDate = new Date()
  expirationDate.setUTCDate(expirationDate.getUTCDate() + 1)

  const postPolicy = {
    'expiration': expirationDate.toISOString(),
    'conditions': [
      {'acl': 'public-read'},
      {'bucket': 'johnsmith'},
      ['starts-with', '$key', 'user/eric/']
    ]
  }
  */

  res.render('upload')
})

app.get('/panel', (req, res) => {
  res.render('panel')
})

// server setup
app.set('port', process.env.PORT || 7777)

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
