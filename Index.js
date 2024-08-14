import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './modules/user/index.js'

dotenv.config();
const app = express()
app.use(express.json())
app.use(cors())

app.use('/user',userRouter)

app.get('/',(req,res)=>{
    res.send('Hello World')
})

const port = process.env.PORT || 3000
const db_url =process.env.MONGODB_URL

mongoose.connect(db_url).then(()=>{
    console.log('Connected to MongoDB')
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
})
}).catch((error)=>{
    console.log(error)
})