import { React, useRef } from 'react'
import '../../App.css'

function MessageBox(arg) {

    const textBox = useRef(null)

    const eventHandler = (e) => {
        if(e.key === 'Enter' && textBox.current.value) {
            arg.sendMessage(textBox.current.value)
            setTimeout(() => textBox.current.value='',1)
        } 
    }
    
    const clickHandler = () => {
        if(textBox.current.value) {
            arg.sendMessage(textBox.current.value)
            setTimeout(() => textBox.current.value='',1)
        }
    }

    return(
        <>
        <div className='w-full h-20 pb- p-4 flex flex-row justify-around space-x-2'>
            <input type='text' placeholder='Type a message' spellCheck={false} ref={textBox} className='flex-1 bg-white rounded-full placeholder-[#897da1] h-full outline-none px-4' onKeyDown={eventHandler}></input>
            <div className='bg-[#ffaf00] rounded-full h-full flex' onClick={clickHandler}>
                <span className="material-symbols-outlined text-4xl p-1 pl-2 text-[#fff9de]">send</span>
            </div>
        </div>
        </>
    );
}

export default MessageBox;