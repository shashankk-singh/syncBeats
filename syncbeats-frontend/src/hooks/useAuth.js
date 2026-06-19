import { jwtDecode } from 'jwt-decode'


function useAuth() {
  const token = localStorage.getItem('token')
  if(!token){
    return { token: null, userId: null }
  }
  let userId = null
  try{
    const decode = jwtDecode(token)
    userId = decode.userId
  }catch(err){
    console.log('Invalid token')
  }
  return {token, userId}
}

export default useAuth