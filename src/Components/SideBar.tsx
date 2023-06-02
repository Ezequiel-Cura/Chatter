import React, { useState } from 'react'
import examplePhoto from "../../public/exampleProfilePhoto.jpg"
import { signOut } from 'firebase/auth'
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Chats from './Chats';
import { useChatStore } from '../store/chatStore';


interface Iuser{
  displayName? :string
  photoURL? :string
  email?:string
  uid?:string
}

export type Root = Root2[]

export interface Root2 {
  photoURL: string
  uid: string
  email: string
  displayName: string
  createdAt: CreatedAt
}

export interface CreatedAt {
  seconds: number
  nanoseconds: number
}

export default function SideBar() {
  const [input,setInput] = useState<string>("")
  const [user,setUser]:any = useState<any>()
  const [users1,setUsers1] = useState<Root>([])

  const {setUsers,users} = useChatStore(state=>state)

  const handleLogout = ()=>{
    signOut(auth)
  }

  const handleSearch = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    
    try {
      // const querySnapshot1 = await getDocs(collection(db, "Users"));
      // querySnapshot1.forEach((doc) => {        
      //   // @ts-ignore
      //   setUsers1((prev:any):any=>[...prev,doc.data()])
      // });
      //=============================
      //============================
      const q = query(collection(db,"Users"),where("displayName","==",input))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc)=>{
        console.log(doc.data())
        setUser(doc.data())
      })      
    } catch (error) {
      console.log(error)
    }
    setInput("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setInput(e.target.value)
    if(input === ""){
      setUsers1([])
    }
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
   
  user && console.log(user)
  return (
    <div className='w-[350px] h-[90%] my-[5%]  bg-[#3e3c61] flex flex-col rounded-s-xl rounded-tl-xl ' >
      <div className='h-[60px] flex flex-row justify-between bg-[#2f2d52] text-white rounded-tl-xl'>
        <img src={auth.currentUser.photoURL} alt="Profile photo" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>
        <span className='py-4'>{auth.currentUser.displayName}</span>
        <button onClick={handleLogout} className='p-2'>Logout</button>
      </div>
      <form className='my-2' onSubmit={handleSearch}>
        <input type="text" className=' w-full bg-[#3e3c61] px-2' placeholder='Find a user' onChange={(e)=>handleChange(e)} value={input}/>
      </form>
      { user ?
        <div className='my-1 '>
          {
            <div onClick={handleClick} style={{cursor:"pointer"}} className='flex flex-row'>
              <img src={user.photoURL} alt="" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>              
              <span className='px-2 text-white' style={{fontSize:"20px"}}>{user.displayName} </span>                      
            </div>
          }
        </div>
        :null
      }
      {/* {
        users1 && users1.filter(u=> u.displayName.includes(input)).map((u)=>(
          <div className='my-1 ' key={u.uid}>
          {
            <div onClick={handleClick} style={{cursor:"pointer"}} className='flex flex-row'>
              <img src={u.photoURL} alt="" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>              
              <span className='px-2 text-white' style={{fontSize:"20px"}}>{u.displayName} </span>
                      
            </div>
          }
        </div>
        ))
      } */}
      <hr/>
      <Chats/>
      
    </div>
  )
}

