import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import * as userService from "../services/userService";
import { otpf, resendSer } from "../services/otpService";
import { pushRoute } from "../common/pushRoute";
import Form from "../common/Form";
import { userdetails } from "../services/authService";

class Register extends Form {
  state = {
    errors: {},
    captcha: "",
    OTPS: "",
    otp: "",
    isChecked: false,
    clicked: false,
    timeRemaining: 20,
    data: {
      user_email: "",
      fullName: "",
      password: "",
    },
    isTimerStarted: true,
    disable: false,
  };

  componentDidMount() {
    this.setState({ type1: "password", type2: "password" });
    // const resotp = resendSer();
  }

  schema = {
    fullName: Joi.string().regex(/^[a-zA-Z._%+-]/, { fullName: "name" }).min(5).max(15).required(),
    user_email: Joi.string().email({ tlds: { allow: false } }).min(5).max(250).required(),
    password: Joi.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"password").required(),
    confirmpassword: Joi.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"password").required(),
  };

  handleClick1 = () =>
    this.setState(({ type1 }) => ({
      type1: type1 === "text" ? "password" : "text",
    }));

  handleClick2 = () =>
    this.setState(({ type2 }) => ({
      type2: type2 === "text" ? "password" : "text",
    }));

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

  handleCaptchaChange = (value) => {
    this.setState({ captcha: value });
  };

  handleCheckboxChange = (event) => {
    this.setState({ isChecked: event.target.checked });
  }

  doSubmit = async (e) => {
    e.preventDefault();
    this.setState({ clicked: !this.state.clicked });
    try {
      const { data, captcha } = this.state;
      const { confirmpassword, ...postData } = data;
      postData.captcha = captcha;
      const abc = await userService.register(postData);
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

  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ timeRemaining: 10 });
  };

  resendButton = async (e) =>{
    e.preventDefault();
    // this.setState({ otpclicked: !this.state.otpclicked });
    const { user_email } = this.state.data;
    this.setState({ user_email });
    const mail = {user_email}
    // console.log(mail,'mail')
    const otpbut = await resendSer(mail);
    toast(otpbut);
    try{
    this.resetTimer();
    this.startTimer();
    // this.setState({ resendclicked: !this.state.resendclicked });
    // console.log(otpbut,'otpbut')
    }
    catch(error){
      setTimeout(() => {
        this.setState({ resendclicked: false }); 
      }, 5000);
      this.setState({ resendclicked: this.state.resendclicked });
    }
  }

  handleOtpInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
  };

  handleOTPButtonClick = async (e) => {
    e.preventDefault();
    this.setState({ otpclicked: !this.state.otpclicked })
    const { user_email } = this.state.data;
    const { otp } = this.state;
    this.setState({ otp, user_email });
    const data = { otp, user_email };
    // console.log(data, "dataotp");
    try {
      const response = await otpf(data);
      // console.log(response);
      // console.log(response.data);
      toast("OTP Success");
      this.props.navigate("/dashboard");
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

  handleOtpInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
  };

  handleOtpChange = (event) => {
    const newOtp = event.target.value;
    this.setState({ otp: newOtp });
  };

  render() {
    const { errors, data, OTPS, timeRemaining, type1, type2, clicked, otpClicked, otp, isChecked } = this.state;
    // console.log(this.state.data, this.state.errors);
    return (
      <div className="container-fluid">
        {!OTPS ? (
        <div className="login loginpage col-lg-offset-2 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-8"
            style={{ marginTop: "30px" }}>
          <div className="login-form-header">
            <img src={process.env.PUBLIC_URL + "/assets/images/icons/signup.png"} alt="login-icon" style={{ maxWidth: "64px" }} />
            <div className="login-header">
              <h4 className="bold color-white">Signup Now!</h4>
              <h4> <small>Please enter your data to register.</small> </h4>
            </div>
          </div>
          <div className="box login">
            <div className="content-body" style={{ padding: "30px" }}>
              <form id="msg-validate" action="#" className="no-md no-mt">
                <div className="login-wrapper row">
                  <div className="col-xs-12">
                    <div className="d-flex">
                      <div className="col-lg-6 no-pl">
                        <div className="form-group">
                          <label className="form-label">Full name</label>
                          <div className="controls">
                            <input type="text" id="fullName" placeholder="Please Enter Name" name="fullName" value={data.fullName}
                             className="form-control" onChange={this.handleChange} />
                            {errors && (<div className="errors">{errors?.fullName}</div>)}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 no-pr">
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <div className="controls">
                            <input type="text" id="user_email" name="user_email" value={data.user_email} className="form-control"
                              placeholder="Enter Email" onChange={this.handleChange} />
                            {errors && (<div className="errors">{errors?.user_email}</div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-lg-6 no-pl">
                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div className="controls">
                            <input type={type1} id="password" placeholder="Enter Password" name="password" onChange={this.handleChange}
                              value={data.password} className="password__input form-control" />
                            <span className="password__show " onClick={this.handleClick1}>
                              {type1 === "text" ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            {errors && (<div className="errors">{errors?.password}</div>)}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 no-pr">
                        <div className="form-group">
                          <label className="form-label">Confirm Password</label>
                            <div className="controls">
                              <input type={type2} id="confirmpassword" name="confirmpassword" placeholder="Re-Enter Password"
                                onChange={this.handleChange} value={data.confirmpassword} className="password__input form-control" />
                              <span className="password__show " onClick={this.handleClick2}>
                                {type2 === "text" ? <FaEye /> : <FaEyeSlash />}
                              </span>
                              {errors && (<div className="errors">{errors?.confirmpassword}</div>)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="captcha">
                        <ReCAPTCHA sitekey="6LcAjHglAAAAANXETQV-6UuUwkl2b8jml8G2Mnoe" onChange={this.handleCaptchaChange} />
                      </div>
                      <div className="  font-weight-light mt-3 terms_text ">
                        <input type="checkbox" checked={isChecked} onChange={this.handleCheckboxChange} /> I have read and accept the
                        &nbsp;
                        <span className="color_blue cursor_pointer">
                          Terms and Conditions
                        </span>{" "}
                        &amp;
                        <span className="color_blue cursor_pointer">
                          {" "}
                          Data Privacy{" "}
                        </span>
                      </div>{" "}
                    </div>
                    <div className="pull-left">
                      <button disabled={ this.validation() || !this.state.captcha || this.state.clicked || !isChecked }
                        className="btn btn-primary mt-3 btn--stretched" style={{ whiteSpace: "nowrap" }} onClick={this.doSubmit}>
                        Sign up
                      </button>
                      <div className="text-center font-weight-light mt-3 d-flex" style={{ marginLeft: '20rem', gap: '10px' }}>
                        Already have an account?
                        <span className="login__text cursor_pointer text-cprimary" style={{ textDecoration: "underline", fontWeight: "bold",
                            fontSize: "0.9rem", }}>
                          <a href="login" style={{ color: "#0a58ca" }}>LogIn</a>
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            <React.Fragment>
              <div>
                <div className="pace  pace-inactive">
                  <div className="pace-progress" data-progress-text="100%" data-progress={99} style={{transform: "translate3d(100%, 0px, 0px)"}}>
                    <div className="pace-progress-inner"></div>
                  </div>
                  <div className="pace-activity"></div>
                </div>
                <div className="container-fluid">
                  <div className="login-wrapper row">
                    <div id="login"
                      className="login display-center loginpage col-lg-offset-4 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-4"
                      style={{ marginTop: "60px" }}>
                      <div className="login-form-header">
                        <img src={ process.env.PUBLIC_URL + "/assets/images/icons/padlock.png" } alt="login-icon" style={{ maxWidth: "64px" }} />
                        <div className="login-header">
                          <h4 className="bold color-white"> OTP Verification! </h4>
                        </div>
                      </div>
                      <div className="box login">
                        <div className="content-body" style={{ paddingTop: "30px" }}>
                          <form id="msg_validate" action="#" noValidate="novalidate" className="no-mb no-mt">
                            <div className="row">
                              <div className="col-xs-12">
                                <div className="form-group" style={{ textAlign: "center" }}>
                                  <label className="form-label" style={{ textAlign: "center", fontSize: "16px", }}>
                                    Please enter the OTP sent to your Email.
                                  </label>
                                  <span style={{ color: "slateblue" }}> {data.user_email} </span>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">OTP</label>
                                  <div className="controls">
                                    <input type="text" className="form-control" name="otp" value={data.otp} onChange={this.handleOtpChange}
                                      maxLength={6} pattern="[0-9]{6}" onInput={this.handleOtpInput} placeholder="Enter OTP here" />
                                  </div>
                                </div>
                                <p style={{ textAlign: "center" }}> {timeRemaining>0 ? <p>Code is expiring : {timeRemaining}</p> : <p>{timeRemaining}</p> }</p>
                                <div>
                                  <button disabled={this.state.otpclicked || this.state.otp.length < 6} className="btn btn-primary otpverify"
                                    style={{ margin: "0px 12rem" }} onClick={this.handleOTPButtonClick}>
                                    Verify
                                  </button>
                                </div>
                                {timeRemaining === "Times up!" && (
                                <div className="text-center font-weight-light">
                                  Did't receive an OTP?{" "}
                                  <button onClick={this.resendButton} disabled={this.state.resendclicked}
                                    className="text-dark cursor_pointer mt-2 mb-3" style={{ color: "rgb(255, 255, 255)",
                                    textDecoration: "underline", fontWeight: "bold", border:'none', Background:'none' }}>
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
        )}
      </div>
    );
  }
}

export default pushRoute(Register);
