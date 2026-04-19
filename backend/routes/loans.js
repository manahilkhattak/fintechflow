const express = require('express')
const router = express.Router()

let loans = []
let loan_id = 1

router.post('/loans/apply',(req,res)=>{
  const {applicant,amount,purpose,tenure} = req.body
  if(!applicant||!amount||!purpose||!tenure) return res.status(400).json({error:'all fields required'})
  if(amount<=0) return res.status(400).json({error:'amount must be positive'})
  const loan = {id:loan_id++,applicant,amount,purpose,tenure,status:'pending'}
  loans.push(loan)
  res.status(201).json(loan)
})

router.get('/loans',(req,res)=>{
  res.json(loans)
})

router.patch('/loans/:id/status',(req,res)=>{
  const {status} = req.body
  if(status!=='approved'&&status!=='rejected') return res.status(400).json({error:'invalid status'})
  const loan = loans.find(l=>l.id===parseInt(req.params.id))
  if(!loan) return res.status(404).json({error:'loan not found'})
  loan.status = status
  res.json(loan)
})

router.get('/emi-calculator',(req,res)=>{
  const {principal,annualRate,months} = req.query
  if(!principal||!annualRate||!months) return res.status(400).json({error:'all params required'})
  const p = parseFloat(principal)
  const r = parseFloat(annualRate)/100/12
  const n = parseInt(months)
  const emi = (p*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)
  const total_payable = emi*n
  const total_interest = total_payable-p
  res.json({emi:parseFloat(emi.toFixed(2)),total_payable:parseFloat(total_payable.toFixed(2)),total_interest:parseFloat(total_interest.toFixed(2))})
})

module.exports = router