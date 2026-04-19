import {useState,useEffect} from 'react'
import format_pkr from '../utils/format_pkr'

function use_count_up(target){
  const [display,set_display] = useState(0)
  useEffect(()=>{
    let start = 0
    const step = target/50
    const interval = setInterval(()=>{
      start+=step
      if(start>=target){set_display(target);clearInterval(interval)}
      else set_display(Math.floor(start))
    },20)
    return ()=>clearInterval(interval)
  },[target])
  return display
}

function Emi_Calculator(){
  const [principal,set_principal] = useState('')
  const [rate,set_rate] = useState('')
  const [months,set_months] = useState('')
  const [result,set_result] = useState(null)
  const [table,set_table] = useState([])
  const [error,set_error] = useState('')

  const emi_display = use_count_up(result?result.emi:0)
  const total_display = use_count_up(result?result.total_payable:0)
  const interest_display = use_count_up(result?result.total_interest:0)

  function calculate(){
    if(!principal||!rate||!months){set_error('All fields are required');return}
    set_error('')
    fetch(`http://localhost:5000/api/emi-calculator?principal=${principal}&annualRate=${rate}&months=${months}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.error){set_error(data.error);return}
        set_result(data)
        build_table(data.emi)
      })
  }

  function build_table(emi){
    const r = parseFloat(rate)/100/12
    let balance = parseFloat(principal)
    const rows = []
    for(let i=1;i<=parseInt(months);i++){
      const interest = balance*r
      const principal_comp = emi-interest
      balance = balance-principal_comp
      rows.push({
        month:i,
        principal_comp:parseFloat(principal_comp.toFixed(2)),
        interest:parseFloat(interest.toFixed(2)),
        balance:parseFloat(balance.toFixed(2))
      })
    }
    set_table(rows)
  }

  return(
    <div>
      <h2>EMI Calculator</h2>

      <div className='form_box'>
        <input type='number' placeholder='Principal (PKR)' value={principal} onChange={e=>set_principal(e.target.value)}/>
        <input type='number' placeholder='Annual Interest Rate (%)' value={rate} onChange={e=>set_rate(e.target.value)}/>
        <input type='number' placeholder='Tenure (months)' value={months} onChange={e=>set_months(e.target.value)}/>
        {error&&<span className='error'>{error}</span>}
        <button onClick={calculate}>Calculate</button>
      </div>

      {result&&(
        <div>
          <div className='stat_cards'>
            <div className='stat_card'>
              <p>Monthly EMI</p>
              <h3>{format_pkr(emi_display)}</h3>
            </div>
            <div className='stat_card'>
              <p>Total Payable</p>
              <h3>{format_pkr(total_display)}</h3>
            </div>
            <div className='stat_card'>
              <p>Total Interest</p>
              <h3>{format_pkr(interest_display)}</h3>
            </div>
          </div>

          <div className='breakdown_bar'>
            <div className='principal_bar' style={{width:`${(parseFloat(principal)/result.total_payable)*100}%`}}>
              Principal
            </div>
            <div className='interest_bar' style={{width:`${(result.total_interest/result.total_payable)*100}%`}}>
              Interest
            </div>
          </div>

          <table className='emi_table'>
            <thead>
              <tr>
                <th>Month</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row,i)=>(
                <tr key={row.month} style={{background:i%2===0?'#f9f9f9':'white'}}>
                  <td>{row.month}</td>
                  <td>{format_pkr(row.principal_comp)}</td>
                  <td>{format_pkr(row.interest)}</td>
                  <td>{format_pkr(Math.max(0,row.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Emi_Calculator