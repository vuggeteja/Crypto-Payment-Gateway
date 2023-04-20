import http from "./httpService";
import Crypto from "./crypto";

// const apiEndpoint =  "http://192.168.0.175:8090/api/user/userregistration";

// export async function register(user) {
//   console.log(user,'useserv')
//   const encrypted = Crypto.encryptobj(user);
//   const register = await http.post(apiEndpoint,{enc:encrypted});
//   const decryptedDocument = await Crypto.decrypt(register.data)
//   return decryptedDocument
// }

export async function register(user) {
  console.log(user,'useserv')
  const encrypted = Crypto.encryptobj(user);
  const register = await http.post(process.env.REACT_APP_API_URL +"/user/userregistration",{enc:encrypted});
  const decryptedDocument = await Crypto.decrypt(register.data)
  return decryptedDocument
}

// export async function forgot(user) {
//   console.log(user,'useserv')
//   const encrypted = Crypto.encryptobj(user);
//   const register = await http.post("http://192.168.0.175:8090/api/user/PasswordChange",{enc:encrypted});
//   const decryptedDocument = await Crypto.decrypt(register.data)
//   console.log(decryptedDocument,'forgot')
//   return decryptedDocument
// }


export async function forgot(user) {
  console.log(user,'useserv')
  const encrypted = Crypto.encryptobj(user);
  const register = await http.post(process.env.REACT_APP_API_URL +"/user/PasswordChange",{enc:encrypted});
  const decryptedDocument = await Crypto.decrypt(register.data)
  console.log(decryptedDocument,'forgot')
  return decryptedDocument
}

// export async function changepassword(user) {
//   console.log(user,'useserv')
//   const encrypted = Crypto.encryptobj(user);
//   const register = await http.post("http://192.168.0.175:8090/api/user/chngpswdotpverification",{enc:encrypted});
//   const decryptedDocument = await Crypto.decrypt(register.data)
//   console.log(decryptedDocument,'forgot')
//   return decryptedDocument
// }

export async function changepassword(user) {
  console.log(user,'useserv')
  const encrypted = Crypto.encryptobj(user);
  const register = await http.post(process.env.REACT_APP_API_URL +"/user/chngpswdotpverification",{enc:encrypted});
  const decryptedDocument = await Crypto.decrypt(register.data)
  console.log(decryptedDocument,'forgot')
  return decryptedDocument
}


