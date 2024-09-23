import { React, useEffect, useState } from 'react'
import '../../App.css'

function Header(arg) {

    const [isTouchedBack, setIsTouchedBack] = useState(false)

    function formatTo12Hour(dateString) {

        const [datePart, timePart] = dateString.split(' ')
        const [year, month, day] = datePart.split('-').map(num => parseInt(num, 10))
        const [hour, minute, second] = timePart.split(':').map(num => parseInt(num, 10))
    
        const date = new Date(year, month-1, day, hour, minute, second)
        let hours = date.getHours()
        const minutes = date.getMinutes()
        const days = date.getDate()
        const months = date.getMonth()
        const years = date.getFullYear()
        const period = hours >= 12 ? 'PM' : 'AM'

        const nowDate = new Date()
        const nowDay = nowDate.getDate()
        const nowMonth = nowDate.getMonth()
        const nowYear = nowDate.getFullYear()
    
        hours = hours % 12
        hours = hours ? hours : 12
    
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        if(nowDay > days || nowMonth > months || nowYear > years)
            return `${days}/${months+1}/${years}`
        return `${hours}:${formattedMinutes} ${period}`
    }

    const [selectedChatName,setSelectedChatName] = useState()
    const [selectedChatStatus,setSelectedChatStatus] = useState()
    const [selectedChatLastSeen,setSelectedChatLastSeen] = useState()

    useEffect(() => {
        const selectedName = arg.users?.find(e => e.userid === arg.selectedChat)
        const selectedActivity = arg.activity?.find(e => e.userid === arg.selectedChat)
        setSelectedChatName(selectedName.name)
        setSelectedChatStatus(selectedActivity.isactive)
        setSelectedChatLastSeen(formatTo12Hour(selectedActivity.lastseen))
    },[arg.selectedChat,arg.activity,arg.users])

    return(
        <>
        <div className='h-16 border-b border-[#bdb7c9] text-xl pr-4 pl-2 text-[#f2f2f2] flex justify-between items-baseline'>
            <div className='flex h-full items-center space-x-2'>
                <div className={`pr-px rounded-md ${isTouchedBack && ('bg-[#69696956]')}`} onTouchStart={() => setIsTouchedBack(true)} onTouchEnd={() => setIsTouchedBack(false)} onClick={() => arg.setSelectedChat(null)}>
                    <span className="material-symbols-outlined text-xl p-1">arrow_back_ios_new</span>
                </div>
                <div className='size-10 rounded-full flex justify-center items-center bg-zinc-400'>
                    <span className="material-symbols-outlined text-2xl text-[#f1f1f1] ">person</span>
                </div>
                <p>{selectedChatName}</p>
            </div>
            <p className={`text-sm ${selectedChatStatus && 'text-green-500'}`}>{selectedChatStatus ? 'Online' : selectedChatLastSeen}</p>
        </div>
        </>
    )
}

export default Header;