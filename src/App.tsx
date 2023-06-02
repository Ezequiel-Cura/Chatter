import { useState } from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"
import { Route,Routes } from 'react-router-dom'

//COMPONENTS
import Chat from "./Components/Chat"
import Login from './Components/Login'
import IsAuth from './Utils/IsAuth'
import Home from './Components/Home'



function App() {
  
 
  return (
    <div className="h-screen" style={{overflow: "hidden"}}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route element={<IsAuth/>}>
          <Route path='/Home' element={<Home/>}/>
        </Route>
        <Route path='*' element={<h1>Not found</h1>}/>        
      </Routes>
    </div>
  )
}

export default App
