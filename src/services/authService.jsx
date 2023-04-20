import http from "./httpService";
import Crypto from "./crypto";
import jwtDecode from "jwt-decode";

// const apiEndpoint = "http://192.168.0.175:8090/api/user/userlogin";
const tokenKey = "token";

export async function login(user) {
  console.log(user, "useserv");
  const encrypted = Crypto.encryptobj(user);
  const login = await http.post(process.env.REACT_APP_API_URL + "/user/userlogin", { enc: encrypted });
  const decryptedDocument = await Crypto.decrypt(login.data);
  // console.log(decryptedDocument, "decryptedDocumentotp");
  // const encr = Crypto.encrypt(decryptedDocument)
  // localStorage.setItem("token",encr);
  
  // console.log(encr,'encr')
  return decryptedDocument;
}

export async function userdetails() {
  // console.log(user, "useserv");
  // const encrypted = Crypto.decryptobj(user);
  const jwt = localStorage.getItem(tokenKey);
  const login = await http.post(process.env.REACT_APP_API_URL + "/user/getuserdetails");
  const decryptedDocument = await Crypto.decryptobj(login);
  console.log(decryptedDocument, "decryptedDocumentotp");
  return decryptedDocument;
}

export async function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    // const decr = await Crypto.decryptobj(jwt)
    // const decre = jwtDecode(decr)
    // return decre
  } catch (ex) {
    return null;
  }
}