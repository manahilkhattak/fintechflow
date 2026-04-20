import {useState,useEffect} from 'react'
import format_pkr from '../utils/format_pkr'

function Transactions(){
  const [transactions,set_transactions] = useState([])
  const [search,set_search] = useState('')
  const [filter,set_filter] = useState('all')

  useEffect(()=>{
fetch('https://perpetual-kindness-production-b858.up.railway.app/api/wallet/transactions')      .then(r=>r.json())
      .then(data=>set_transactions(data))
  },[])

  const filtered = transactions
    .filter(t=>filter==='all'||t.type===(filter==='credits'?'credit':'debit'))
    .filter(t=>t.description.toLowerCase().includes(search.toLowerCase()))

  const total_credits = transactions.filter(t=>t.type==='credit').reduce((sum,t)=>sum+t.amount,0)
  const total_debits = transactions.filter(t=>t.type==='debit').reduce((sum,t)=>sum+t.amount,0)
  const net = total_credits-total_debits

  return(
    <div>
      <h2>Transaction History</h2>

      <div className='summary_bar'>
        <p>Credits: {format_pkr(total_credits)}</p>
        <p>Debits: {format_pkr(total_debits)}</p>
        <p>Net: {format_pkr(net)}</p>
      </div>

      <div className='filters_row'>
        <input
          placeholder='Search transactions...'
          value={search}
          onChange={e=>set_search(e.target.value)}
        />
        <select value={filter} onChange={e=>set_filter(e.target.value)}>
          <option value='all'>All</option>
          <option value='credits'>Credits</option>
          <option value='debits'>Debits</option>
        </select>
      </div>

      {filtered.length===0&&<p>No transactions found.</p>}

      {filtered.map((t,i)=>(
        <div key={t.id} className={`tx_card tx_${t.type}`} style={{animationDelay:`${i*100}ms`}}>
          <span>{t.type==='credit'?'↑':'↓'}</span>
          <span>{t.description}</span>
          <span>{format_pkr(t.amount)}</span>
          <span>{new Date(t.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default Transactions