import React from 'react'
import SideBar from './SideBar'
import Chat from './Chat'


export default function Home() {
  return (
    <div className='flex flex-row justify-center mx-[3rem] h-[100vh]'>
        <SideBar/>
        <Chat/>
    </div>
  )
}


