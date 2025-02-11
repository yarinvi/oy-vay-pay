import { AuthForm,Dashboard,Navbar,useAuth,Expenses,Income } from './components'
import {ToastContainer} from 'react-toastify'
import {Routes,Route} from 'react-router'




function App() {
  const {isLoggedIn,user,isPending} = useAuth();

  if(isPending){
    return <div>Loading...</div>
  }
  return (
    <>
    {isLoggedIn ? <Navbar/> : null}
    <Routes>
      <Route path="/Auth" element={<AuthForm/>}/>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/income" element={<Income />} />
    </Routes>
    <ToastContainer 
    position="top-right"
    theme='colored'
    autoClose={5000}
    />
    </>
  )
}

export default App
