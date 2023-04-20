import React, { Component } from 'react';
import { otpf } from "../services/otpService";
import Joi from 'joi-browser'
import { toast } from "react-toastify";
import { resendSer } from "../services/otpService";

class OTPVerificationPage extends Component {
    state = {
    errors: {},
    captcha: "",
    OTPS: "",
    otp: "",
    forgotresponse:'',
    otpclicked: false,
    timeRemaining: 10,
    data: {
      user_email: "",
      password: "",
    },
    isTimerStarted: true,
    disable: false,
    forgot:false
  };
 handleOtpInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
  };

  handleOTPButtonClick = async (e) => {
    e.preventDefault();
    this.setState({ otpclicked: !this.state.otpclicked });
    const { user_email } = this.state.data;
    const { otp } = this.state;
    this.setState({ otp, user_email });
    const data = { otp, user_email };
    console.log(data, "dataotp");

    // this.props.navigate("/login")
    try {
      const response = await otpf(data);
      console.log(response);
      console.log(response.data);
      toast("OTP Success");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const erro = error.response.data;
        setTimeout(() => {
          this.setState({ otpclicked: false }); 
        }, 5000);
        toast(erro);
      }
    }
  };

  
  resendButton = async (e) =>{
    e.preventDefault();
    this.setState({ otpclicked: !this.state.otpclicked });
    const { user_email } = this.state.data;
    this.setState({ user_email });
    const mail = {user_email}
    console.log(mail,'mail')
    const otpbut = await resendSer(mail);
    toast(otpbut);
    try{
    this.resetTimer();
    this.startTimer();
    // this.setState({ resendclicked: !this.state.resendclicked });
    console.log(otpbut,'otpbut')
    }
    catch(error){
      setTimeout(() => {
        this.setState({ resendclicked: false }); 
      }, 5000);
      this.setState({ resendclicked: this.state.resendclicked });
    }
  }

  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  
    this.setState({
      timeRemaining: 10 
    });
  };

   startTimer = () => {
    this.setState(() => {
      this.timer = setInterval(() => {
        this.setState(
          (prevState) => ({ timeRemaining: prevState.timeRemaining - 1 }),
          () => {
            if (this.state.timeRemaining === 0) {
              clearInterval(this.timer);

              this.setState({ timeRemaining: "Times up!" });
            }
          }
        );
      }, 1000);
    });
  };

  handleOtpChange = (event) => {
    const newOtp = event.target.value;
    this.setState({ otp: newOtp });
  };
 


  render() {
    const { user_email, otp, data, timeRemaining } = this.state;

    return (
      <React.Fragment>
                  <div>
                    <div className="pace  pace-inactive">
                      <div
                        className="pace-progress"
                        data-progress-text="100%"
                        data-progress={99}
                        style={{
                          transform: "translate3d(100%, 0px, 0px)",
                        }}
                      >
                        <div className="pace-progress-inner"></div>
                      </div>
                      <div className="pace-activity"></div>
                    </div>
                    <div className="container-fluid">
                      <div className="login-wrapper row">
                        <div
                          id="login"
                          className="login display-center loginpage col-lg-offset-4 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-4"
                          style={{ marginTop: "60px" }}
                        >
                          <div className="login-form-header">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/icons/padlock.png"
                              }
                              alt="login-icon"
                              style={{ maxWidth: "64px" }}
                            />
                            <div className="login-header">
                              <h4 className="bold color-white">
                                OTP Verification!
                              </h4>
                              
                            </div>
                          </div>
                          <div className="box login">
                            <div
                              className="content-body"
                              style={{ paddingTop: "30px" }}
                            >
                              <form
                                id="msg_validate"
                                action=""
                                noValidate="novalidate"
                                className="no-mb no-mt"
                              >
                                <div className="row">
                                  <div className="col-xs-12">
                                    <div
                                      className="form-group"
                                      style={{ textAlign: "center" }}
                                    >
                                      <label
                                        className="form-label"
                                        style={{
                                          textAlign: "center",
                                          fontSize: "16px",
                                        }}
                                      >
                                        A one time 6 digit code has been sent to
                                        your email.
                                      </label>
                                      <span style={{ color: "slateblue" }}>
                                        {data.user_email}
                                      </span>
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">OTP</label>
                                      <div className="controls">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="otp"
                                          value={data.otp}
                                          onChange={this.handleOtpChange}
                                          maxLength={6}
                                          pattern="[0-9]{6}"
                                          onInput={this.handleOtpInput}
                                          placeholder="Enter OTP here"
                                        />
                                      </div>
                                     
                                    </div>
                                    <p style={{ textAlign: "center" }}>
                                      Code is expiring : {timeRemaining}
                                    </p>
                                    <div>
                                      <button
                                        disabled={
                                          this.state.otpclicked ||
                                          this.state.otp.length < 6
                                        }
                                        onClick={this.handleOTPButtonClick}
                                        // href="dashboard"
                                        className="btn btn-primary btn-corner log-stretched"
                                        style={{marginLeft:'9rem'}}
                                      >
                                        VERIFY
                                      </button>
                                     
                                    </div>
                                    {timeRemaining === "Times up!" && (<div
                                      className="text-center font-weight-light"
                                      
                                    >
                                      Did't receive an OTP?{" "}
                                      <button onClick={this.resendButton} 
                                      disabled={
                                     this.state.resendclicked 
                                  }
                                    className="text-dark cursor_pointer mt-2 mb-3"
                                    style={{
                                      color: "rgb(255, 255, 255)",
                                      textDecoration: "underline",
                                      fontWeight: "bold",
                                      border:'none',
                                      Background:'none'
                                    
                                    }}
                                  >
                                    ResendOTP
                                  </button>
                                    </div>)}
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>)
  }
}

export default OTPVerificationPage;
