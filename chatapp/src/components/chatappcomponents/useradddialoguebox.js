import { React,useState,useEffect} from 'react'
import '../../App.css'

function UserAddDialogueBox(arg) {

    const [isLoading,setIsLoading] = useState(false)
    const [addUsernameValid,setAddUsernameValid] = useState(false)
    const [addUsername,getAddUsername] = useState('')
    const [isUsernameEmpty,setIsUsernameEmpty] = useState(false)
    const [addUserId,getAddUserId] = useState(null)
    const [isTouchedClose,setIsTouchedClose] = useState(false)
    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {
        if(addUsername === '') {
            setIsUsernameEmpty(true)
            setIsLoading(false)
            setAddUsernameValid(false)
            return
        }
        if(arg.users.some((e) => e.name === addUsername)) {     
            setIsLoading(false)
            setAddUsernameValid(false)
            return
        }
        setIsUsernameEmpty(false)
        setIsLoading(true)
        const fetchUser = setTimeout(() => {
            fetch(`${arg.baseUri}/chatify/chatapp/user`,{
                method : "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username: addUsername })
            })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false)
                if(data.response) {
                    if(data.userId === arg.userId) {
                        setAddUsernameValid(false)
                    } 
                    else {
                        setAddUsernameValid(true)
                        getAddUserId(data.userId)
                    }
                }
                else
                    setAddUsernameValid(false)
            })
        },1000)
      
    return () => {
      clearInterval(fetchUser)
    }      
      
    },[addUsername,arg.users,arg.userId])

    const addUser = () => {
        if(isUsernameEmpty || !addUsernameValid)
            return
        
        setTimeout(() => arg.setAddUserBox(false),100)
        arg.getUsers([...arg.users,addUsername])
        
        fetch(`${arg.baseUri}/chatify/chatapp/addmember`, {
            method : "PUT",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({userId: arg.userId, username: addUsername, addUserId: addUserId})
        })
        .then(res => res.json())
        .then(data => {
            if(data.message)       
                console.log("Added Successfully!")
            getAddUsername('')
        })
        .catch((err) => console.log(err))
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
            <div className={`z-10 fixed h-dvh w-full justify-center items-center flex backdrop-blur-[2px] ${!arg.addUserBox && 'hidden'}`} style={{ height: `${height}px` }}>
                <div className='sm:w-[30] md:w-[30%] bg-[#9381b8] rounded-xl p-4'>
                    <div className='flex justify-between items-center mb-2'>
                        <p className='text-lg text-[#4f3d75] font-medium ml-4'>SEARCH THE USER</p>
                        <div className={`px-1 rounded-lg ${isTouchedClose && ('bg-[#9693935f]')}`}  onClick={() => arg.setAddUserBox(false)} onTouchStart={() => setIsTouchedClose(true)} onTouchEnd={() => setIsTouchedClose(false)}>
                            <span className="material-symbols-outlined text-[#4f3d75] text-3xl p-1">close</span>
                        </div>
                    </div>
                    <div className='sm:h-3/4 w-full p-4 flex flex-col justify-between'>
                        <div className='relative'>    
                            <input type='text' placeholder='Username' spellCheck={false} className='p-2 w-full rounded-full px-6 focus:outline-none' value={addUsername} onChange={(e) => { getAddUsername(e.target.value) }}></input>
                            { isLoading ? 
                                <div className='absolute right-3 bottom-2 animate-spin size-6 border-4 rounded-full border-t-[#0024bf]'></div> : 
                                !isUsernameEmpty && <span className={`material-symbols-outlined absolute right-1 -top-[1.3px] p-1 text-3xl ${addUsernameValid ? "text-emerald-500" : "text-red-500"}`}>{addUsernameValid ? "check_circle" : "cancel"}</span>
                            }
                        </div>
                        <div className='w-3/4 p-2 mt-10 text-center font-medium rounded-full bg-[#ffbd2e] text-[#ffffff] mx-auto cursor-pointer' onClick={addUser}>ADD</div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default UserAddDialogueBox;