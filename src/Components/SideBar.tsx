import React, { useState } from 'react'
import examplePhoto from "../../public/exampleProfilePhoto.jpg"
import { signOut } from 'firebase/auth'
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Chats from './Chats';


interface Iuser{
  displayName? :string
  photoURL? :string
  email?:string
  uid?:string
}

export default function SideBar() {
  const [input,setInput] = useState<string>("")
  const [user,setUser] = useState<Iuser>()


  const handleLogout = ()=>{
    signOut(auth)
  }

  const handleSearch = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    
    try {
      const q = query(collection(db,"Users"),where("displayName","==",input))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc)=>{
        setUser(doc.data())
      })

    } catch (error) {
      
    }
    setInput("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setInput(e.target.value)

  }

  const handleClick =async ()=>{
    const {currentUser} = auth    
    let combineUid;
    try {
    if(currentUser && user?.uid){
      combineUid = currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid 
        : user?.uid + currentUser?.uid 
    }

    const res = await getDoc(doc(db,"chats",`${combineUid}`))

    if(!res.exists()){
      await setDoc(doc(db,"chats",`${combineUid}`),{messages:[]})

      await updateDoc(doc(db,"userChats",`${currentUser?.uid}`),{
        [combineUid+".userInfo"]:{
          uid: user?.uid,
          displayName:user?.displayName,
          photoURL:user?.photoURL
        },
        [combineUid+".date"]:serverTimestamp()
      })

      await updateDoc(doc(db,"userChats",`${user?.uid}`),{
        [combineUid+".userInfo"]:{
          uid: currentUser?.uid,
          displayName: currentUser?.displayName,
          photoURL: currentUser?.photoURL
        },
        [combineUid+".date"]:serverTimestamp()
      })

    }



  } catch (error) {
    console.log(error)
  }
  setUser({
    displayName:"",
    email:"",
    photoURL:"",
    uid:""
  })
  setInput("")
  }
   

  return (
    <div className='w-[350px] h-[90%] my-[40px]  bg-[#3e3c61] flex flex-col rounded-s-xl' >
      <div className='h-[60px] flex flex-row justify-between '>
        <img src={auth.currentUser.photoURL} alt="Profile photo" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>
        <span className='py-4'>{auth.currentUser.displayName}</span>
        <button onClick={handleLogout} className='p-2'>Logout</button>
      </div>
      <form className='my-2' onSubmit={handleSearch}>
        <input type="text" className='bg-slate-500 w-full' placeholder='Find user' onChange={(e)=>handleChange(e)} value={input}/>
      </form>
      { user &&
        <div className='my-1 '>
          {
            <div onClick={handleClick} style={{cursor:"pointer"}} className='flex flex-row'>
              <img src={user.photoURL} alt="" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>              
              <span className='px-2' style={{fontSize:"20px"}}>{user.displayName} </span>
                      
            </div>
          }
        </div>
      }
      <hr/>
      <Chats/>
      
    </div>
  )
}
