import { React, useEffect, useState } from 'react'
import '../../App.css'

function SearchBar(arg) {

    const [searchName,getSearchName] = useState('')

    useEffect(() => {
        arg.getSearchName(searchName)
    },[searchName])

    return(
        <>
        <div className='h-11 flex-1 relative'>
            <span className="material-symbols-outlined z-5 absolute top-1 left-4 text-3xl text-[#897da1]">person_search</span>
            <input type='text' placeholder='SEARCH'spellCheck={false} className='w-full h-full pl-14 text-[#bdb7c9] placeholder-[#897da1] bg-[#625284] rounded-full outline-none shadow-md' onChange={(e) => getSearchName(e.target.value)}></input>
        </div>
        </>
    )
}

export default SearchBar