import { React, Suspense, lazy} from 'react'
import { Route, BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Login from './components/login'
import LoadingScreen from './components/loadingscreen'
import './App.css'
import Authorise from './components/authorise'

const ChatApp = lazy(() => import('./components/chatapp'))
const SignUp = lazy(() => import('./components/signup'))
const NoPage = lazy(() => import('./components/nopage'))
const LoginConfirmation = lazy(() => import('./components/loginredirect'))

const baseUri = "https://chatify-backend-hll7.onrender.com";

function RedirectPage() {
  return <Navigate to="/chatify/login" />
}

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<RedirectPage/>}/>
        <Route path="/chatify/login" element={<Login baseUri={baseUri}/>} />
        <Route path="/chatify/signup" element={<Suspense fallback={<LoadingScreen/>}><SignUp baseUri={baseUri}/></Suspense>} />
        <Route path="/chatify/auth" element={<Authorise/>}/>
        <Route path="/chatify/chatapp/:userId" element={<Suspense fallback={<LoadingScreen/>}><ChatApp baseUri={baseUri}/></Suspense>} />
        <Route path="/chatify/loginconfirmation/:userId" element={<Suspense fallback={<LoadingScreen/>}><LoginConfirmation/></Suspense>} />
        <Route path="*" element = {<Suspense fallback={<LoadingScreen/>}><NoPage/></Suspense>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
