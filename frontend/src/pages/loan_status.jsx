import {useState,useEffect} from 'react'
import {use_toast} from '../context/toast_context'
import format_pkr from '../utils/format_pkr'

function Loan_Status(){
  const [loans,set_loans] = useState([])
  const [sort,set_sort] = useState('none')
  const {show_toast} = use_toast()

  useEffect(()=>{
fetch('https://perpetual-kindness-production-b858.up.railway.app/api/loans')      .then(r=>r.json())
      .then(data=>set_loans(data))
  },[])

  function update_status(id,status){
    fetch(`https://perpetual-kindness-production-b858.up.railway.app/api/loans/${id}/status`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({status})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.error){show_toast(data.error,'error');return}
      set_loans(loans.map(l=>l.id===id?data:l))
      show_toast(`Loan ${status}!`,'success')
    })
  }

  const pending = loans.filter(l=>l.status==='pending').length
  const approved = loans.filter(l=>l.status==='approved').length
  const rejected = loans.filter(l=>l.status==='rejected').length

  let sorted = [...loans]
  if(sort==='high') sorted.sort((a,b)=>b.amount-a.amount)
  if(sort==='low') sorted.sort((a,b)=>a.amount-b.amount)
  if(sort==='status') sorted.sort((a,b)=>a.status.localeCompare(b.status))

  return(
    <div>
      <h2>Loan Applications</h2>

      <div className='summary_bar'>
        <p>Pending: {pending}</p>
        <p>Approved: {approved}</p>
        <p>Rejected: {rejected}</p>
      </div>

      <select value={sort} onChange={e=>set_sort(e.target.value)}>
        <option value='none'>Sort By</option>
        <option value='high'>Amount: High to Low</option>
        <option value='low'>Amount: Low to High</option>
        <option value='status'>Status</option>
      </select>

      {loans.length===0&&<p>No loan applications yet.</p>}

      <div className='loans_grid'>
        {sorted.map(l=>(
          <div key={l.id} className='loan_card'>
            <div className='loan_front'>
              <h3>{l.applicant}</h3>
              <p>Amount: {format_pkr(l.amount)}</p>
              <p>Purpose: {l.purpose}</p>
              <p>Tenure: {l.tenure} months</p>
              <span className={`badge badge_${l.status}`}>{l.status}</span>
            </div>
            <div className='loan_back'>
              <p>Loan ID: {l.id}</p>
              <p>Status: {l.status}</p>
              <button onClick={()=>update_status(l.id,'approved')}>✅ Approve</button>
              <button onClick={()=>update_status(l.id,'rejected')}>❌ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loan_Status