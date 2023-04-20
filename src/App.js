import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Forgot from "./components/forgotpassword";
import OTPVerificationPage from "./components/otppage";
import Login from "./components/login";
import Header from "./components/header";

class App extends Component {
  state = {
  };

  render() {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgotpassword" element={<Forgot />} />
          <Route path="/otppage" element={<OTPVerificationPage />} />
          <Route path="/header" element={<Header />} />
        </Routes>
      </>
    );
  }
}

export default App;
