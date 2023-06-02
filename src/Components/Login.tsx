import React, { useEffect, useRef } from 'react'
import { GoogleAuthProvider,signInWithPopup ,signOut} from "firebase/auth";
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc} from 'firebase/firestore';

import { auth, db } from '../firebase';
import {useAuthState} from "react-firebase-hooks/auth"
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate()
  const provider = new GoogleAuthProvider();
  const [user, loading, error] = useAuthState(auth);

  
  

  useEffect(()=>{
    if(loading) return
    if(user){
      handleAlreadyLogin()
    }else{      
      
    }
    
  },[user])


  function handleAlreadyLogin (){
    return navigate("/Home") 
  }

  const handleLogIn = async()=>{
    try {
      const res = await signInWithPopup(auth,provider)
      
      if(res.user){
        const docu = await getDoc(doc(db,"Users",res.user.uid))
        
        if(docu.exists()){          
          await updateDoc(doc(db,"Users",res.user.uid),{
            lastLogin: serverTimestamp()
          })
          return navigate("/Home") 
        }else{
          await setDoc(doc(db,"Users",res.user.uid),{
            uid: res.user.uid,
            displayName:res.user.displayName,
            email:res.user.email,
            photoURL:res.user.photoURL,
            createdAt: serverTimestamp()
          })

          await setDoc(doc(db,"userChats",`${res.user.uid}`),{})
          return navigate("/Home") 
        }
      }
      
    } catch (error) {
      console.log(error)
    }
  }  

  return (
    <div>
        <div>
          
          <div className='flex flex-col'>
            <button onClick={handleLogIn}>Login with Google</button>           
            
          </div>
        </div>
        
    </div>
  )
}
