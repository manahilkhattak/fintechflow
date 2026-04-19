function format_pkr(amount){
  return new Intl.NumberFormat('ur-PK',{style:'currency',currency:'PKR'}).format(amount)
}

export default format_pkr