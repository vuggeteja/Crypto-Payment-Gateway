import http from "./httpService";
import Crypto from "./crypto";
// import jwtDecode from "jwt-decode";
const tokenKey = "token"
// const apiEndpoint =  "http://192.168.0.175:8090/api/user/Registrationotpverification";

export async function otpf(data) {
  // console.log(data,'otpdatta')
  const encrypted = Crypto.encryptobj(data);
  const otpser = await http.post(process.env.REACT_APP_API_URL +"/user/Registrationotpverification",{enc:encrypted});
  const decryptedDocument = await Crypto.decrypt(otpser.data)
  // console.log(decryptedDocument,'decryptedDocumentotp')
  const encr = Crypto.encrypt(decryptedDocument)
  localStorage.setItem(tokenKey, encr);
  // console.log(encr,'otpenc')
  return encr
}

// export async function resendSer(mail) {
//   console.log(mail,'useserv')
//   const encrypted = Crypto.encryptobj(mail);
//   const resend = await http.post("http://192.168.0.175:8090/api/user/resend",{enc:encrypted});
//   const decryptedDocument = await Crypto.decrypt(resend.data)
//   console.log(decryptedDocument,'otpdecryptedDocument')
//   return decryptedDocument
// }

export async function resendSer(mail) {
  console.log(mail,'useserv')
  const encrypted = Crypto.encryptobj(mail);
  const resend = await http.post(process.env.REACT_APP_API_URL +"/user/resend",{enc:encrypted});
  const decryptedDocument = await Crypto.decrypt(resend.data)
  console.log(decryptedDocument,'otpdecryptedDocument')
  return decryptedDocument
}


