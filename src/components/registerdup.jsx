import React, { Component } from "react";
import { register } from "../services/userService";
import ReCAPTCHA from "react-google-recaptcha";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../common/Form";
// import { toastfun } from "../../commons/toast";
import { pushRoute } from "../common/pushRoute";
import Joi from 'joi-browser';

// const Joi = require("joi-browser");

var recaptchaRef = React.createRef();
var capt = process.env.REACT_APP_CAPTCHA;

class IndividualRegisterForm extends Form {
  state = {
    data: {
      captcha: "",
    },
    errors: {},

    buttonDisabled: false,
    loader: false,
  };

  componentDidMount = async () => {
    const data = { ...this.state.data };
    const ref = this.props?.params;
    const parsed = ref;
    if (parsed && parsed.refId && parsed.refId.length > 10) {
      data.intro_id = parsed.refId;
      await this.setState({ data });
    }
  };

  schema = {
    member_name: Joi.string().min(5).max(50).trim().required().label("Name"),
    phone: Joi.string().min(10).max(10).required().label("Phone"),
    password: Joi.string()
      .min(8)
      .max(15)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
      .options({
        language: {
          string: {
            regex: {
              base: "Must contain at least 1 lowercase,1 uppercase alphabetical,1 numeric ",
              test: "another description",
            },
          },
        },
      })
      .label(" Password"),
    cpassword: Joi.string()
      .min(8)
      .max(15)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
      .options({
        language: {
          string: {
            regex: {
              base: "Must contain at least 1 lowercase,1 uppercase alphabetical,1 numeric ",
              test: "another description",
            },
          },
        },
      })
      .label("Confirm Password"),
    captcha: Joi.string().required().label("Captcha "),
    intro_id: Joi.optional().label("Referral Id "),
  };
  getrandomstring = () => {
    try {
      const gg = crypto.randomUUID();
      if (gg) return gg;
    } catch (error) {
      return "web";
    }
  };

