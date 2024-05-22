import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../Hooks/useAuth"

const RequireAuth=({allowRoles})=>{
    const {role}=useAuth()
    const userAllowed=allowRoles.includes(role)
    if(userAllowed) return <Outlet/>
    return <Navigate to="/gallery" replace/>
}

export default RequireAuth