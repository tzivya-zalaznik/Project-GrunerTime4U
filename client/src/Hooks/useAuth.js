import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = localStorage.getItem("token")
    let isAdmin = false
    let isUser = false
    if (token) {
        const userDecode = jwtDecode(token)
        const { _id, name, email, role, watches } = userDecode
        isAdmin = role == "Admin"
        isUser = role == "User"
        return { _id, name, email, role, watches, isAdmin, isUser }
    }
    return { _id: '', name: '', email: '', role: '', watches: [], isAdmin, isUser }
}

export default useAuth
