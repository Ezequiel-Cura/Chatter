import { create } from "zustand";
import {devtools,persist} from "zustand/middleware"

import { auth } from "../firebase";

interface IChat{
    user:{
        displayName? :string
        photoURL? :string
        uid?:string
        lastMessage?:string
    },
    users?:[
        {
            displayName? :string
            photoURL? :string
            uid?:string
            lastMessage?:string
        }
    ],
    chatId:string
    changeChat:(payload:any)=>void
    setUsers:(payload:any)=>void
}

// export const useChatStore = create(persist<IChat>((set,get)=>({
//     user:{ 
//         displayName: "",
//         photoURL: "",
//         uid: "",
//         lastMessage: ""
//     },
//     chatId:"",
//     changeChat:(payload)=>{
//         set(state=>({
//             user:{
//                 uid:payload.uid,
//                 lastMessage:payload.lastMessage,
//                 displayName:payload.displayName,
//                 photoURL:payload.photoURL 
//             },
//             chatId:  auth.currentUser?.uid > payload.uid
//             ? auth.currentUser?.uid + payload.uid
//             : payload.uid + auth.currentUser.uid,
//         }))
//     }
// }),{
//     name:"chat"
// }))

export const useChatStore = create<IChat>()((set,get) =>( {
    user:{ 
        displayName: "",
        photoURL: "",
        uid: "",
        lastMessage: ""
    },
    users:[{
        displayName: "",
        photoURL: "",
        uid: "",
        lastMessage: ""
    }],
    chatId:"",
    changeChat:(payload)=>{
        set(state=>({
            ...state,
            user:{
                uid:payload.uid,
                lastMessage:payload.lastMessage,
                displayName:payload.displayName,
                photoURL:payload.photoURL 
            },
            chatId:  auth.currentUser?.uid > payload.uid
            ? auth.currentUser?.uid + payload.uid
            : payload.uid + auth.currentUser.uid,
        }))
    },
    setUsers:(payload)=>{
        

        // set((state)=>({
        //     ...state,
        //     users: payload.map((p:any)=>{
        //         console.log("store",p)
        //         return {
        //             displayName: p[1].displayName,
        //             photoURL:p[1].photoURL,
        //             uid: p[1].uid,
        //             lastMessage: p[1].lastMessage
        //         }
        //     })
        // }))
    }
}))
