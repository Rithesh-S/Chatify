import React ,{ useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingScreen from './loadingscreen'

function Authorise(args)  {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/chatify/login',{ state: { message: true } });
          return;
        }
    
        fetch(`https://chatify-backend-hll7.onrender.com/chatify/auth`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          if(!res.ok) {
             throw new Error(res.statusText)
          }
          return res.json()
        })
        .then(data => {
            if(location.state?.active)
                return navigate(`/chatify/loginconfirmation/${location.state.userId}`,{ state: { userName: location?.state?.userName}})
            navigate(`/chatify/chatapp/${location.state.userId}`, { state: { message: true, userName: location?.state?.userName } });
          })
          .catch(error => {
            console.error('Access Denied', error);
            navigate('/chatify/login',{ state: { message: true } });
        });
      }, [navigate]);

  return (
    <LoadingScreen/>
  )
}

export default Authorise
