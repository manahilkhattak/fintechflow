import {createContext,useContext,useState} from 'react'
const Toast_Context = createContext()

export function Toast_Provider({children}){
  const [toast,set_toast] = useState(null)

  function show_toast(message,type){
    set_toast({message,type})
    setTimeout(()=>set_toast(null),4000)
  }

  return(
    <Toast_Context.Provider value={{show_toast}}>
      {children}
      {toast&&(
        <div className={`toast toast_${toast.type}`}>
          {toast.message}
        </div>
      )}
    </Toast_Context.Provider>
  )
}

export function use_toast(){
  return useContext(Toast_Context)
}