import React from 'react'
import { Navigate ,Outlet} from "react-router-dom";
import { auth } from '../firebase';
import {useAuthState} from "react-firebase-hooks/auth"
import { Ring } from '@uiball/loaders'


const IsAuth = ()=> {
    
    const [user, loading, error] = useAuthState(auth);   

    if(loading){
        return <Ring 
        size={40}
        lineWeight={5}
        speed={2} 
        color="black" 
       />
    }
    if(user){
        return <Outlet/>
    }else{
        return <Navigate to={"/"} replace/>
    }
   
}
export default IsAuth