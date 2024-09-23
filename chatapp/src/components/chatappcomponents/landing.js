import { React } from 'react'
import '../../App.css'

function Landing() {
    return(
    <>
    <div className='flex justify-center items-center flex-1'>
        <div className='w-64 shadow-xl border-[0.5px] border-[#b5a8ce] p-4 rounded-xl'>
        <p className='text-center text-4xl text-[#ffaf00] pb-2'>CHATIFY</p>
            <p className='text-center text-md text-[#b5a8ce] font-thin text-pretty'>
            Chatify revolutionizes real-time communication,
            offering an intuitive interface and essential features 
            for effortless messaging across devices.
            It fosters seamless connectivity,
            enhancing digital interactions for users.
            </p>
        </div>
    </div>
    </>
    )
}

export default Landing;