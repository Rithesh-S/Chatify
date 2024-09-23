import '../App.css'
import { React ,useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Login(args)
{
    const [userName,updateUserName] = useState('')
    const [password,updatePassword] = useState('')
    const [isUser,getIsUser] = useState(false)
    const [isPass,getIsPass] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [visible,setVisible] = useState(false)
    const [height, setHeight] = useState(window.innerHeight)
    const [isTouched, setIsTouched] = useState(false)
    const [successMessage,setSuccessMessage] = useState(false)
    const [auth,setAuth] = useState(false)

    let navigate = useNavigate()
    const location = useLocation()
  
    const handleKeyDown = (event, nextInputId) => {
        if (event.key === 'Enter') {
          const nextInput = document.getElementById(nextInputId);
          if (nextInput) {
            nextInput.focus()
          }
        }
    }

    const handleTouchStart = () => {
      setIsTouched(true); 
    };
  
    const handleTouchEnd = () => {
      setIsTouched(false); 
    };

    const signIn = () => {
        if(!userName) {
            getIsUser(true)
            return
        }
        if(!password) {
            getIsUser(false)
            getIsPass(true)
            return
        }
        setIsLoading(true)

        fetch(`${args.baseUri}/chatify/login`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username: userName , password: password})
        })
        .then(res => {
            if(res.status === 404) {
                getIsUser(true)
                getIsPass(false)
                setIsLoading(false)
                throw new Error("User Not Found")
            }
            else if(res.status === 401) {
                getIsUser(false)
                getIsPass(true)
                setIsLoading(false)
                throw new Error("Wrong Credentials")
            }
            else if(!res.ok) {
                throw new Error("Unexpected Error: "+res.statusText)
            }
            return res.json()
        })
        .then(data => {
            setSuccessMessage(true)
            localStorage.setItem('token',data.token)
            setTimeout(() => {
              setSuccessMessage(false)
              navigate('/chatify/auth', { state: { userId: data.userId, userName: userName, active: data.isactive } })
            },1000)
        })
        .catch(err => console.error(err))   
    }

    useEffect(() => {
        if(location?.state?.message) {
            setAuth(true)
        }
        setTimeout(() => setAuth(false),2000)
    },[])

    useEffect(() => {
      const handleResize = () => setHeight(window.visualViewport?.height || window.innerHeight);
      window.visualViewport?.addEventListener('resize', handleResize);
      window.addEventListener('resize', handleResize);
      return () => {
          window.visualViewport?.removeEventListener('resize', handleResize);
          window.removeEventListener('resize', handleResize);
      };
    }, []);

    return(
        <>
        <section className='h-dvh flex bg-[#fdfaf2] justify-center items-center' style={{ height: `${height}px` }}>
            <div className={`z-50 fixed px-6 right-5 top-7 h-20 rounded-xl shadow-lg flex ${ ( !successMessage && !auth ) && 'hidden' } ${ auth ? 'bg-red-100' : 'bg-green-100' }`}>
                <p className={`m-auto text-xl ${ auth ? 'text-red-700' : 'text-emerald-700'}`}>{auth ? "Unauthorized" :"Login Successfully!"}</p>
            </div>
            <div className='h-full w-full sm:h-4/6 sm:w-4/6 border-none sm:rounded-xl sm:grid sm:grid-cols-2 sm:shadow-lg'>
                <div className='bg-slate-100 hidden rounded-l-xl sm:flex justify-evenly flex-col text-center bg-gradient-to-br from-[#ffaf00] to-[#0024bf]'>
                    <h1 className='text-3xl font-medium text-white md:text-4xl lg:text-5xl'>New Here?</h1> 
                    <div>
                        <p className='text-sm md:text-lg lg:text-xl font-thin text-white pb-4'>Sign up and start chatting!</p>
                        <div className=' border-none w-4/6 mx-auto p-2 px-4 rounded-full bg-[#ffaf00] text-[#f1f1f1] cursor-pointer' onClick={() => { navigate('/chatify/signup')}}>Sign Up</div>
                    </div>
                </div>
                <div className='h-5/6 sm:h-full py-4 rounded-r-xl bg-white space-y-8 sm:space-y-0 flex flex-col justify-center sm:justify-evenly'>
                    <h1 className='hidden sm:block text-3xl md:text-4xl lg:text-5xl font-medium text-center text-[#0024bf]'>Login</h1>
                    <h1 className='sm:hidden block text-5xl font-medium text-center text-[#0024bf]'>Chatify</h1>
                    <div className='flex flex-col pt-8 sm:pt-2'>
                        <input type='text' placeholder='Username' id="input1" onKeyDown={(event) => handleKeyDown(event, "input2")} className={`border text-lg rounded w-3/4 h-12 p-4 mx-auto ${ isUser ?'focus:outline-red-500 border-red-500 ':'focus:outline-[#0024bf]'}`} onChange={(e) => updateUserName(e.target.value)}></input>
                        <p className={`ml-14 text-red-500 ${!isUser && 'invisible'}`}>Username doesn't exists</p> 
                    </div>
                    <div className='flex flex-col relative'>
                        <input type={ visible ? 'text' : 'password'} placeholder='Password' id="input2" onKeyDown={(e) => { if(e.key === 'Enter'){signIn()} }} className={`border rounded text-lg w-3/4 h-12 p-4 mx-auto ${isPass ?'focus:outline-red-500 border-red-500':'focus:outline-[#0024bf]'}`} onChange={(e) => updatePassword(e.target.value)}></input>
                        <span className='z-50 material-symbols-outlined absolute bottom-8  right-16 text-[1.85rem] border-l pl-2 cursor-pointer' onClick={() => visible ? setVisible(false) : setVisible(true)}>{visible ? "visibility" : "visibility_off"}</span>
                        <p className={`ml-14 text-red-500 ${!isPass && 'invisible'}`}>Password incorrect</p> 
                    </div>
                    <div className={`text-center text-lg cursor-pointer p-2 border-none rounded-full w-3/4 sm:w-4/6 mx-auto text-white ${isTouched ? 'bg-[#3f5ad2]' : 'bg-[#0024bf]'}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} id={ isLoading ? undefined : "button"} onClick={!isLoading ? signIn : undefined}>{isLoading ? "Loading..." : "Sign In"}</div>
                </div>
                <div className='h-1/6 sm:hidden bg-white flex items-end'>
                    <p className='bg-gray-50 w-full p-4 border-t-2 flex justify-center items-end pb-4 sm:hidden'>New Here? Sign up and start chatting!<span className='pl-2 text-[#ffaf00]' onClick={() => { navigate('/chatify/signup')}}>Sign Up</span></p>
                </div>
            </div>
        </section>
        </>
    )
}

export default Login;