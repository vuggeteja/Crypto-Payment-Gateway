import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { otpf } from "../services/otpService";
import { login } from "../services/authService";
import { resendSer } from "../services/otpService";
import { forgot } from "../services/userService";
import { pushRoute } from "../common/pushRoute";
import Form from "../common/Form";

class Login extends Form {
  state = {
    errors: {},
    captcha: "",
    OTPS: "",
    otp: "",
    forgotresponse:'',
    // otpclicked: false,
    timeRemaining: 20,
    data: {
      user_email: "",
      password: "",
    },
    isTimerStarted: true,
    disable: false,
    forgot:false
  };

  componentDidMount() {
    // this.setState({ type: "password" });
    this.setState({ pwd: false });
  }

  schema = {
    user_email: Joi.string().email({ tlds: { allow: false } }).min(5).max(25).required(),
    password: Joi.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"password").required(),
  };

  handleClick = () => {
    this.setState({ pwd: !this.state.pwd });
  };

  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ timeRemaining: 10 });
  };

  startTimer = () => {
    this.setState(() => {
      this.timer = setInterval(() => {
        this.setState(
          (prevState) => ({ timeRemaining: prevState.timeRemaining - 1 }), () => {
            if (this.state.timeRemaining === 0) {
              clearInterval(this.timer);
              this.setState({ timeRemaining: "Times up!" });
            }
          }
        );
      }, 1000);
    });
  };

  handleCaptchaChange = (value) => {
    this.setState({ captcha: value });
  };

  forgotPassword = async (e) =>{
    e.preventDefault();
    // this.setState({ otpclicked: !this.state.otpclicked });
    try{
    const { user_email } = this.state.data;
    const { captcha } = this.state;
    this.setState({ captcha });
    const user = { user_email, captcha };
    const forgotresponse = await forgot(user)
    toast(forgotresponse)
    this.setState({forgotresponse})
    this.props.navigate('/otppage')
    }
    catch(error){

    }
  }

  forgotPage = () => {
    // this.setState({forgot:!this.state.forgot})
    this.props.navigate('/forgotpassword')
  }

  doSubmit = async (e) => {
    e.preventDefault();
    this.setState({clicked:!this.state.clicked})
    try {
      const { data, captcha } = this.state;
      const { confirmpassword, ...postData } = data;
      postData.captcha = captcha;
      const abc = await login(postData);
      // console.log(abc, "reg");
      toast(abc);
      //   this.props.navigate("/");
      const OTPS = abc;
      this.setState({ OTPS });
      this.startTimer();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        setTimeout(() => {
          this.setState({ clicked: false }); 
        }, 5000);
        toast.error(errors.username);
      }
    }
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
    try {
      const response = await otpf(data);
      console.log(response);
      console.log(response.data);
      this.props.navigate("/dashboard")
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
    // this.setState({ otpclicked: !this.state.otpclicked });
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

  handleOtpChange = (event) => {
    const newOtp = event.target.value;
    this.setState({ otp: newOtp });
  };

  render() {
    const { errors, data, OTPS, abc, timeRemaining, type, pwd, forgotresponse } = this.state;
    const { label } = this.props;
    // console.log(this.state.data, this.state.errors);
    return (
      <React.Fragment>
        <div>
        {!OTPS ? (
          <>
            <div className="pace  pace-inactive">
              <div className="pace-progress" data-progress-text="100%" data-progress={99} style={{ transform: "translate3d(100%, 0px, 0px)" }}>
                <div className="pace-progress-inner"></div>
              </div>
              <div className="pace-activity"></div>
            </div>
            <div className="container-fluid">
              <div className="login-wrapper row">
                <div id="login" className="login display-center loginpage col-lg-offset-4 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-4"
                  style={{ marginTop: "30px" }}>
                  <div className="login-form-header">
                    <img src={process.env.PUBLIC_URL + "/assets/images/icons/padlock.png"} alt="login-icon" style={{ maxWidth: "64px" }} />
                      <div className="login-header">
                        <h4 className="bold color-white">Login Now!</h4>
                        <h4><small>Please enter your data to Login.</small></h4>
                      </div>
                    </div>
                    <div className="box login">
                      <div className="content-body" style={{ paddingTop: "30px" }}>
                        <form id="msg_validate" action="" noValidate="novalidate" className="no-mb no-mt">
                          <div className="row">
                            <div className="col-xs-12">
                              <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="controls">
                                  <input type="text" id="user_email" name="user_email" value={data.user_email} className="form-control"
                                    placeholder="Enter Email" onChange={this.handleChange} />
                                  {errors && (<div className="errors">{errors?.user_email}</div>)}
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="controls">
                                  <input maxLength={15} type={this.state.pwd ? "text" : "password"} value={data.password}
                                   onChange={this.handleChange} name="password" className="form-control" placeholder="Password" />
                                  <span className="password__show " onClick={this.handleClick}>
                                    {pwd === true ? <FaEye /> : <FaEyeSlash />}
                                  </span>
                                  {errors && (<div className="errors">{errors?.password}</div>)}
                                </div>
                              </div>
                              <div className="captcha" style={{ marginTop: "1rem" }}>
                                <ReCAPTCHA sitekey="6LcAjHglAAAAANXETQV-6UuUwkl2b8jml8G2Mnoe" onChange={this.handleCaptchaChange} />
                                {errors && (<div className="errors">{errors?.captcha}</div>)}
                              </div>
                              <div className="pull-left">
                                <button disabled={this.validation() || !this.state.captcha || this.state.clicked} style={{ marginLeft: "9rem" }}
                                  className="btn btn-primary mt-4 btn-corner  log-stretched" onClick={this.doSubmit}>
                                  Login
                                </button>
                              </div>
                              <button onClick={this.forgotPage} style={{background:'none',border:'none'}}>                                
                                <label className="form-check-label  text-danger cursor_pointer mt-2" htmlFor="exampleCheck1" style={{marginLeft:'7rem'}}>
                                  Forgot Password?
                                </label>
                              </button>
                              <div className="text-center font-weight-light mt-3 d-flex" style={{marginLeft:'7rem',gap:'10px' }}>
                                Don't have an account?{" "}
                                <div className="text-dark cursor_pointer " style={{color: "rgb(255, 255, 255)", textDecoration: "underline",
                                    fontWeight: "bold",}}>
                                  <a href="register" style={{ color: "#0d6efd" }}>SignUp</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : 
            <>
              <React.Fragment>
                <div>
                  <div className="pace  pace-inactive">
                    <div className="pace-progress" data-progress-text="100%" data-progress={99} style={{transform: "translate3d(100%, 0px, 0px)",}}>
                      <div className="pace-progress-inner"></div>
                    </div>
                    <div className="pace-activity"></div>
                  </div>
                  <div className="container-fluid">
                    <div className="login-wrapper row">
                      <div id="login" className="login display-center loginpage col-lg-offset-4 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-4"
                        style={{ marginTop: "60px" }}>
                        <div className="login-form-header">
                          <img src={process.env.PUBLIC_URL + "/assets/images/icons/padlock.png"} alt="login-icon" style={{ maxWidth: "64px" }}/>
                            <div className="login-header">
                              <h4 className="bold color-white">OTP Verification!</h4>
                            </div>
                          </div>
                          <div className="box login">
                            <div className="content-body" style={{ paddingTop: "30px" }}>
                              <form id="msg_validate" action="" noValidate="novalidate" className="no-mb no-mt">
                                <div className="row">
                                  <div className="col-xs-12">
                                    <div className="form-group" style={{ textAlign: "center" }}>
                                      <label className="form-label" style={{textAlign: "center", fontSize: "16px",}}>
                                        A one time 6 digit code has been sent to your email.
                                      </label>
                                      <span style={{ color: "slateblue" }}>{data.user_email}</span>
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">OTP</label>
                                      <div className="controls">
                                        <input type="text" className="form-control" name="otp" value={data.otp} onChange={this.handleOtpChange}
                                          maxLength={6} pattern="[0-9]{6}" onInput={this.handleOtpInput} placeholder="Enter OTP here"/>
                                      </div>
                                    </div>
                                    <p style={{ textAlign: "center" }}>{timeRemaining>0 ? <p>Code is expiring : {timeRemaining}</p> : <p>{timeRemaining}</p> }</p>
                                    <div>
                                      <button disabled={this.state.otpclicked || this.state.otp.length < 6} style={{marginLeft:'9rem'}}
                                        onClick={this.handleOTPButtonClick} className="btn btn-primary btn-corner log-stretched">
                                        VERIFY
                                      </button>
                                    </div>
                                    {timeRemaining === "Times up!" && (
                                    <div className="text-center font-weight-light">
                                      Did't receive an OTP?{" "}
                                      <button onClick={this.resendButton} disabled={this.state.resendclicked}
                                        className="text-dark cursor_pointer mt-2 mb-3" style={{color: "rgb(255, 255, 255)",
                                        textDecoration: "underline", fontWeight: "bold", border:'none', Background:'none'}}>
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
                </React.Fragment>
              </>
            }
          </div>
        </React.Fragment>
      );
    }
  }

export default pushRoute(Login);
