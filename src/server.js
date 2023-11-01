import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import knex from 'knex'

import {handleRegister} from './controllers/register.js'
import { handleSignin } from './controllers/signin.js'
import { handleProfile } from './controllers/profile.js'
import { handleApiCall, handleImage } from './controllers/image.js'

const app = express()
const PORT = 4000
 
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', 
      port: 5432, 
      user : 'postgres', 
      password : 'postgres', 
      database : 'smart-brain' 
    }
})

// Middlewares
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cors())

// Routes
app.get('/', (req,res) => { res.json({status: 'sucess'})})
app.post('/signin', handleSignin(db,bcrypt))
app.post('/register', handleRegister(db,bcrypt))
app.get('/profile/:id', handleProfile(db))
app.put('/image', handleImage(db))
app.post('/image', handleApiCall)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
