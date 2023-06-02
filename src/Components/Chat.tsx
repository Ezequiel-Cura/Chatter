import React, { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import Messages from './Messages'
import { doc, setDoc,collection ,serverTimestamp,getDoc,query,where, getDocs, updateDoc,onSnapshot,arrayUnion, Timestamp} from 'firebase/firestore';
import { db,auth } from '../firebase'
import { v4 as uuidv4 } from "uuid"

export default function Chat() {
  const {user,chatId} = useChatStore(state=>state)
  const [text,setText] = useState<string>("")
  const {currentUser} = auth


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setText(e.target.value)
  }

  const handleSend = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
      if(text){
        await updateDoc(doc(db,"chats",`${chatId}`),{
          messages: arrayUnion({
            id: uuidv4(),
            text,
            senderId: currentUser.uid,
            date:Timestamp.now()
          })
        })
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [chatId + ".lastMessage"]:{
            text
          },
          [chatId+".date"]:serverTimestamp()
        })
        
        const res = await getDoc(doc(db,"userChats",`${user.uid + currentUser.uid}`))

        if(res.exists()){
          await updateDoc(doc(db,"userChats",user.uid),{
            [chatId + ".lastMessage"]:{
              text
            },
            [chatId+".date"]:serverTimestamp()
          })

        }else{
          await setDoc(doc(db,"userChats",`${user.uid + currentUser.uid}`),{
            [chatId + ".lastMessage"]:{
              text
            },
            [chatId+".date"]:serverTimestamp()
          })
        }
        setText("")
      }else{
        return
      }    
      setText("")
    } catch (error) {
      console.log(error)
      setText("")
    }    
    setText("")
  }

  return (
    <div className='w-[75%] h-[90%] my-[40px] bg-blue-200 relative rounded-tr-lg rounded-br-lg max-h-[1200px]'>
      <div className='px-3 border-b-4 bg-indigo-500 h-14'>
        <span style={{fontSize:"30px"}}>{user.displayName}</span>
      </div>
      <div className='h-[100%] '>
        <Messages/>
      </div>
           
      <form className='absolute bottom-0 h-9 w-full flex flex-row flex-nowrap justify-center bg-white' onSubmit={handleSend}>
        <input type="text" className='w-full h-full ' name='messages' onChange={e=>handleChange(e)} value={text}/>
        <button type='submit' className='bg-indigo-500 px-3'>Send</button>
      </form>

    </div>
  )
}
