import { React, useEffect } from 'react'
import '../../App.css'

function ChatArea(arg) {

    useEffect(()=> {
        var scroll = document.getElementById('scroll')
        scroll.scrollTop = scroll.scrollHeight
    },[arg.conversation])

    return(
        <>
        <div className='flex-1 p-4 mt-4 overflow-y-auto scrollbar-none' id='scroll'>
            <div className='grid w-full space-y-4'>
                {arg.conversation[arg.chatId]?.map((e,i) => {
                    return <p key={i} className={`p-2 px-4 rounded-t-lg break-words bg-[#ffb235] max-w-md text-wrap ${e.userid === arg.userId ? 'justify-self-end rounded-bl-lg':'justify-self-start rounded-br-lg'}`}>{e.message}</p>
                })}
            </div>
        </div>
        </>
    );
}

export default ChatArea;