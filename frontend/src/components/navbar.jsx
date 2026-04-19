import {NavLink} from 'react-router-dom'

function Navbar({dark_mode,toggle_dark}){
  return(
    <nav className='navbar'>
      <span className='logo'>FintechFlow</span>
      <div className='nav_links'>
        <NavLink to='/'>Wallet</NavLink>
        <NavLink to='/transactions'>Transactions</NavLink>
        <NavLink to='/apply'>Apply Loan</NavLink>
        <NavLink to='/loans'>Loan Status</NavLink>
        <NavLink to='/emi'>EMI Calc</NavLink>
      </div>
      <button onClick={toggle_dark}>{dark_mode?'☀️':'🌙'}</button>
    </nav>
  )
}

export default Navbar