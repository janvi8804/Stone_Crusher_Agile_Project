import React from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import { Puff as Loader } from 'react-loader-spinner';
import PasswordChecklist from "react-password-checklist"
import { Popover, ArrowContainer } from 'react-tiny-popover'
import validator from 'validator';

import './RegisterPage.css';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      register_data: [],

      name: "", 
      email: "",
      password: "",
      confirm_password: "",
      error: "", 

      check_box_show_password: false,
      tag_popover_open_email: false, 
      tag_popover_open_password: false,
      tag_password_validator: false, 
      
      tag_hidden_text_name: true, 
      tag_hidden_text_email: true, 
      tag_hidden_text_password: true, 
      tag_hidden_text_confirm_password: true, 

      tag_register_error_popup: false, 
      tag_send_register_details: true,
      tag_register_button_loader: false,
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onBlurEmail = this.onBlurEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onFocusPassword = this.onFocusPassword.bind(this);
    this.onBlurPassword = this.onBlurPassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeCheckBoxShowpassword = this.onChangeCheckBoxShowpassword.bind(this);
    this.onClickRegister = this.onClickRegister.bind(this);
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value, 
      tag_hidden_text_name: true,
    })
  }
  
  onChangeEmail(e) {
    this.setState({
      email: e.target.value, 
      tag_hidden_text_email: true, 
    })
  }

  onBlurEmail(e) {
    let temp_tag_popover_open_email = validator.isEmail(this.state.email)
    if(this.state.email === "")
      temp_tag_popover_open_email = !validator.isEmail(this.state.email)

    this.setState({
      tag_popover_open_email: !temp_tag_popover_open_email, 
      tag_hidden_text_email: temp_tag_popover_open_email, 
    })
    document.getElementById("register_hidden_text_email_id").innerHTML = "This email is not valid."
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value, 
      tag_hidden_text_password: true, 
    })
  }

  onFocusPassword(e) {
    this.setState({
      tag_popover_open_password: true, 
    })
  }

  onBlurPassword(e) {
    this.setState({
      tag_popover_open_password: false, 
    })
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirm_password: e.target.value, 
      tag_hidden_text_confirm_password: true, 
    })
  }

  onChangeCheckBoxShowpassword() {
    var temp_check_box_show_password = this.state.check_box_show_password
    temp_check_box_show_password = !this.state.check_box_show_password

    this.setState({
      check_box_show_password: temp_check_box_show_password, 
    })
  }

  async sendRegisterDetails(str) {
    if(this.state.tag_send_register_details === true) {
      console.log(this.state.tag_send_register_details)
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            this.setState({
              register_data: res.data.data, 
              tag_send_register_details: false, 
              tag_register_button_loader: false, 
            })

            let allcookie = cookie.loadAll();
            console.log(allcookie);
            Object.entries(allcookie).map(([key,value])=>(
              cookie.remove(key)
            ))

            allcookie = cookie.loadAll();
            console.log(allcookie);
            console.log(res.data.data)

            var user_data = [res.data.data[0], this.state.password]
            cookie.save("is_login", 1);
            cookie.save("user", user_data);
            allcookie = cookie.loadAll();
            console.log(allcookie);
            window.location.href = "/";
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
              tag_register_error_popup: true, 
              tag_send_register_details: true, 
              tag_register_button_loader: false, 
            })
            console.log(res.data.print_error)
          } else {
            this.setState({
              tag_register_error_popup: false, 
              tag_send_register_details: true, 
              tag_register_button_loader: false, 
            })
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        this.setState({
          tag_send_register_details: true, 
          tag_register_button_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
  }

  onClickRegister() {
    if(this.state.name === "" || this.state.email === "" || this.state.password === "" || this.state.confirm_password === "") {
      if(this.state.name === "") {
        // alert("Please Enter Email id.")
        this.setState({tag_hidden_text_name: false, })
        document.getElementById("register_hidden_text_name_id").innerHTML = "Name field is required."
      }
      
      if(this.state.email === "") {
        // alert("Please Enter Email id.")
        this.setState({tag_hidden_text_email: false, })
        document.getElementById("register_hidden_text_email_id").innerHTML = "Email field is required."
      }
      
      if(this.state.password === "") {
        // alert("Please Enter Password.")
        this.setState({tag_hidden_text_password: false, })
        document.getElementById("register_hidden_text_password_id").innerHTML = "Password field is required."
      }
      
      if(this.state.confirm_password === "") {
        // alert("Please Enter Confirm Password.")
        this.setState({tag_hidden_text_confirm_password: false, })
        document.getElementById("register_hidden_text_confirm_password_id").innerHTML = "Confirm Password field is required."
      }
    } else {
      let check1 = true, check2 = true, check3 = true

      if(validator.isEmail(this.state.email) === false) {
        this.setState({tag_hidden_text_email: false, })
        document.getElementById("register_hidden_text_email_id").innerHTML = "This email is not valid."
        check1 = false
      }

      if(this.state.tag_password_validator === false) {
        this.setState({tag_hidden_text_password: false, })
        document.getElementById("register_hidden_text_password_id").innerHTML = "Password validation is required."
        check2 = false
      }
      
      if(this.state.password !== this.state.confirm_password) {
        this.setState({tag_hidden_text_confirm_password: false, })
        document.getElementById("register_hidden_text_confirm_password_id").innerHTML = "Confirm Password has to match with Password."
        check3 = false
      }
      
      if(check1 === true && check2 === true && check3 === true) {
        this.setState({
          tag_register_button_loader: true, 
          tag_send_register_details: true, 
          tag_hidden_text_name: true, 
          tag_hidden_text_email: true, 
          tag_hidden_text_password: true, 
          tag_hidden_text_confirm_password: true,  
        })
        
        let str = '/register?name=' + this.state.name + '&email=' + this.state.email + 
        '&password=' + this.state.password
        
        console.log(str)
        this.sendRegisterDetails(str)
      }
    }
  }

  createRegisterPageErrorPopup() {
    return(
      <Row className="register_error_popup justify-content-center p-0 m-0" hidden={!this.state.tag_register_error_popup}>
        <div className="register_text_css register_error_popup_container border" >
          <Row className="register_error_popup_row">
            <div></div>
            <Card className="register_card justify-content-center" style={{border: 'none'}}>
              <Card.Title className="register_error_title">Error</Card.Title>
            </Card>
            <div className="rigster_error_popup_cancel_icon_component" onClick={(e) => {this.setState({tag_register_error_popup: false, })}}>
              <svg className="rigster_error_popup_cancel_icon" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
              </svg>
            </div>
          </Row>
          <Row style={{width: '90%'}}><hr className="register_horizontal_divider" style={{width: '100%'}}></hr></Row>
          <Row>
            <Form.Label className="register_form_label_error">
              {this.state.error}
            </Form.Label>
          </Row>
        </div>
      </Row>
    )
  }

  createRegisterPage() {
    return(
      <Row className="register_container justify-content-center p-0 m-0">
        <Form className="register_text_css register_form form border px-4 py-3" >
          <Card className="register_card justify-content-center" style={{border: 'none'}}>
            <Card.Title className="register_title">Register</Card.Title>
          </Card>
          <Form.Group>
            <hr className="register_horizontal_divider"></hr>

            <Row className="register_text_css justify-content-center my-2">
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="register_form_label_input">Name</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type="email"
                  autoComplete="off"
                  className="register_form_control form-control form-control-rounded"
                  placeholder="Enter your Name here"
                  onChange={this.onChangeName}
                  // onBlur={this.onBlurName}
                  value={this.state.name}
                  required
                />
              </Col>
              <Col className="register_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="register_hidden_text_name_id" hidden={this.state.tag_hidden_text_name}></div>
              </Col>
            </Row>

            <Row className="register_text_css justify-content-center my-2">
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="register_form_label_input">Email</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type="email"
                  autoComplete="off"
                  className="register_form_control form-control form-control-rounded"
                  placeholder="Enter your Email ID here"
                  onChange={this.onChangeEmail}
                  onBlur={this.onBlurEmail}
                  value={this.state.email}
                  required
                />
              </Col>
              <Col className="register_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="register_hidden_text_email_id" hidden={this.state.tag_hidden_text_email}></div>
              </Col>
            </Row>

            {/* <Popover
              className="register_popover"
              isOpen={this.state.tag_popover_open_email}
              reposition={false}
              padding={10}
              positions={['right', 'top']} // preferred positions by priority
              content={({ position, childRect, popoverRect }) => (
                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                  position={position}
                  childRect={childRect}
                  popoverRect={popoverRect}
                  arrowColor={'rgba(0, 0, 0, 0.65)'}
                  arrowSize={10}
                  // arrowStyle={{ opacity: 0.7 }}
                  className=' popover-arrow-container'
                  arrowClassName='register_popover_arrow popover-arrow'
                >
                  <div className="register_popover_email">
                    This email is not valid
                  </div>
                </ArrowContainer>
              )}
            >
              <div></div>
            </Popover> */}
            
            <Row className="register_text_css justify-content-center my-2" >
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="register_form_label_input">Password</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type={`${this.state.check_box_show_password === true ? "text" : "password"}`}
                  className="register_form_control form-control form-control-rounded"
                  placeholder="Enter your Password here"
                  onChange={this.onChangePassword}
                  onFocus={this.onFocusPassword}
                  onBlur={this.onBlurPassword}
                  value={this.state.password}
                />
              </Col>
              <Col className="register_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="register_hidden_text_password_id" hidden={this.state.tag_hidden_text_password}></div>
              </Col>
            </Row>

            <Popover
              className="register_popover"
              isOpen={this.state.tag_popover_open_password}
              reposition={false}
              padding={10}
              positions={['right', 'top']} // preferred positions by priority
              content={({ position, childRect, popoverRect }) => (
                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                  position={position}
                  childRect={childRect}
                  popoverRect={popoverRect}
                  arrowColor={'rgba(0, 0, 0, 0.65)'}
                  arrowSize={10}
                  // arrowStyle={{ opacity: 0.7 }}
                  className=' popover-arrow-container'
                  arrowClassName='register_popover_arrow popover-arrow'
                >
                  <div className="register_popover_password">
                    <PasswordChecklist 
                      className="register_password_checklist"
                      rules={["minLength", "specialChar", "number", "capital", "match"]}
                      minLength={7}
                      iconSize={10}
                      value={this.state.password}
                      valueAgain={this.state.confirm_password}
                      onChange={(isValid) => {
                        this.setState({
                          tag_password_validator: isValid, 
                        })}}
                    />
                  </div>
                </ArrowContainer>
              )}
            >
              <div></div>
            </Popover>

            <Row className="register_text_css justify-content-center my-2" >
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="register_form_label_input">Confirm Password</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type={`${this.state.check_box_show_password === true ? "text" : "password"}`}
                  className="register_form_control form-control form-control-rounded"
                  placeholder="Enter your Confirm Password here"
                  onChange={this.onChangeConfirmPassword}
                  onFocus={this.onFocusPassword}
                  onBlur={this.onBlurPassword}
                  value={this.state.confirm_password}
                />
              </Col>
              <Col className="register_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="register_hidden_text_confirm_password_id" hidden={this.state.tag_hidden_text_confirm_password}></div>
              </Col>
            </Row>              

            <Row className="justify-content-left" >
              <Form.Check 
                className="register_text_css ml-3"
                type="checkbox" 
                label="show password"
                checked={this.state.check_box_show_password}
                onChange={() => this.onChangeCheckBoxShowpassword()}
              />
            </Row>

            <Row className="justify-content-center mt-2" >
              <Col>
                <div 
                  className="register_button rounded" 
                  style={{margin: "auto"}} 
                  // variant="outline-success"
                  onClick={(e) => this.onClickRegister(e)}
                >
                  <Form.Label className="register_button_label">Register</Form.Label>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-end mt-1" >
              <a 
                className="register_already_have_an_account_link" 
                // style={{margin: "auto"}} 
                // variant="outline-danger"
                href="/login"
                onClick={(e) => {window.location.href="/login"}}
              >
                <Form.Label className="register_button_label">Already have an Account</Form.Label>
              </a>
            </Row>
          </Form.Group>
        </Form>
      </Row>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      window.location.href = "/my-project";
    } else {
      return(
        <div className="register_main_div p-0 m-0">
          <div className="spinner_loader" hidden={!this.state.tag_register_button_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_register_button_loader}/>
          </div>
          {this.createRegisterPage()}
          {this.createRegisterPageErrorPopup()}
        </div>
      );
    }
  }
}