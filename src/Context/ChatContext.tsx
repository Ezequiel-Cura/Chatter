import {
    createContext,
    useContext,
    useReducer,
} from "react";

import {auth} from "../firebase"

interface Iuser{
    displayName? :string
    photoURL? :string
    email?:string
    uid?:string
}

interface IchatContext{
    user:{

    },
    chatId: string
}



export const ChatContext = createContext<IchatContext>({
    
    chatId: "null",
    user: {},
    
});


export const ChatContextProvider = ({ children }:any) => {
const  currentUser:Iuser   = auth.currentUser

const INITIAL_STATE = {
    chatId: "null",
    user: {},
};

    const chatReducer = (state:any, action:any) => {
    switch (action.type) {
    case "CHANGE_USER":
        return {
        user: action.payload,
        chatId:
            currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
        };

    default:
        return state;
    }
};

const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

return (
    // @ts-ignore
    <ChatContext.Provider value={{ data:state, dispatch }}>     
        {children}
    </ChatContext.Provider>
);
};