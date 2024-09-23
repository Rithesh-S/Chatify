import { React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function SignUp(args) {

    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [isValidUser,setIsValidUser] = useState(false)
    const [isValidPass,setIsValidPass] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [successMessage,setSuccessMessage] = useState(false)
    const [failMessage,setFailMessage] = useState(false)
    const [visible,setVisible] = useState(false)
    const [height, setHeight] = useState(window.innerHeight);
    const [isTouched, setIsTouched] = useState(false);
    const [userExist,setUserExist] = useState(false)

    const navigate = useNavigate()

    const handleKeyDown = (event,nextInputId) => {
        if (event.key === 'Enter') {
          const nextInput = document.getElementById(nextInputId);
          if (nextInput) {
            nextInput.focus()
          }
        }
      };

      const handleTouchStart = () => {
        setIsTouched(true); 
      };
    
      const handleTouchEnd = () => {
        setIsTouched(false); 
      };

    const validate = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9_@]+$/;
        if (!regex.test(value)) {
            setIsValidUser(true)
        } else {
            setIsValidUser(false)
            setUserName(value)
        }
    };

    const pValidate = (e) => {
        const value = e.target.value
        if(value.length < 8)
            setIsValidPass(true)
        else
        {
            setIsValidPass(false)
            setPassword(value)
        }
    }

    const signup = () => {

        if( isValidPass || isValidUser || userName === '' || password === '')
        {
            setIsValidPass(true)
            setIsValidUser(true)
        }
        else
        {
            setIsLoading(true)
            fetch(`${args.baseUri}/chatify/signup` , {
                method : "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username: userName , password: password})
            })
            .then(res => {
                setIsLoading(false);
                if(res.status === 409) {
                    setFailMessage(true)
                    setUserExist(true)
                    setTimeout(() => { setFailMessage(false) },5000)
                    return
                }
                if(res.status === 404) {
                    setUserExist(false)
                    setFailMessage(true)
                    setTimeout(() => { setFailMessage(false) },5000)
                    return
                }
                if(res.status === 201) {
                    setSuccessMessage(true)
                    setUserExist(false)
                    setTimeout(() => { 
                        setSuccessMessage(false)
                        navigate(`/chatify/login`) 
                    },2000)
                }

                throw new Error("Unexpected Error: "+res.statusText)
            })
            .catch(err => console.log(err))
        }
    }

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
            <div className={`z-50 fixed px-6 right-5 top-7 h-20 rounded-xl bg-green-100 shadow-lg flex ${ !successMessage && 'hidden'}`}>
                <p className='m-auto text-xl text-emerald-700'>{"Signed Up Successfully!"}</p>
            </div>
            <div className={`z-50 fixed right-5 top-7 h-20 px-6 sm:px-10 rounded-xl bg-red-100 shadow-lg flex ${ !failMessage && 'hidden'}`}>
                <p className='m-auto text-xl text-red-700'>{ userExist ? "User Already Exists!" : "SignUp Failed!"}</p>
            </div>
            <div className='h-full w-full sm:h-4/6 sm:w-4/6 m-auto border-none sm:rounded-xl sm:grid sm:grid-cols-2 sm:shadow-lg'>
                <div className='bg-slate-100 hidden rounded-l-xl sm:flex justify-evenly flex-col text-center bg-gradient-to-br from-[#ffaf00] to-[#0024bf]'>
                    <h1 className='text-5xl font-medium text-white'>Chatify</h1> 
                    <p className='hidden sm:block text-m font-thin text-white text-left px-6 indent-2'>
                        Introducing CHATIFY, where every message sparks a connection. 
                        Seamlessly blending simplicity with innovation, CHATIFY revolutionizes the way you chat. 
                        Join the conversation today and discover a world of endless possibilities, one chat at a time.
                    </p>
                    <p className='text-white font-thin'>Already had an account?<i className='cursor-pointer underline hover:text-orange-300' onClick={()=> navigate('/chatify/login')}> Sign In</i></p>
                </div>
                <div className='h-5/6 sm:h-full py-4 rounded-r-xl bg-white space-y-8 sm:space-y-0 flex flex-col justify-center sm:justify-evenly'>
                    <h1 className='hidden sm:block text-3xl md:text-4xl lg:text-5xl font-medium text-center text-[#0024bf]'>Sign Up</h1>
                    <h1 className='sm:hidden block text-5xl font-medium text-center text-[#0024bf]'>Chatify</h1>
                    <div className='flex flex-col pt-8 sm:pt-2'>
                        <input type='text' placeholder='Username' id="input1" className={`border text-lg rounded w-3/4 h-12 p-4 mx-auto ${ isValidUser ?'focus:outline-red-500 border-red-500 ':'focus:outline-[#0024bf]'}`} onKeyDown={(e) => {handleKeyDown(e,"input2")}} onChange={validate}></input>
                        <p className={`ml-14 text-red-500 text-sm pt-1 ${!isValidUser && 'invisible'}`}>Username should only contain a-z,A-Z,0-9,@,_</p> 
                    </div>
                    <div className='flex flex-col relative'>
                        <input type={ visible ? 'text' : 'password'} placeholder='Password' id="input2" onKeyDown={(e) => { if(e.key === 'Enter'){signup()} }} className={`border rounded text-lg w-3/4 h-12 p-4 mx-auto ${isValidPass ?'focus:outline-red-500 border-red-500':'focus:outline-[#0024bf]'}`} onChange={pValidate}></input>
                        <span className='z-50 material-symbols-outlined absolute bottom-8 right-16 text-[1.85rem] border-l pl-2 cursor-pointer' onClick={() => visible ? setVisible(false) : setVisible(true)}>{visible ? "visibility" : "visibility_off"}</span>
                        <p className={`ml-14 text-red-500 text-sm pt-1 ${!isValidPass && 'invisible'}`}>Password should be atleast 8 character length</p> 
                    </div>
                    <div className={`text-center text-lg cursor-pointer p-2 border-none rounded-full w-3/4 sm:w-4/6 mx-auto text-[#f0f0f0] ${isTouched ? 'bg-[#ffcc5f] sm:bg-[#3f5ad2]' : 'bg-[#ffaf00] sm:bg-[#0024bf]'}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} id={!isLoading && "button" } onClick={!isLoading && signup}>{isLoading ? "Loading..." : "Sign Up"}</div>
                </div>
                <div className='h-1/6 sm:hidden bg-white flex items-end'>
                    <p className='bg-gray-50 w-full p-4 border-t-2 flex justify-center items-end pb-4 sm:hidden'>Already Been Here? <span className='pl-2 text-[#0024bf]' onClick={() => { navigate('/chatify/login')}}>Log In</span></p>
                </div>
            </div>
        </section>
        </>
    )
}

export default SignUp