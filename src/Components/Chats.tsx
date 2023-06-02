
import React, { useEffect, useState } from 'react'
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc,onSnapshot} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useChatStore } from '../store/chatStore';

interface Iuser{
    date: DateConstructor
    userInfo :{
        displayName? :string
        photoURL? :string
        uid?:string
    }
    lastMessage:{
        text:string
    }
  }


export default function Chats() {
    const [chats,setChats] = useState<Array<Iuser>>()
    const {user,changeChat} = useChatStore(state=>state)
    


    useEffect(()=>{
        
        const getChats = ()=>{
            const unsub = onSnapshot(doc(db,"userChats",`${auth.currentUser?.uid}`),(doc)=>{
                setChats(doc.data() as Array<Iuser>)
            })
            
            return ()=>{
                unsub()
            }
        }
        auth.currentUser?.uid && getChats()
    },[auth.currentUser?.uid])

    const handleSelect = (userInfo:any)=>{
        
        changeChat(userInfo)
    }
    // chats && console.log(Object.entries(chats))
    return (
        <div className='h-fit'>
            {
                chats && Object.entries(chats).sort((a:any,b:any)=>b[1].date - a[1].date).map((c)=>(
                    <div key={c[0]} onClick={()=>handleSelect(c[1].userInfo)} className='flex flex-row my-1 '>
                        <img src={c[1].userInfo.photoURL} alt="" style={{width:"50px",height:"50px"}} className='rounded-full m-2'/>
                        <div className='flex flex-col px-2' >
                            <span  style={{fontSize:"20px"}}>{c[1].userInfo.displayName}</span>
                            { c[1].lastMessage && <p style={{fontSize:"10px"}}>{c[1]?.lastMessage?.text.trim().slice(0,25)}</p>}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
