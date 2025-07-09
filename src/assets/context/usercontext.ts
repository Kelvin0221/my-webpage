import { createContext, useContext } from "react"
export type userContext = {
  username: string;
  setUsername: (n:string) => void;
}
export const userContext = createContext<userContext>({
    username: "", 
    setUsername: ()=>{}
})

export const useUserContext= () => useContext(userContext);