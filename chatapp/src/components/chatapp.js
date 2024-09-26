import { React, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from './chatappcomponents/header'
import Landing from './chatappcomponents/landing'
import ChatList from './chatappcomponents/chatlist'
import ChatArea from './chatappcomponents/chatarea'
import SearchBar from './chatappcomponents/searchbar'
import MessageBox from './chatappcomponents/messagebox'
import UserAddDialogueBox from './chatappcomponents/useradddialoguebox'
import '../App.css'

function ChatApp(args) {

    const { userId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [username, getUsername] = useState('')
    const [addUserBox,setAddUserBox] = useState(false)
    const [selectedChat,setSelectedChat] = useState(null)
    const [searchName,getSearchName] = useState('')
    const [conversation,getConversation] = useState({})
    const [activity,setActivity] = useState({})
    const [chatId,getChatId] = useState('')
    const [users,getUsers] = useState([])
    const [height, setHeight] = useState(window.innerHeight)
    const [isTouchedLog,setIsTouchedLog] = useState(false)
    const [isTouchedAdd,setIsTouchedAdd] = useState(false)

    const sendMessageRef = useRef(null)
    const joinRoomRef = useRef(null)
    const chatIdRef = useRef(null)
    const receiveMessageRef = useRef({})

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token || !location.state?.message) {
          navigate('/chatify/login',{ state: { message: true } });
      }
      else {
        getUsername(location.state.userName)
      }
    },[])
 
    useEffect(() => {

      const socket = io(args.baseUri);

      socket.on('connect', () => {
        try {
          fetch(`${args.baseUri}/chatify/updatesocket`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: userId , socketId: socket.id})
          })
          .then(res => res.json()) 
          .then(data => {
            if(data) 
              console.log("Socket Established")
          })  
        }
        catch(err) {
          console.error(err)
        }
      })

      socket.emit('prevmessage')

      socket.on('receiveprevmessage',(message) => {
        receiveMessageRef.current = message
        getConversation(receiveMessageRef.current)
      })

      socket.on('receive', (message) => {
        receiveMessageRef.current = message
        getConversation(receiveMessageRef.current)
      })
      
      joinRoomRef.current = (room) => {
        socket.emit('joinroom',room)
      }
      
      sendMessageRef.current = (message) => {
          socket.emit('message',receiveMessageRef.current,message,userId,chatIdRef.current)
      }

      return () => { 
        socket.disconnect() 
      }

    }, [])

    useEffect(() => {
      chatIdRef.current = chatId
      chatIdJoin(chatIdRef.current)
    },[chatId])

    const chatIdJoin = (chat) => {
      if(joinRoomRef.current) {
        joinRoomRef.current(chat)
      }
    }

    const sendMessage = (message) => {
      if (sendMessageRef.current) {
        sendMessageRef.current(message)
      }
    }
 
    useEffect(() => {
        const updateVisit = async () => {
            try {
              const response = await fetch(`${args.baseUri}/chatify/statusupdate`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: userId , updateType: true}),
              });
            await response.json()
            } 
            catch (error) {
              console.error('Error:', error)
            }
        }

        const statusUpdater = () => {
          fetch(`${args.baseUri}/chatify/checkstatus`)
          .then(res => res.json())
          .then(data => {
              if(data) {
                  setActivity(data.response)
              }
          })
          .catch((err) => console.error(err))
        }
      
        updateVisit()

        statusUpdater()

        const setIntervalHandler = setInterval(() => statusUpdater(),30000)
        
        const handleBeforeUnload = () => {
            try {
              fetch(`${args.baseUri}/chatify/statusupdate`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId , updateType: false }),
              })
            } 
            catch (error) {
                console.error('Error updating database:', error)
            }
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload)
    
        return () => {
          handleBeforeUnload()
          clearInterval(setIntervalHandler)
          window.removeEventListener('beforeunload', handleBeforeUnload)
        }

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
          
    return (
       <>
            <UserAddDialogueBox userId={userId} addUserBox={addUserBox} setAddUserBox={setAddUserBox} users={users} getUsers={getUsers} baseUri={args.baseUri}/>
            <section className='h-dvh bg-[#4f3d75] flex' style={{ height: `${height}px` }}>
              <div className='hidden md:flex md:flex-col py-4'>
                <div className='px-2 pl-4 flex'>
                  <SearchBar getSearchName={getSearchName}/>
                  <div className={`px-3 ml-2 rounded-lg ${isTouchedAdd && ('bg-[#69696956]')}`} onTouchStart={() => setIsTouchedAdd(true)} onTouchEnd={() => setIsTouchedAdd(false)} onClick={() => setAddUserBox(true)}>
                    <span className="material-symbols-outlined text-[#f0f0f0] text-3xl py-1">person_add</span>
                  </div>
                </div>
                <div className='flex-1 mt-6 bg-[#625284] flex flex-col overflow-y-auto scrollbar-none'>
                  <ChatList userId={userId} addUserBox={addUserBox} users={users} getUsers={getUsers} selectedChat={selectedChat} setSelectedChat={setSelectedChat} getChatId={getChatId} searchName={searchName} baseUri={args.baseUri}/>
                </div> 
              </div>
                { selectedChat === null ?
                  <>
                    <div className='md:hidden flex flex-col flex-1'>
                      <div className='flex justify-between p-2'>
                        <p className='text-[#f0f0f0] text-2xl p-1 pl-2'>Chatify</p>
                        <div className={`rounded-lg pl-2 pr-1 ${isTouchedLog && ('bg-[#69696956]')}`} onTouchStart={() => setIsTouchedLog(true)} onTouchEnd={() => setIsTouchedLog(false)} onClick={() => navigate('/chatify/login')}>
                          <span className="material-symbols-outlined text-[#f0f0f0] text-3xl p-1">logout</span>
                        </div>
                      </div>
                      <div className='px-2 pl-4 flex'>
                        <SearchBar getSearchName={getSearchName}/>
                        <div className={`px-3 ml-2 rounded-lg ${isTouchedAdd && ('bg-[#69696956]')}`} onTouchStart={() => setIsTouchedAdd(true)} onTouchEnd={() => setIsTouchedAdd(false)} onClick={() => setAddUserBox(true)}>
                          <span className="material-symbols-outlined text-[#f0f0f0] text-3xl py-1">person_add</span>
                        </div>
                      </div>
                      <div className='flex-1 mt-6 bg-[#625284] flex flex-col overflow-y-scroll scrollbar-none'>
                        <ChatList userId={userId} addUserBox={addUserBox} users={users} getUsers={getUsers} selectedChat={selectedChat} setSelectedChat={setSelectedChat} getChatId={getChatId} searchName={searchName} baseUri={args.baseUri}/>
                      </div> 
                    </div> 
                    <div className='hidden md:flex flex-col flex-1'>
                      <div className='flex justify-between p-2'>
                        <p className='text-[#ffaf00] text-2xl p-1 pl-6'>{username}</p>
                        <div className={`rounded-lg pl-2 pr-1 ${isTouchedLog && ('bg-[#69696956]')}`} onTouchStart={() => setIsTouchedLog(true)} onTouchEnd={() => setIsTouchedLog(false)} onClick={() => navigate('/chatify/login')}>
                          <span className="material-symbols-outlined text-[#f0f0f0] text-3xl p-1">logout</span>
                        </div>
                      </div>
                      <Landing/>    
                    </div>
                  </>
                  : 
                  <div className='h-dvh flex flex-col' style={{ height: `${height}px` }}>
                    <Header users={users} selectedChat={selectedChat} setSelectedChat={setSelectedChat} activity={activity}/>
                    <ChatArea conversation={conversation} chatId={chatId} userId={userId}/>
                    <MessageBox sendMessage={sendMessage} setHeight={setHeight} />
                  </div>
                }
            </section>
        </>
    )
}

export default ChatApp;
