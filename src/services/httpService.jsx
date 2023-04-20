import axios from "axios";
import Crypto from "./crypto";
import { toast } from "react-toastify";


axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    toast.error("No Network, Please Connect to Internet");
  }
  return Promise.reject(error);
});

async function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = Crypto.encrypt(jwt);
  
}


export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
