// Require environment variables from .env
require('dotenv').config()

// Register babel for transpiling new `require` calls
require('babel-register')

// Run server
require('./server')
