import React from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';
import validator from 'validator';

import './LoginPage.css';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      login_data: [],

      email: "",
      password: "",
      error: "", 

      check_box_show_password: false,

      tag_hidden_text_email: true, 
      tag_hidden_text_password: true, 

      tag_login_error_popup: false, 
      tag_send_login_details: true,
      tag_login_button_loader: false,
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onBlurEmail = this.onBlurEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeCheckBoxShowpassword = this.onChangeCheckBoxShowpassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value, 
      tag_hidden_text_email: true, 
    })
  }

  onBlurEmail(e) {
    let temp_tag_hidden_text_email = validator.isEmail(this.state.email)
    if(this.state.email === "")
      temp_tag_hidden_text_email = !validator.isEmail(this.state.email)

    this.setState({
      tag_hidden_text_email: temp_tag_hidden_text_email, 
    })
    document.getElementById("login_hidden_text_email_id").innerHTML = "This email is not valid."
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value, 
      tag_hidden_text_password: true, 
    })
  }

  onChangeCheckBoxShowpassword() {
    var temp_check_box_show_password = this.state.check_box_show_password
    temp_check_box_show_password = !this.state.check_box_show_password

    this.setState({
      check_box_show_password: temp_check_box_show_password, 
    })
  }

  async sendLoginDetails(str) {
    if(this.state.tag_send_login_details === true) {
      console.log(this.state.tag_send_login_details)
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            this.setState({
              login_data: res.data.data, 
              tag_send_login_details: false, 
              tag_login_button_loader: false, 
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
              tag_login_error_popup: true, 
              tag_send_login_details: true, 
              tag_login_button_loader: false, 
            })
          } else {
            this.setState({
              tag_login_error_popup: false, 
              tag_send_login_details: true, 
              tag_login_button_loader: false, 
            })
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        this.setState({
          tag_send_login_details: true, 
          tag_login_button_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
  }

  onClickLogin() {
    if(this.state.email === "" || this.state.password === "") {
      if(this.state.email === "") {
        // alert("Please Enter Email id.")
        this.setState({tag_hidden_text_email: false, })
        document.getElementById("login_hidden_text_email_id").innerHTML = "Email field is required."
      }
      
      if(this.state.password === "") {
        // alert("Please Enter Password.")
        this.setState({tag_hidden_text_password: false, })
        document.getElementById("login_hidden_text_password_id").innerHTML = "Password field is required."
      }
    } else {
      let check1 = true

      if(validator.isEmail(this.state.email) === false) {
        this.setState({tag_hidden_text_email: false, })
        document.getElementById("login_hidden_text_email_id").innerHTML = "This email is not valid."
        check1 = false
      }

      if(check1 === true) {
        this.setState({
          tag_hidden_text_email: true, 
          tag_hidden_text_password: true, 
          tag_login_button_loader: true, 
          tag_send_login_details: true, 
        })
        
        let str = '/login?email=' + this.state.email + '&password=' + this.state.password
        
        console.log(str)
        this.sendLoginDetails(str)
      }
    }
  }

  createLoginPageErrorPopup() {
    return(
      <Row className="login_error_popup justify-content-center p-0 m-0" hidden={!this.state.tag_login_error_popup}>
        <div className="login_text_css register_error_popup_container border" >
          <Row className="login_error_popup_row">
            <div></div>
            <Card className="login_card justify-content-center" style={{border: 'none'}}>
              <Card.Title className="login_error_title">Error</Card.Title>
            </Card>
            <div className="login_error_popup_cancel_icon_component" onClick={(e) => {this.setState({tag_login_error_popup: false, })}}>
              <svg className="login_error_popup_cancel_icon" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
              </svg>
            </div>
          </Row>
          <Row style={{width: '100%'}}><hr className="login_horizontal_divider" style={{width: '100%'}}></hr></Row>
          <Row>
            <Form.Label className="login_form_label_error">
              {this.state.error}
            </Form.Label>
          </Row>
        </div>
      </Row>
    )
  }

  createLoginPage() {
    return(
      <Row className="login_container justify-content-center p-0 m-0">
        <Form className="login_text_css login_form form border px-4 py-3" >
          <Card className="login_card justify-content-center" style={{border: 'none'}}>
            <Card.Title className="login_title">Login</Card.Title>
          </Card>
          <Form.Group>
            <hr className="login_horizontal_divider"></hr>

            <Row className="login_text_css justify-content-center my-2">
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="login_form_label_input">Email</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type="email"
                  className="login_form_control form-control form-control-rounded"
                  placeholder="Enter your Email ID here"
                  onChange={this.onChangeEmail}
                  onBlur={this.onBlurEmail}
                  value={this.state.email}
                />
              </Col>
              <Col className="login_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="login_hidden_text_email_id" hidden={this.state.tag_hidden_text_email}></div>
              </Col>
            </Row>

            <Row className="login_text_css justify-content-center my-2" >
              <Col className="justify-content-left" xl={12} style={{textAlign: "start"}}>
                <Form.Label className="login_form_label_input">Password</Form.Label>
              </Col>
              <Col className="justify-content-center">
                <input
                  type={`${this.state.check_box_show_password === true ? "text" : "password"}`}
                  className="login_form_control form-control form-control-rounded"
                  placeholder="Enter your Password here"
                  onChange={this.onChangePassword}
                  value={this.state.password}
                />
              </Col>
              <Col className="login_empty_invalid_text justify-content-left" xl={12} style={{textAlign: "start"}}>
                <div id="login_hidden_text_password_id" hidden={this.state.tag_hidden_text_password}></div>
              </Col>
            </Row>

            <Row className="justify-content-left" >
              <Form.Check 
                className="login_text_css ml-3"
                type="checkbox" 
                label="show password"
                checked={this.state.check_box_show_password}
                onChange={() => this.onChangeCheckBoxShowpassword()}
              />
            </Row>

            <Row className="justify-content-center mt-4" >
              <Col>
                <div 
                  className="login_button rounded" 
                  style={{margin: "auto"}} 
                  // variant="outline-success"
                  onClick={(e) => this.onClickLogin(e)}
                >
                  <Form.Label className="login_button_label">Login</Form.Label>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-end mt-1" >
              {/* <Col className="justify-content-end" xl={12}> */}
                <a 
                  className="login_create_account_link " 
                  // style={{margin: "auto"}} 
                  // variant="outline-danger"
                  href="/register"
                  onClick={(e) => {window.location.href="/register"}}
                >
                  <Form.Label className="login_button_label">Create Account</Form.Label>
                </a>
              {/* </Col> */}
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
        <div className="login_main_div p-0 m-0">
          <div className="spinner_loader" hidden={!this.state.tag_login_button_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_login_button_loader}/>
          </div>
          {this.createLoginPage()}
          {this.createLoginPageErrorPopup()}
        </div>
      );
    }
  }
}