import express from   'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import userRoute from './routes/userRoute.js'
import cors from 'cors'
const app= express()
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())


app.use(cors({
    origin: 'http://localhost:5176', 
    credentials: true
}));

app.use('/api/v1/user',userRoute)

// http://localhost:8000/api/v1/user/register

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is listening at port ${PORT

    }`)
})