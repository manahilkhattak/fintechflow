const express = require('express')
const router = express.Router()

let wallet = {balance:0,currency:'PKR',owner:'User'}
let transactions = []
let tx_id = 1

router.get('/',(req,res)=>{
  res.json(wallet)
})

router.post('/deposit',(req,res)=>{
  const {amount} = req.body
  if(!amount||amount<=0) return res.status(400).json({error:'amount must be positive'})
  wallet.balance+=amount
  transactions.unshift({id:tx_id++,type:'credit',amount,timestamp:new Date(),description:'Deposit'})
  res.json(wallet)
})

router.post('/withdraw',(req,res)=>{
  const {amount} = req.body
  if(!amount||amount<=0) return res.status(400).json({error:'amount must be positive'})
  if(wallet.balance<amount) return res.status(400).json({error:'insufficient funds'})
  wallet.balance-=amount
  transactions.unshift({id:tx_id++,type:'debit',amount,timestamp:new Date(),description:'Withdrawal'})
  res.json(wallet)
})

router.get('/transactions',(req,res)=>{
  const {type} = req.query
  let result = transactions
  if(type) result = transactions.filter(t=>t.type===type)
  res.json(result)
})

module.exports = router