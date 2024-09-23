import { React } from 'react'
import { useParams , useNavigate, useLocation } from 'react-router-dom'
import '../App.css'

function LoginConfirmation() {

    const { userId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const redirect = (e) => {
        if(e)
            navigate(`/chatify/chatapp/${userId}`, { state: { message: true, userName: location?.state?.userName} })
        else
            navigate('/chatify/login')
    }

    return(
        <>
        <section className='h-screen bg-[#f0f0f0] flex justify-center items-center'>
            <div className='h-fit w-fit bg-[#625284] text-[#f0f0f0] p-8 shadow-md rounded-md space-y-6'>
                <p className=''>This account has been already logged in.</p>
                <p className=''>Do you want to login again?</p>
                <div className='flex justify-evenly space-x-4'>
                    <p className='p-2 w-full rounded-full text-center cursor-pointer bg-[#ffaf00]' onClick={() => redirect(true)}>Yes</p>
                    <p className='p-2 w-full rounded-full text-center cursor-pointer bg-[#ffaf00]' onClick={() => redirect(false)}>No</p>
                </div>
            </div>
        </section>
        </>
    )

}

export default LoginConfirmation;