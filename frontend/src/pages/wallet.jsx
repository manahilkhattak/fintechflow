import {useState,useEffect,useRef} from 'react'
import {use_toast} from '../context/toast_context'
import format_pkr from '../utils/format_pkr'

function use_count_up(target){
  const [display,set_display] = useState(0)
  useEffect(()=>{
    let start = 0
    const step = target/50
    const interval = setInterval(()=>{
      start += step
      if(start>=target){set_display(target);clearInterval(interval)}
      else set_display(Math.floor(start))
    },20)
    return ()=>clearInterval(interval)
  },[target])
  return display
}

function Wallet(){
  const [wallet,set_wallet] = useState({balance:0,currency:'PKR',owner:'User'})
  const [deposit_amount,set_deposit_amount] = useState('')
  const [withdraw_amount,set_withdraw_amount] = useState('')
  const [card_color,set_card_color] = useState('')
  const {show_toast} = use_toast()
  const displayed = use_count_up(wallet.balance)

  useEffect(()=>{
    fetch('http://localhost:5000/api/wallet')
      .then(r=>r.json())
      .then(data=>set_wallet(data))
  },[])

  function pulse(type){
    set_card_color(type==='credit'?'green_card':'red_card')
    setTimeout(()=>set_card_color(''),1000)
  }

  function handle_deposit(){
    const amount = parseFloat(deposit_amount)
    fetch('http://localhost:5000/api/wallet/deposit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({amount})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.error){show_toast(data.error,'error');return}
      set_wallet(data)
      pulse('credit')
      show_toast('Deposit successful!','success')
      set_deposit_amount('')
    })
  }

  function handle_withdraw(){
    const amount = parseFloat(withdraw_amount)
    fetch('http://localhost:5000/api/wallet/withdraw',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({amount})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.error){show_toast(data.error,'error');return}
      set_wallet(data)
      pulse('debit')
      show_toast('Withdrawal successful!','success')
      set_withdraw_amount('')
    })
  }

  return(
    <div>
      <div className={`balance_card ${card_color}`}>
        <h2>My Wallet</h2>
        <p className='balance_amount'>{format_pkr(displayed)}</p>
        <p>{wallet.currency} · {wallet.owner}</p>
      </div>

      <div className='forms_row'>
        <div className='form_box'>
          <h3>Deposit</h3>
          <input
            type='number'
            placeholder='Enter amount'
            value={deposit_amount}
            onChange={e=>set_deposit_amount(e.target.value)}
          />
          <button onClick={handle_deposit}>Deposit</button>
        </div>

        <div className='form_box'>
          <h3>Withdraw</h3>
          <input
            type='number'
            placeholder='Enter amount'
            value={withdraw_amount}
            onChange={e=>set_withdraw_amount(e.target.value)}
          />
          <button onClick={handle_withdraw}>Withdraw</button>
        </div>
      </div>
    </div>
  )
}

export default Wallet