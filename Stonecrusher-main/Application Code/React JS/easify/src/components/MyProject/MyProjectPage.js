import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';

import project_placeholder from "../../assets/project_management_image_7.png";

import './MyProjectPage.css';

import { 
  Edit, 
} from "@material-ui/icons";
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class MyProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      my_project_data: [],

      project_name: "",
      role: "Project Member",
      project_photo: "image_url", 
      error: "", 

      tag_hidden_text_project_name: true, 

      tag_my_project_page_error_popup: false, 
      tag_my_project_page_create_project_popup: false, 
      tag_fetch_project_details: true,
      tag_send_project_details: true, 
      tag_my_project_page_loader: false,
    };

    this.onChangeProjectName = this.onChangeProjectName.bind(this);
    this.onBlurProjectName = this.onBlurProjectName.bind(this);
    this.onChangeMyRole = this.onChangeMyRole.bind(this);
    this.onClickCreateProject = this.onClickCreateProject.bind(this);
    this.onClickProjectComponent = this.onClickProjectComponent.bind(this);
  }

  componentDidMount() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      this.setState({tag_my_project_page_loader: true, })
      let str = '/Project/fetchProjectByEasifyUser?easify_user_id=' + cookie.load("user")[0].id;
      this.fetchProjectDetails(str);
    } else {
      window.location.href = "/login";
    }
  }

  getImage() {
    if (this.state.project_photo !== "image_url") {
      return "data:image/png;base64," + this.state.project_photo;
    }
    // if(this.state.image_url.length !== 0){
    //   if (this.state.image_url[0] !== "image_url") {
    //     // console.log("image_url")
    //     // return `http://localhost:8000/${this.state.avatar}`;
    //     return "data:image/png;base64," + this.state.image_url[0]
    //   }
    // }
    
    return project_placeholder;
  }

  fileReading(acceptedFiles) {
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString

    reader.onabort = () => console.log("abort")
    reader.onerror = () => console.log("error")
    reader.onload = e => {
      const bstr = e.target.result

      this.setState({project_photo: btoa(bstr), })
    }
    if(rABS) reader.readAsBinaryString(acceptedFiles)
    else reader.readAsArrayBuffer(acceptedFiles)
  }

  onChangeProjectName(e) {
    this.setState({
      project_name: e.target.value, 
      tag_hidden_text_project_name: true, 
    })
  }

  onBlurProjectName(e) {
    let check = false;
    for(let i=0 ; i<this.state.my_project_data.length ; i++) {
      if(this.state.project_name === this.state.my_project_data[i].project_title)
        check = true;
    }

    if(check) {
      this.setState({
        tag_hidden_text_project_name: false, 
      })
      document.getElementById("my_project_page_hidden_text_project_name").innerHTML = "This name already exists."
    } else {
      this.setState({
        tag_hidden_text_project_name: true, 
      })
    }
  }

  onChangeMyRole(e) {
    this.setState({
      role: e.target.value, 
    })
    console.log(e.target.value);
  }

  async sendNewProjectDetails(str, formData) {
    console.log(this.state.tag_send_project_details)
    if(this.state.tag_send_project_details === true) {
      await api.post(str, formData)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data)
            this.setState({
              my_project_data: res.data.data.reverse(), 
              tag_my_project_page_loader: false, 
              project_name: "",
              role: "Project Member",
              project_photo: "image_url", 
              tag_hidden_text_project_name: true, 
              tag_my_project_page_create_project_popup: false, 
            })
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
              tag_my_project_page_error_popup: true, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        this.setState({
          tag_send_project_details: true, 
          tag_my_project_page_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
  }

  async fetchProjectDetails(str) {
    if(this.state.tag_fetch_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            this.setState({my_project_data: res.data.data.reverse(), })
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
              tag_my_project_page_error_popup: true, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        this.setState({ 
          tag_fetch_project_details: true, 
          tag_my_project_page_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
  }

  onClickCancelCreateProjectPopup(e) {
    this.setState({
      project_name: "",
      role: "Project Member",
      project_photo: "image_url", 
      tag_hidden_text_project_name: true, 
      tag_my_project_page_create_project_popup: false, 
    })
  }

  onClickCreateProject(e) {
    if(this.state.project_name === "") {
      this.setState({tag_hidden_text_project_name: false, })
      document.getElementById("my_project_page_hidden_text_project_name").innerHTML = "Name field is required."
    } else {
      let check = false;
      for(let i=0 ; i<this.state.my_project_data.length ; i++) {
        if(parseInt(this.state.my_project_data[i].project_owner_id) === parseInt(cookie.load("user")[0].id))
          if(this.state.project_name === this.state.my_project_data[i].project_title)
            check = true;
      }

      if(check) {
        this.setState({
          tag_hidden_text_project_name: false, 
        })
        document.getElementById("my_project_page_hidden_text_project_name").innerHTML = "This name already exists."
      } else {
        this.setState({
          tag_hidden_text_project_name: true, 
          tag_send_project_details: true, 
          tag_my_project_page_loader: true, 
        })

        let formData = new FormData();
        formData.append("owner_id", cookie.load('user')[0]["id"]);
        formData.append("title", this.state.project_name);
        formData.append("role", this.state.role);
        formData.append("image_url", this.state.project_photo);

        let str = '/Project/addProject'
        this.sendNewProjectDetails(str, formData);
      }
    }
  }

  onClickProjectComponent(e, project_value) {
    if(this.props.ActiveItem === 2) {
      this.props.handleChangeActiveItem(4);
      this.props.handleChangeUrl('/my-project/project:' + project_value.project_id);
      this.props.handleChangeProjectScreen(project_value);
    } else if(this.props.ActiveItem === 3) {
      this.props.handleChangeActiveItem(5);
      this.props.handleChangeUrl('/shared/project:' + project_value.project_id);
      this.props.handleChangeProjectScreen(project_value);
    }
  }

  createCreateProjectPopup() {
    return(
      <div className="my_project_page_create_project_popup" hidden={!this.state.tag_my_project_page_create_project_popup}>
        <div className="my_project_page_create_project_popup_component">
          <Row className="p-0 m-0">
            <Col></Col>
            <Col className="d-flex justify-content-center align-items-center p-0 m-0"><b>Create Project</b></Col>
            <Col className="justify-content-end d-flex p-0 m-0" onClick={(e) => this.onClickCancelCreateProjectPopup(e)}>
              <div className="my_project_page_popup_cancel_icon_component">
                <svg className="my_project_page_popup_cancel_icon" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
                </svg>
              </div>
            </Col>
          </Row>

          <hr className="my_project_page_create_project_popup_horizontal_divider"/>

          <Row className="px-4 my-3">
            <Col className="p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div className="my_project_page_label" >Project Name</div>
            </Col>
            <Col className="p-0 m-0">
                <input 
                  className="my_project_page_input" 
                  placeholder="Enter project name" 
                  onChange={this.onChangeProjectName}
                  onBlur={this.onBlurProjectName}
                  value={this.state.project_name}
                />
            </Col>
            <Col className="my_project_page_invalid_text p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div id="my_project_page_hidden_text_project_name" hidden={this.state.tag_hidden_text_project_name}></div>
            </Col>
          </Row>

          <Row className="px-4 my-3">
            <Col className="p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div className="my_project_page_label">My Role</div>
            </Col>
            <Col className="p-0 m-0">
              <select className="my_project_page_input" name="role" onChange={this.onChangeMyRole}>
                <option value="Project Member">Project Member</option>
                <option value="Product Owner">Product Owner</option>
                <option value="Scrum Master">Scrum Master</option>
                <option value="Developer">Developer</option>
              </select>
            </Col>           
          </Row>

          <Row className="px-4 my-3">
            <Col className="p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div className="my_project_page_label">Project Profile</div>
            </Col>
            <Col className="p-0 m-0">
              <div className="justify-content-center d-flex">
              <div className="position-relative" style={{height: "7rem", width: "7rem"}}>
                  <Form.Label 
                    style={{
                      position: "absolute",
                      height: "1.5rem",
                      width: "1.5rem",
                      right: "-0.5rem",
                      bottom: "1.5rem",
                    }} 
                    htmlFor="profile-avatar-select" 
                  >
                    <Edit 
                      className="rounded-circle p-1"
                      style={{
                          color: "rgba(255,255,255,100)", 
                          backgroundColor: "#84160f", 
                          cursor: "pointer", 
                      }}
                    />
                    {/* <svg fill="#84160f" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="25px" height="25px">
                      <path d="M24 11l2.414-2.414c.781-.781.781-2.047 0-2.828l-2.172-2.172c-.781-.781-2.047-.781-2.828 0L19 6 24 11zM17 8L5.26 19.74C7.886 19.427 6.03 21.933 7 23c.854.939 3.529-.732 3.26 1.74L22 13 17 8zM4.328 26.944l-.015-.007c-.605.214-1.527-.265-1.25-1.25l-.007-.015L4 23l3 3L4.328 26.944z"/>
                    </svg> */}
                  </Form.Label>
                  <input 
                    id="profile-avatar-select" 
                    type="file" 
                    accept="image/*" 
                    style={{display: "none"}} 
                    onChange={(e) => {
                      if(e.target.files.length !== 0) {
                        this.fileReading(e.target.files[0])
                      } else {
                        this.setState({project_photo: "image_url"})
                      }
                    }} 
                  />
                  <img 
                    className="rounded-circle" 
                    src={this.getImage()} 
                    alt="alt_my_project_page_new_project_profile_image" 
                    style={{height: "7rem", width: "7rem", border: "1px solid rgba(221,220,220,100)"}} 
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className="justify-content-center d-flex my-3">
            <div className="my_project_page_create_project_button" onClick={(e) => this.onClickCreateProject(e)}>
              Create
            </div>
          </div>
        </div>
      </div>
    )
  }

  createMyProjectPage() {
    return(
      <div className=" justify-content-center p-0 m-0">
        <Row className="p-3 m-0">
          {this.props.ActiveItem === 2 ? 
          <Col className="my_project_page_component_col justify-content-center d-flex p-0 mx-2" xl={2}>
            <div className="my_project_page_create_project_component" onClick={(e) => this.setState({tag_my_project_page_create_project_popup: true, })}>
              <div className="my_project_page_box_project_title"><b>Create Project</b></div>
              <div className="my_project_page_box_image_component">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.583 22.916h-12.5v-12.5a2.083 2.083 0 0 0-4.166 0v12.5h-12.5a2.083 2.083 0 1 0 0 4.167h12.5v12.5a2.083 2.083 0 0 0 4.166 0v-12.5h12.5a2.083 2.083 0 1 0 0-4.167z" fill="#BA0000"/>
                </svg>
              </div>
              <div></div>
            </div>
          </Col>
          : 
          <div></div>}
          
          {this.state.my_project_data.map( (project_value, i) => {
            let check = true;
            if(this.props.ActiveItem === 2)
              check = parseInt(project_value.project_owner_id) === parseInt(cookie.load("user")[0].id);
            else if(this.props.ActiveItem === 3)
              check = parseInt(project_value.project_owner_id) !== parseInt(cookie.load("user")[0].id);
            
            if(check) {
              return(
                <Col className="my_project_page_component_col justify-content-center d-flex p-0 mx-2" xl={2} key={i}>
                  <div className="my_project_page_project_component" onClick={(e) => this.onClickProjectComponent(e, project_value)}>
                    {/* <div className="my_project_page_project_cancel_icon_component">
                      <svg className="my_project_page_project_cancel_icon" width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#fdfcfc"/>
                      </svg>
                    </div> */}
                    <div className="my_project_page_box_project_title"><b>{project_value.project_title}</b></div>
                    <div className="my_project_page_box_image_component">
                      <img src={
                        project_value.project_image_url === "image_url" ? project_placeholder : 
                        "data:image/png;base64," + project_value.project_image_url
                      } 
                      alt="project"
                      style={{ height: 'inherit', width: 'inherit', borderRadius: '50%'}} 
                      />
                    </div>
                    <div className="my_project_page_box_project_my_role"><b>{project_value.project_my_role}</b></div>
                  </div>
                </Col>
              );
            } else {
              return("")
            }
          })}
        </Row>
      </div>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div className="my_project_page_main_div m-0">
          <div className="spinner_loader" hidden={!this.state.tag_my_project_page_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_my_project_page_loader}/>
          </div>
          {this.createMyProjectPage()}
          {this.createCreateProjectPopup()}
          {/* {this.createMyProjectPageErrorPopup()} */}
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}