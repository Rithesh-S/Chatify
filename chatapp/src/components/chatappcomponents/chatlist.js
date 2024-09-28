import { React, useState, useEffect } from 'react'
import '../../App.css'

function ChatList(arg) {

    const [filteredNames,getFilteredNames] = useState([])
       
    useEffect(() => {
        const ChatUserList = () =>  {
            fetch(`${arg.baseUri}/chatify/chatapp/chatuserlist`,{
                method : "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: arg.userId })
            })
            .then(res => res.json())
            .then(data => {
                arg.getUsers(data)
                getFilteredNames(data)
            })
            .catch((err) => console.error(err))
        }
        ChatUserList()
    },[arg.addUserBox])

    useEffect(() => { 
        const filteredNames = arg.users?.filter((name => 
            name.name.toLowerCase().includes(arg.searchName.toLowerCase())
        ))
        getFilteredNames(filteredNames)
    },[arg.searchName])

    function checkStatus(id) {
        const user = arg.users?.find(item => item.userid === id)
        arg.getChatId(user.chatid)
    }

    return(
        <>
        <div className='flex flex-col cursor-pointer flex-1'>
            {filteredNames?.map((val,i) => { return(
            <div key={i} className={`flex border-b border-[#4f3d75] shadow-sm justify-start justify-items-center space-x-4 p-4 h-20 ${ arg.selectedChat === val.userid ?'bg-[#706192] ' : ''}`} onClick={() => {arg.setSelectedChat(val.userid); checkStatus(val.userid)}}>
                <div className='size-12 rounded-full flex justify-center items-center bg-zinc-400'>
                    <span className="material-symbols-outlined text-3xl text-[#f1f1f1] ">person</span>
                </div>
                <div className='w-fit h-fit text-[#f2f2f2]'>{val.name}<p className='m-0 font-thin text-[#ffaf00]'>Tap to chat!</p></div>
            </div>)})}
        </div>
        </>
    )

}

export default ChatList;
