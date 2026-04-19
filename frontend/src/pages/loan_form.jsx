import {useState} from 'react'
import {use_toast} from '../context/toast_context'

function Loan_Form(){
  const [step,set_step] = useState(1)
  const [form,set_form] = useState({applicant:'',cnic:'',contact:'',amount:'',purpose:'Business',tenure:'',})
  const [errors,set_errors] = useState({})
  const [loan_id,set_loan_id] = useState(null)
  const {show_toast} = use_toast()

  function handle_change(e){
    set_form({...form,[e.target.name]:e.target.value})
  }

  function validate_step1(){
    const e = {}
    if(!form.applicant) e.applicant='Name is required'
    if(!/^\d{5}-\d{7}-\d$/.test(form.cnic)) e.cnic='Format must be XXXXX-XXXXXXX-X'
    if(!form.contact) e.contact='Contact is required'
    set_errors(e)
    return Object.keys(e).length===0
  }

  function validate_step2(){
    const e = {}
    if(form.amount<5000||form.amount>5000000) e.amount='Amount must be between PKR 5,000 and 5,000,000'
    if(form.tenure<3||form.tenure>60) e.tenure='Tenure must be between 3 and 60 months'
    set_errors(e)
    return Object.keys(e).length===0
  }

  function next_step(){
    if(step===1&&!validate_step1()) return
    if(step===2&&!validate_step2()) return
    set_step(step+1)
  }

  function submit(){
    fetch('http://localhost:5000/api/loans/apply',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        applicant:form.applicant,
        amount:parseFloat(form.amount),
        purpose:form.purpose,
        tenure:parseInt(form.tenure)
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.error){show_toast(data.error,'error');return}
      set_loan_id(data.id)
      show_toast('Loan applied successfully!','success')
    })
  }

  if(loan_id){
    return(
      <div>
        <h2>✅ Application Submitted!</h2>
        <p>Your Loan ID is: <strong>{loan_id}</strong></p>
        <button onClick={()=>{set_loan_id(null);set_step(1);set_form({applicant:'',cnic:'',contact:'',amount:'',purpose:'Business',tenure:''})}}>Apply Another</button>
      </div>
    )
  }

  return(
    <div>
      <h2>Loan Application</h2>

      <div className='progress_bar'>
        <div className='progress_fill' style={{width:`${(step/3)*100}%`}}></div>
      </div>
      <p>Step {step} of 3</p>

      {step===1&&(
        <div className='form_box'>
          <h3>Personal Info</h3>
          <input name='applicant' placeholder='Full Name' value={form.applicant} onChange={handle_change}/>
          {errors.applicant&&<span className='error'>{errors.applicant}</span>}
          <input name='cnic' placeholder='CNIC (XXXXX-XXXXXXX-X)' value={form.cnic} onChange={handle_change}/>
          {errors.cnic&&<span className='error'>{errors.cnic}</span>}
          <input name='contact' placeholder='Contact Number' value={form.contact} onChange={handle_change}/>
          {errors.contact&&<span className='error'>{errors.contact}</span>}
        </div>
      )}

      {step===2&&(
        <div className='form_box'>
          <h3>Loan Details</h3>
          <input name='amount' type='number' placeholder='Amount (PKR)' value={form.amount} onChange={handle_change}/>
          {errors.amount&&<span className='error'>{errors.amount}</span>}
          <select name='purpose' value={form.purpose} onChange={handle_change}>
            <option>Business</option>
            <option>Education</option>
            <option>Medical</option>
            <option>Personal</option>
          </select>
          <input name='tenure' type='number' placeholder='Tenure (months)' value={form.tenure} onChange={handle_change}/>
          {errors.tenure&&<span className='error'>{errors.tenure}</span>}
        </div>
      )}

      {step===3&&(
        <div className='form_box'>
          <h3>Review & Submit</h3>
          <p>Name: {form.applicant}</p>
          <p>CNIC: {form.cnic}</p>
          <p>Contact: {form.contact}</p>
          <p>Amount: PKR {form.amount}</p>
          <p>Purpose: {form.purpose}</p>
          <p>Tenure: {form.tenure} months</p>
        </div>
      )}

      <div className='btn_row'>
        {step>1&&<button onClick={()=>set_step(step-1)}>Back</button>}
        {step<3&&<button onClick={next_step}>Next</button>}
        {step===3&&<button onClick={submit}>Submit</button>}
      </div>
    </div>
  )
}

export default Loan_Form