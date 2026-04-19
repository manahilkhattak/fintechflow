import {useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from './components/navbar'
import {Toast_Provider} from './context/toast_context'
import Wallet from './pages/wallet'
import Transactions from './pages/transaction'
import Loan_Form from './pages/loan_form'
import Loan_Status from './pages/loan_status'
import Emi_Calculator from './pages/emi_calculator'
function App(){
  const [dark_mode,set_dark_mode] = useState(()=>{
    return localStorage.getItem('theme')==='dark'
  })

  useEffect(()=>{
    localStorage.setItem('theme',dark_mode?'dark':'light')
    document.body.className = dark_mode?'dark':''
  },[dark_mode])

  function toggle_dark(){
    set_dark_mode(prev=>!prev)
  }

  return(
    <BrowserRouter>
      <Toast_Provider>
        <Navbar dark_mode={dark_mode} toggle_dark={toggle_dark}/>
        <div className='page'>
          <Routes>
            <Route path='/' element={<Wallet/>}/>
            <Route path='/transactions' element={<Transactions/>}/>   
            <Route path='/apply' element={<Loan_Form/>}/>
<Route path='/loans' element={<Loan_Status/>}/>
<Route path='/emi' element={<Emi_Calculator/>}/>          </Routes>
        </div>
      </Toast_Provider>
    </BrowserRouter>
  )
}

export default App