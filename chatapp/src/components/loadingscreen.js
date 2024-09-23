import { React } from 'react'
import '../App.css'

function LoadingScreen() {

    return (
        <>
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#0024bf]"></div>
        </div>
        </>
    )
}

export default LoadingScreen;