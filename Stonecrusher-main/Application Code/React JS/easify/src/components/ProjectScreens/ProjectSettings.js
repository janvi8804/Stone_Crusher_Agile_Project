import React from "react";
import { Row, Col, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import project_placeholder from "../../assets/project_management_image_7.png";
import person_placeholder from "../../assets/person_placeholder.png";

import './ProjectSettings.css';

// import { 
//   Edit, 
// } from "@material-ui/icons";
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})
const animatedComponents = makeAnimated();


export default class ProjectSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      project_data: this.props.project_data, 

      selected_option: null, 

      project_photo: "image_url", 
      error: "", 

      sidebar_active_item: 2, 
      tag_project_settings_loader: false, 
    };

    this.onChangeSharedEasifyUserRole = this.onChangeSharedEasifyUserRole.bind(this);
    this.onChangeSelectedOption = this.onChangeSelectedOption.bind(this);
    this.onClickPlusIconToAddInShareList = this.onClickPlusIconToAddInShareList.bind(this);
    this.onClickSaveProjectSettings = this.onClickSaveProjectSettings.bind(this);
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

  onChangeSelectedOption(e) {
    console.log(e)
    if(e)
      this.setState({selected_option: e})
    else
      this.setState({selected_option: null})
  }

  onChangeSharedEasifyUserRole(e, easify_user_data) {
    this.setState({
      role: e.target.value, 
    })
    console.log(easify_user_data);

    let temp_array = this.props.shared_project_easify_users_data;
    for(let i=0 ; i<temp_array.length ; i++) {
      if(temp_array[i].user_id === easify_user_data.user_id) {
        temp_array[i].user_role = e.target.value;
        break;
      }
    }

    this.props.handleSharedProjectEasifyUsersData(temp_array);
  }

  onClickPlusIconToAddInShareList() {
    if(this.state.selected_option) {
      let check = true;
      for(let i=0 ; i<this.props.shared_project_easify_users_data.length ; i++) {
        if(this.props.shared_project_easify_users_data[i].user_id === this.state.selected_option.data.id) {
          check = false;
          break;
        }
      }

      if(check) {
        let selected_value = {
          user_email: this.state.selected_option.data.email, 
          user_id: this.state.selected_option.data.id, 
          user_image_url: this.state.selected_option.data.image_url, 
          user_name: this.state.selected_option.data.name, 
          user_role: "Developer", 
        };
        let temp_array = this.props.shared_project_easify_users_data;
        temp_array.push(selected_value);
        this.props.handleSharedProjectEasifyUsersData(temp_array);
      }
    }
  }

  onClickSaveProjectSettings() {
    this.setState({tag_project_settings_loader: true, });

    let array_easify_user_id = [];
    let array_role = [];

    for(let i=0 ; i<this.props.shared_project_easify_users_data.length ; i++) {
      array_easify_user_id.push(parseInt(this.props.shared_project_easify_users_data[i].user_id));
      array_role.push( '"' + String(this.props.shared_project_easify_users_data[i].user_role) + '"');
    }

    let str = '/Project/shareProject?project_id=' + this.props.project_data.project_id + 
    '&easify_user_id=[' + array_easify_user_id + ']&role=[' + array_role + 
    ']&owner_id=' + this.props.project_data.project_owner_id;

    // console.log(str);
    this.sendSharedProjectDetails(str);
  }

  async sendSharedProjectDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res)
            this.setState({
              selected_option: null, 
              sidebar_active_item: 2, 
            });
            this.props.handleChangeTagProjectSettingsPopup(false);
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        this.setState({
          tag_project_settings_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  selectProjectSettingsSidebar(active, check_access) {
    switch(active) {
      case 1: return(
        <div></div>
        // <div className="project_settings_profile_component">
        //   <Row className="px-4 my-3">
        //     <Col className="d-flex p-0 my-2" xl={12} style={{textAlign: "start", alignItems: 'center'}}>
        //       <div className="">Project Profile</div>
        //     </Col>
        //     <Col className="p-0 m-0" xl={9}>
        //       <div className=" d-flex">
        //         <div className="position-relative" style={{height: "7rem", width: "7rem"}}>
        //           <Form.Label 
        //             style={{
        //               position: "absolute",
        //               height: "1.5rem",
        //               width: "1.5rem",
        //               right: "-0.5rem",
        //               bottom: "1.5rem",
        //             }} 
        //             htmlFor="profile-avatar-select" 
        //           >
        //             <Edit 
        //               className="rounded-circle p-1"
        //               style={{
        //                   color: "rgba(255,255,255,100)", 
        //                   backgroundColor: "#84160f", 
        //                   cursor: "pointer", 
        //               }}
        //             />
        //           </Form.Label>
        //           <input 
        //             id="profile-avatar-select" 
        //             type="file" 
        //             accept="image/*" 
        //             style={{display: "none"}} 
        //             onChange={(e) => {
        //               if(e.target.files.length !== 0) {
        //                 this.fileReading(e.target.files[0])
        //               } else {
        //                 this.setState({project_photo: "image_url"})
        //               }
        //             }} 
        //           />
        //           <img 
        //             className="rounded" 
        //             src={this.getImage()} 
        //             alt="alt_project_settings_project_profile_image" 
        //             style={{height: "7rem", width: "15rem", border: "1px solid rgba(221,220,220,100)", objectFit: 'cover'}} 
        //           />
        //         </div>
        //       </div>
        //     </Col>
        //   </Row>
        // </div>
      )

      case 2: return(
        <div className="project_settings_share_component">
          <Row className="p-0 m-0">
            <Select
              className="project_settings_select_search"
              value={this.state.selected_option}
              onChange={this.onChangeSelectedOption}
              options={this.props.email_options}
              isClearable
              isSearchable
              closeMenuOnSelect={false}
              components={animatedComponents}
              isDisabled={!check_access}
            />
            {
              check_access ?
              <div className="project_settings_plus_icon_component" onClick={(e) => this.onClickPlusIconToAddInShareList(e)}>
                <svg className="project_settings_plus_icon" width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.583 22.916h-12.5v-12.5a2.083 2.083 0 0 0-4.166 0v12.5h-12.5a2.083 2.083 0 1 0 0 4.167h12.5v12.5a2.083 2.083 0 0 0 4.166 0v-12.5h12.5a2.083 2.083 0 1 0 0-4.167z" fill="#525252"/>
                </svg>
              </div>
              :
              <div className="project_settings_plus_icon_component" style={{ cursor: 'not-allowed' }}>
                <svg className="project_settings_plus_icon" width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.583 22.916h-12.5v-12.5a2.083 2.083 0 0 0-4.166 0v12.5h-12.5a2.083 2.083 0 1 0 0 4.167h12.5v12.5a2.083 2.083 0 0 0 4.166 0v-12.5h12.5a2.083 2.083 0 1 0 0-4.167z" fill="#525252"/>
                </svg>
              </div>
            }
            
          </Row>

          <div className="project_settings_shared_selected_emails_component p-0 my-3">
            {this.props.shared_project_easify_users_data.map( (shared_value, i) => {              
              return(
                <div style={{ display: 'flex', flexDirection: 'column', margin: '7px 0' }} key={i}>
                  <Row className="project_settings_shared_data_row p-0 my-1 mx-0 d-flex">
                    <div className="project_settings_shared_user_image">
                      <img 
                        src={shared_value.user_image_url === "image_url" ? person_placeholder : 
                        "data:image/png;base64," + shared_value.user_image_url} 
                        alt={`alt_project_settings_shared_user_${i}`} 
                        style={{ width: 'inherit', height: 'inherit', borderRadius: '50%' }}
                      />
                    </div>
                    <div className="project_settings_shared_user_name">{shared_value.user_name}</div>
                    <div className="project_settings_shared_user_email">{shared_value.user_email}</div>
                    <div className="project_settings_shared_user_role">
                    {
                      check_access ?
                        <select className="project_settings_role_input" defaultValue={shared_value.user_role} name="role" onChange={(e) => this.onChangeSharedEasifyUserRole(e, shared_value)}>
                          <option value="Project Member">Project Member</option>
                          <option value="Product Owner">Product Owner</option>
                          <option value="Scrum Master">Scrum Master</option>
                          <option value="Developer">Developer</option>
                        </select>
                      : 
                      <div>{shared_value.user_role}</div>
                    }
                    </div>
                    {
                      check_access ?
                      <div className="project_settings_shared_user_cancel_icon_component">
                        <svg className="project_settings_popup_cancel_icon" width="18" height="18" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
                        </svg>
                      </div>
                      : 
                      <div className="project_settings_shared_user_cancel_icon_component" style={{ cursor: 'not-allowed' }}>
                        <svg className="project_settings_popup_cancel_icon" width="18" height="18" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
                        </svg>
                      </div>
                    }
                    
                  </Row>
                  <hr style={{  margin: '0', border: '#d9d9d9 1px solid' }} />
                </div>
              )
            })}
          </div>
        </div>
      )

      default: return(<div></div>)
    }
  }

  createProjectSettingsScreen() {
    var check_access = (parseInt(this.props.project_data.project_owner_id) === parseInt(cookie.load('user')[0].id)) || 
      (this.props.project_data.project_my_role === 'Project Member');

    return(
      <div className="project_settings_popup m-0">
        <Row className="project_settings_header_component p-0 m-0">
          <Col className="justify-content-start d-flex p-0 m-0">
            <div className="project_settings_popup_settings_icon_component">
              <svg className="project_settings_popup_settings_icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m21.32 9.55-1.89-.63.89-1.78A1 1 0 0 0 20.13 6L18 3.87a1 1 0 0 0-1.15-.19l-1.78.89-.63-1.89A1 1 0 0 0 13.5 2h-3a1 1 0 0 0-.95.68l-.63 1.89-1.78-.89A1 1 0 0 0 6 3.87L3.87 6a1 1 0 0 0-.19 1.15l.89 1.78-1.89.63a1 1 0 0 0-.68.94v3a1 1 0 0 0 .68.95l1.89.63-.89 1.78A1 1 0 0 0 3.87 18L6 20.13a1 1 0 0 0 1.15.19l1.78-.89.63 1.89a1 1 0 0 0 .95.68h3a1 1 0 0 0 .95-.68l.63-1.89 1.78.89a1 1 0 0 0 1.13-.19L20.13 18a1 1 0 0 0 .19-1.15l-.89-1.78 1.89-.63a1 1 0 0 0 .68-.94v-3a1 1 0 0 0-.68-.95zM20 12.78l-1.2.4A2 2 0 0 0 17.64 16l.57 1.14-1.1 1.1-1.11-.6a2 2 0 0 0-2.79 1.16l-.4 1.2h-1.59l-.4-1.2A2 2 0 0 0 8 17.64l-1.14.57-1.1-1.1.6-1.11a2 2 0 0 0-1.16-2.82l-1.2-.4v-1.56l1.2-.4A2 2 0 0 0 6.36 8l-.57-1.11 1.1-1.1L8 6.36a2 2 0 0 0 2.82-1.16l.4-1.2h1.56l.4 1.2A2 2 0 0 0 16 6.36l1.14-.57 1.1 1.1-.6 1.11a2 2 0 0 0 1.16 2.79l1.2.4v1.59zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#525252"/>
              </svg>
            </div>
          </Col>
          <Col className="p-0 m-0"><b>{this.state.project_data.project_title}</b></Col>
          <Col className="justify-content-end d-flex p-0 m-0">
            <div className="project_setting_popup_cancel_icon_component" 
              onClick={(e) => {
                this.setState({
                  selected_option: null, 
                  sidebar_active_item: 2, 
                });
                this.props.handleChangeTagProjectSettingsPopup(false);}}>
              <svg className="project_settings_popup_cancel_icon" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
              </svg>
            </div>
          </Col>
        </Row>

        <hr className="project_settings_popup_horizontal_divider"/>

        <div className="project_settings_body_component p-0 m-0">
          <div className="project_settings_body_sidebar">
            {/* <div 
              className={`project_settings_body_sidebar_row
              ${this.state.sidebar_active_item === 1 ? "project_settings_body_sidebar_active" : ""}`} 
              onClick={(e) => {this.setState({sidebar_active_item: 1})}}>
              Profile
            </div> */}
            <div 
              className={`project_settings_body_sidebar_row
              ${this.state.sidebar_active_item === 2 ? "project_settings_body_sidebar_active" : ""}`} 
              onClick={(e) => {this.setState({sidebar_active_item: 2})}}>
              Share
            </div>
          </div>

          <div className="project_settings_vertical_divider"></div>

          <div className="project_settings_body_component">
            {this.selectProjectSettingsSidebar(this.state.sidebar_active_item, check_access)}
          </div>
        </div>

        <div className="project_settings_save_button_component">
          {
            check_access ? 
            <button className="project_settings_save_button" onClick={(e) => this.onClickSaveProjectSettings()}>
              Save
            </button> 
            : 
            <button className="project_settings_save_button" style={{ cursor: 'not-allowed' }}>
              Save
            </button>
          }
        </div>
      </div>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div className="project_settings_screen_main_div m-0" hidden={!this.props.tag_project_settings_popup}>
          <div className="spinner_loader" hidden={!this.state.tag_project_settings_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_project_settings_loader}/>
          </div>
          {this.createProjectSettingsScreen()}
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}