  doSubmit = async () => {
    const randonid = this.getrandomstring();
    localStorage.setItem("randonid", randonid);
    // const fcm = await getfcmtoken();

    const { data } = this.state;

    await this.setState({ loader: true });
    const { navigate } = this.props;
    if (!this.state.checkTerms) {
      // toastfun("Please Accept Terms & Conditions ", "error");
      await this.setState({ loader: false });
      return;
    }
    if (data.password !== data.cpassword) {
      // toastfun("Confirm Password Mismatch", "error");
      await this.setState({ loader: false });
      return;
    }
    try {
      const obj = {
        member_name: data.member_name,
        phone: "63" + data.phone,
        user_type: "Individual",
        password: data.password,
        // fcmtoken: fcm,
        device_id: randonid || "web",
        intro_id: data.intro_id,
        captcha: data.captcha,
      };
      const res = await register(obj);

      if (res) {
        // toastfun(res.success, 'success');
        navigate("/loginotp", {
          state: { loginDetails: data, type: "register" },
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        // toastfun(ex.response.data, "error");

        await this.setState({ buttonDisabled: true, loader: false });
        setTimeout(async () => {
          await this.setState({ phone: "", captcha: "", loader: false });
        }, 2000);
      }
    }
  };

  render() {
    const { data, errors } = this.state;
    const { navigate } = this.props;

    return (
      <div className="login_card_center">
        {" "}
        <div className="container text-center">
          <div className="row box-form">
            <div className="col col-md-6 bg-whitte ">
              {/* <div>
                <img
                  loading="lazy"
                  src={process.env.PUBLIC_URL + "/assets/images/newlogo.png"}
                  alt=""
                  className="logo mt-3"
                />
              </div> */}
              <div className="login-box mt-2">
                <h3 className="title" style={{ fontWeight: "500" }}>
                  Individual Account
                </h3>

                <form onSubmit={this.handleSubmit}>
                  <div className="mt-3   login__form">
                    <div className="input-group  mb-3">
                      <span className="input-group-text ">
                        <i
                          className="fa fa-user reg_input_icon "
                          aria-hidden="true"
                        ></i>
                      </span>

                      <input
                        value={data.member_name}
                        onChange={this.handleChange}
                        name="member_name"
                        placeholder="Full Name"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <small className="login_error">{errors?.member_name}</small>

                    <div className="input-group mb-3">
                      <span className="input-group-text _63">+63</span>
                      <input
                        maxLength={10}
                        onChange={this.handleChange}
                        value={data.phone}
                        name="phone"
                        type="text"
                        className="form-control"
                        placeholder="Mobile Number"
                      />
                    </div>
                    <small className="login_error">{errors?.phone}</small>

                    <div className="mb-3">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <i className="fa fa-lock reg_input_icon"></i>
                        </span>
                        <input
                          maxLength={15}
                          type={this.state.pwd ? "text" : "password"}
                          value={data.password}
                          onChange={this.handlePassword}
                          name="password"
                          className="form-control"
                          placeholder="Password"
                        />
                        <span className="input-group-text">
                          {" "}
                          <i
                            className={
                              this.state.pwd
                                ? "fa fa-eye eye_reg "
                                : "fa fa-eye-slash eye_reg "
                            }
                            onClick={() =>
                              this.setState({ pwd: !this.state.pwd })
                            }
                          ></i>
                        </span>
                      </div>
                      <small className="login_error">{errors?.password}</small>
                    </div>

                    <div className="mb-3">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <i className="fa fa-lock reg_input_icon"></i>
                        </span>
                        <input
                          maxLength={15}
                          type={this.state.cpwd ? "text" : "password"}
                          value={data.cpassword}
                          onChange={this.handleChange}
                          name="cpassword"
                          className="form-control"
                          placeholder="Confirm Password"
                        />
                        <span className="input-group-text">
                          {" "}
                          <i
                            className={
                              this.state.cpwd
                                ? "fa fa-eye eye_reg "
                                : "fa fa-eye-slash eye_reg "
                            }
                            onClick={() =>
                              this.setState({ cpwd: !this.state.cpwd })
                            }
                          ></i>
                        </span>
                      </div>
                      <small className="login_error">{errors?.cpassword}</small>
                    </div>
                    <div className="mb-3">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <i
                            className="fa fa-user reg_input_icon"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <input
                          type="text"
                          value={data.intro_id}
                          onChange={this.handleChange}
                          name="intro_id"
                          placeholder="Enter Referral Userid /Mobile Number"
                          className="form-control"
                        />
                      </div>
                      <small className="login_error">{errors?.intro_id}</small>
                    </div>

                    <div className="">
                      <div className="input-group mb-3">
                        <center>
                          <ReCAPTCHA
                            className="g-recaptcha"
                            ref={recaptchaRef}
                            sitekey={capt}
                            onChange={this.handleCaptcha}
                          />
                        </center>
                      </div>
                      <small className="login_error">{errors?.captcha}</small>
                    </div>
                    <div className="text-center mt-2 mb-2 font-weight-light terms_text ">
                      <input
                        type="checkbox"
                        checked={this.state.checkTerms}
                        onChange={() => {
                          this.setState({ checkTerms: !this.state.checkTerms });
                        }}
                      />{" "}
                      I have read and accept the &nbsp;
                      <span
                        className="color_blue cursor_pointer"
                        onClick={() => this.props.handleTermsPopup("terms")}
                      >
                        Terms and Conditions
                      </span>{" "}
                      &
                      <span
                        className="color_blue cursor_pointer"
                        onClick={() => this.props.handleTermsPopup("privacy")}
                      >
                        {" "}
                        Data Privacy{" "}
                      </span>
                    </div>

                    <div className="col-11 col-lg-12">
                      {!this.state.loader ? (
                        <>
                          <button
                            disabled={this.validation()}
                            className="btn text-white btn-primary btn-backgroud"
                            type="submit"
                            onClick={this.handleSubmit}
                          >
                            Join
                          </button>
                        </>
                      ) : (
                        <>
                          {" "}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <RotatingLines
                              className="text-center offset-md-5 py-5"
                              strokeColor="#3a9ad4"
                              strokeWidth="5"
                              animationDuration="0.75"
                              width="50"
                              visible={true}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className="text-center font-weight-light"
                      style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    >
                      Already have an account? &nbsp;
                      <span
                        style={{
                          textDecoration: "underline",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                        onClick={() => navigate("/login")}
                        className="text-primary cursor_pointer ml-3 text-cprimary"
                      >
                        Login
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col col-md-6 d-none d-md-block m-auto">
              {" "}
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/backgrounds/caros.gif"
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (pushRoute(IndividualRegisterForm));
