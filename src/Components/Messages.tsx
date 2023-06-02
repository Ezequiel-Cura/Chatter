import React, { useEffect, useState,useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc,onSnapshot} from 'firebase/firestore';
import { Ring } from '@uiball/loaders'

import { db,auth } from '../firebase'

interface Imsg{
    date:DateConstructor
    id:string
    senderId:string
    text:string
}

export default function Messages() {
    const {chatId} = useChatStore(state=>state)
    const [messages,setMessages] = useState<Array<Imsg>>([])
    const {user,changeChat} = useChatStore(state=>state)
    const ref = useRef<null | HTMLDivElement>()
    
    useEffect(()=>{
        if(chatId){
            const unSub = onSnapshot(doc(db,"chats",`${chatId}`),(doc)=>{
                doc.exists() && setMessages(doc.data().messages as Array<Imsg>)
            })
            return ()=>{
                unSub()
            }
        }

    },[chatId])
    
    useEffect(() => {
        ref.current && ref?.current?.scrollIntoView({ behavior: "smooth" });
        
    }, [messages]);


  return (
    <div  className='w-full relative max-h-full bg-[#ddddf7]' style={{overflowY:'scroll',height: `calc(100% - 90px)`}}>
        {   messages ?
            messages.map((m,i)=>(
                <div key={i}  style={{display:"flex",flexDirection:"column-reverse",alignItems:`${m.senderId === auth.currentUser.uid && "flex-end" }`}}>
                    {m?.senderId === auth.currentUser.uid ? (
                        <div className='flex flex-row-reverse '>
                            <div className='h-[50px]'>
                                <img src={auth.currentUser.photoURL} alt="Pp owner" width={"40px"} height={"40px"} className='rounded-full m-2'  style={{maxHeight:"50px",maxWidth:"50px"}}/>
                            </div>
                            <span className='my-3 px-3 max-w-[80%] bg-[#8da4f1] rounded-md'>{m.text}</span>
                        </div>
                    ):(
                        <div className='flex flex-row'>
                            <div>
                                <img src={user.photoURL} alt="Profile photo" width={"40px"} height={"40px"} className='rounded-full m-2' />
                            </div>
                            <span className='my-3 px-3 max-w-[80%] bg-[#8da4f1] rounded-md'>{m.text}</span>
                        </div>
                    )
                    
                    }
                    
                </div>
            ))
            :
            (
                <Ring 
                    size={40}
                    lineWeight={5}
                    speed={2} 
                    color="black" 
                />
            )
        }
        <div id='down' ref={ref}></div>
    </div>
  )
}

// style={{display:'flex',alignItems:'flex-end'}}