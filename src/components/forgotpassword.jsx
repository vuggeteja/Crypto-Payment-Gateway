import React from "react";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { otpf } from "../services/otpService";
import { resendSer } from "../services/otpService";
import Form from "../common/Form";
import Joi from "joi-browser";
import { changepassword } from "../services/userService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { forgot } from "../services/userService";
import { pushRoute } from "../common/pushRoute";

class Forgot extends Form {

    state = {
      errors: {},
      captcha: "",
      OTPS: "",
      otp: "",
      forgotresponse:'',
      forgototpsuccess:'',
      otpclicked: true,
      timeRemaining: 10,
      clicked:false,
      data: {
        user_email: "",
        password: "",
      },
      isTimerStarted: true,
      disable: false,
      forgot:false
    };

    schema = {
      user_email: Joi.string().email({ tlds: { allow: false } }).min(5).max(25).required(),
      password: Joi.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"password").required(),
      confirmpassword: Joi.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"password")
      .required(),
      };

    componentDidMount() {
      this.setState({ type1: "password", type2: "password" });
      // resendSer();
    }

    handleClick1 = () => this.setState(({ type1 }) => ({ type1: type1 === "text" ? "password" : "text" }));

    handleClick2 = () => this.setState(({ type2 }) => ({ type2: type2 === "text" ? "password" : "text" }));

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

    handleOtpInput = (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    };
    
    handleOTPButtonClick = async (e) => {
      e.preventDefault();
      this.setState({ clicked: !this.state.clicked });
      const { user_email } = this.state.data;
      const { otp } = this.state;
      this.setState({ otp, user_email });
      const data = { otp, user_email };
      console.log(data, "dataotp");
      // this.props.navigate("/login")
      try {
        const forgototpsuccess = await otpf(data);
        console.log(forgototpsuccess);
        console.log(forgototpsuccess.data);
        toast("OTP Success");
        this.setState({forgototpsuccess})
        this.props.navigate("/changepassword")
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

    handleCaptchaChange = (value) => {
      this.setState({ captcha: value });
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

    doSubmit = async (e) => {
      e.preventDefault();
      this.setState({forgotclicked:!this.state.forgotclicked})
      try {
        const { data, otp } = this.state;
        const { confirmpassword, ...postData } = data;
        postData.otp = otp;
        const abc = await changepassword(postData);
        console.log(abc, "reg");
        // toast(abc);
        //   this.props.navigate("/");
        const OTPS = abc;
        this.setState({ OTPS });
        this.startTimer();
        toast("Password changed Successfully")
        this.props.navigate("/login");
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.username = ex.response.data;
          this.setState({ errors });
          setTimeout(() => {
            this.setState({ forgotclicked: false }); 
          }, 5000);
          toast.error(errors.username);
        }
      }
    };

    forgotPassword = async (e) =>{
      e.preventDefault();
      this.setState({ otpclicked: !this.state.otpclicked });
      try{
        const { user_email } = this.state.data;
        const { captcha } = this.state;
        this.setState({ captcha });
        const user = { user_email, captcha };
        const forgotresponse = await forgot(user)
        toast(forgotresponse)
        this.setState({forgotresponse})
        this.startTimer();
        // this.props.navigate('/otppage')
      }
      catch(error){
        setTimeout(() => {
          this.setState({ clicked: false }); 
        }, 5000);
      }
    }

    forgotPage = () => {
      this.setState({forgot:!this.state.forgot})
    }
    
    handleOtpChange = (event) => {
      const newOtp = event.target.value;
      this.setState({ otp: newOtp });
    };
    
    render(){
      const { errors, data, clicked, type1, type2, pwd, forgototpsuccess, OTPS, abc, timeRemaining, forgotresponse } = this.state;
      return(
      <>
      {!forgotresponse ?
      <React.Fragment>
        <div>
          <div className="pace  pace-inactive">
            <div className="pace-progress" data-progress-text="100%" data-progress={99} style={{ transform: "translate3d(100%, 0px, 0px)" }}>
              <div className="pace-progress-inner"></div>
            </div>
            <div className="pace-activity"></div>
          </div>
          <div className="container-fluid">
            <div className="login-wrapper row">
              <div id="login" className="login display-center loginpage col-lg-offset-4 col-md-offset-3 col-sm-offset-3 col-xs-offset-0 col-xs-12 col-sm-6 col-lg-4"
              style={{ marginTop: "60px" }}>
                <div className="login-form-header">
                  <img src={ process.env.PUBLIC_URL + "/assets/images/icons/padlock.png" } alt="login-icon" style={{ maxWidth: "64px" }} />
                  <div className="login-header">
                    <h4 className="bold color-white">  Email Verification!  </h4>
                  </div>
                </div>
                <div className="box login">
                  <div className="content-body" style={{ paddingTop: "30px" }}>
                    <form id="msg_validate" action="" noValidate="novalidate" className="no-mb no-mt">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="form-group" style={{ textAlign: "center" }}>
                            <label className="form-label" style={{ textAlign: "center", fontSize: "16px" }}>
                              <h3>Account Recovery:</h3>    OTP will sent to below mail
                            </label>
                            <span style={{ color: "slateblue" }}>{data.user_email}</span>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="controls">
                              <input type="text" className="form-control" name="user_email" value={data.user_email} onChange={this.handleChange}
                              placeholder="Enter Mail here" />
                            </div>
                            <ReCAPTCHA sitekey="6LcAjHglAAAAANXETQV-6UuUwkl2b8jml8G2Mnoe" onChange={this.handleCaptchaChange} ref={this.recaptchaRef} />
                          </div>
                          <div>
                            <button disabled={ !this.state.otpclicked || !this.state.captcha || data.user_email.length<5 } onClick={this.forgotPassword}
                            className="btn btn-primary btn-corner log-stretched" style={{marginLeft:'9rem', width:'190px', marginTop:'16px'}}>
                              Get OTP
                            </button>
                          </div>
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
      :
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
              <img src={process.env.PUBLIC_URL + "/assets/images/icons/padlock.png" } alt="login-icon" style={{ maxWidth: "64px" }} />
                <div className="login-header">
                  <h4 className="bold color-white">Change Password!</h4>
                  <h4><small>Please enter your data to Change Password.</small></h4>
                </div>
              </div>
              <div className="box login">
                <div className="content-body" style={{ paddingTop: "30px" }}>
                  <form id="msg_validate" action="" noValidate="novalidate" className="no-mb no-mt">
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div className="controls">
                            <input maxLength={15} type={type1} id="password" value={data.password} onChange={this.handleChange} name="password"
                             className="form-control" placeholder="Password" />
                            <span className="password__show " onClick={this.handleClick1}>{type1 === "text" ? <FaEye /> : <FaEyeSlash />}</span>
                            {errors && (<div className="errors">{errors?.password}</div>)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirm Password</label>
                            <div className="controls">
                              <input maxLength={15} type={type2} id="confirmpassword" value={data.confirmpassword} onChange={this.handleChange}
                               name="confirmpassword" className="form-control" placeholder="Confirm Password" />
                              <span className="password__show " onClick={this.handleClick2}>{type2 === "text" ? <FaEye /> : <FaEyeSlash />}</span>
                              {errors && (<div className="errors">{errors?.confirmpassword}</div>)}
                            </div>
                          </div>
                          <span style={{ color: "slateblue" }}>OTP Sent to {data.user_email}</span> 
                            <div className="form-group">
                              <label className="form-label">OTP</label>
                              <div className="controls">
                                <input type="text" className="form-control" name="otp" value={this.state.otp} onChange={this.handleOtpChange}
                                  maxLength={6} pattern="[0-9]{6}" onInput={this.handleOtpInput} placeholder="Enter OTP here" />
                              </div>
                            </div>
                            <p style={{ textAlign: "center" }}>{timeRemaining>0 ? <p>Code is expiring : {timeRemaining}</p> : <p>{timeRemaining}</p> }</p>
                            {timeRemaining === "Times up!" && (<div className="text-center font-weight-light">
                              Did't receive an OTP?{" "}
                              <button onClick={this.resendButton} disabled={this.state.resendclicked} className="text-dark cursor_pointer mt-2 mb-3"
                               style={{color: "rgb(255, 255, 255)",textDecoration: "underline",fontWeight: "bold",border:'none',Background:'none'}}>
                                ResendOTP
                              </button>
                            </div>)}
                            <div className="pull-left">
                              <button disabled={this.validation() || this.state.forgotclicked || this.state.otpclicked || this.state.otp.length < 6 || timeRemaining==="Times up!"}
                                style={{ marginLeft: "6rem", width:'16rem' }} className="btn btn-primary mt-4 btn-corner  log-stretched"
                                onClick={this.doSubmit}>
                                Change Password
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
        </>
      )
    }
  }

export default pushRoute(Forgot)