// NOTE (persistent-login refactor): we no longer pass a `token` param or set
// an Authorization header on individual requests. Access/refresh tokens now
// live in httpOnly cookies set by the backend on login/signup — JS can't
// read them (that's the point, protects against XSS token theft), so there's
// nothing for the frontend to manually attach anymore.
// `withCredentials: true` tells the browser to include cookies on requests
// to the backend even though frontend (5173) and backend (5000) are
// different origins. The backend must mirror this with
// cors({ credentials: true, origin: <specific origin> }) — can't use
// origin: '*' together with credentials, browsers reject that combo.

import API from './axiosInstance'

export function loginUser(email, password) {
  return API.post('/auth/login', { email, password })
}

export function signupUser(username, email, password) {
  return API.post('/auth/signup', { name: username, email, password })
}

export function logoutUser(){
  return API.post('/auth/logout')
}

export function getMe() {
  return API.get('/auth/me')
}