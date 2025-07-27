import { useEffect,useState } from "react";

export function useLocalStorgeState(initialState,key){ 
    //Whenever a initial state of useState is depend on some computations make sure to pass a callback funnction instead of a function call, this process is called lazy evaluation!
    const [value, setValue] = useState(function(){
       const storedValue= localStorage.getItem(key)
       return storedValue?  JSON.parse(storedValue):initialState;
    });
    useEffect(function(){
        localStorage.setItem(key, JSON.stringify(value));
    },[value,key]);
    
    return [value,setValue];
}