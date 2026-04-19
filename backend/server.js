const express = require('express')
const cors = require('cors')
const wallet_routes = require('./routes/wallet')
const loan_routes = require('./routes/loans')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/wallet',wallet_routes)
app.use('/api',loan_routes)

app.listen(5000,()=>{
  console.log('server running on port 5000')
})