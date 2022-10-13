import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';

import ProductBacklog from './ProductBacklog';
import Sprint from './Sprint';
import ProjectSettings from './ProjectSettings';

import './ProjectMainScreen.css';
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class ProjectMainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project_data: this.props.project_data, 
      ProjectScreenActiveItem: 1, 
      
      easify_users_data: [],
      shared_project_easify_users_data: [],
      email_options: [], 

      tag_project_settings_popup: false, 
      tag_fetch_easify_users_details: true,
      tag_project_main_screen_loader: false, 
    };

    this.handleChangeProjectScreenActiveItem = this.handleChangeProjectScreenActiveItem.bind(this);
    this.handleChangeTagProjectSettingsPopup = this.handleChangeTagProjectSettingsPopup.bind(this);
    this.handleSharedProjectEasifyUsersData = this.handleSharedProjectEasifyUsersData.bind(this);
  }
  
  handleChangeProjectScreenActiveItem(active) {
    this.setState({ProjectScreenActiveItem: active})
  }

  handleChangeTagProjectSettingsPopup(tag) {
    this.setState({tag_project_settings_popup: tag})
  }

  handleSharedProjectEasifyUsersData(data) {
    this.setState({shared_project_easify_users_data: data});
  }

  async fetchEasifyUsersDetails(str) {
    // if(this.state.tag_fetch_easify_users_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            let options = [];
            for(let i=0 ; i<res.data.data.easify_user_data.length ; i++) {
              options.push({
                value: res.data.data.easify_user_data[i].email, 
                label: res.data.data.easify_user_data[i].email, 
                data: res.data.data.easify_user_data[i]
              });
            }
            this.setState({
              easify_users_data: res.data.data, 
              email_options: options, 
            })
            console.log(res.data.data.easify_user_data)

            let str = '/Project/fetchSharedEasifyUserByProject?project_id=' + this.state.project_data.project_id;
            this.fetchSharedEasifyUsersDetailsByProject(str);
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        // this.setState({ 
        //   tag_project_main_screen_loader: false, 
        // })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async fetchSharedEasifyUsersDetailsByProject(str) {
    // if(this.state.tag_fetch_easify_users_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            this.setState({
              shared_project_easify_users_data: res.data.data, 
            })
            console.log(res.data.data)
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
          tag_project_main_screen_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  handleProjectScreen(active) {
    switch(active) {
      case 1: return <ProductBacklog project_data={this.state.project_data} />

      case 2: return <Sprint project_data={this.state.project_data} />

      default: return <div></div>
    }
  }

  createProjectScreen() {
    return(
      <div>
        <Navbar expand="lg" style={{height: '40px', display: 'flex', borderRadius: '8px', }}>
          <Container style={{borderBottom: '1px solid #eee'}}>
            <Navbar.Brand className="p-0">{this.state.project_data.project_title}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto project_screen_nav">
                <Nav.Link 
                  className={`project_screen_nav_link 
                  ${this.state.ProjectScreenActiveItem === 1 ? "project_screen_nav_link_active" : ""}`} 
                  style={{ color: 'black', }} 
                  onClick={(e) => {this.handleChangeProjectScreenActiveItem(1)}}
                  // href="#home"
                >Product Backlog</Nav.Link>
                <Nav.Link 
                  className={`project_screen_nav_link 
                  ${this.state.ProjectScreenActiveItem === 2 ? "project_screen_nav_link_active" : ""}`} 
                  style={{ color: 'black', }} 
                  onClick={(e) => {this.handleChangeProjectScreenActiveItem(2)}}
                  // href="#link"
                >Sprint</Nav.Link>
                {/* <Nav.Link 
                  className={`project_screen_nav_link 
                  ${this.state.ProjectScreenActiveItem === 3 ? "project_screen_nav_link_active" : ""}`} 
                  style={{ color: 'black', }} 
                  onClick={(e) => {this.handleChangeProjectScreenActiveItem(3)}}
                  // href="#link"
                >Share</Nav.Link>
                <Nav.Link 
                  className={`project_screen_nav_link 
                  ${this.state.ProjectScreenActiveItem === 4 ? "project_screen_nav_link_active" : ""}`} 
                  style={{ color: 'black', }} 
                  onClick={(e) => {this.handleChangeProjectScreenActiveItem(4)}}
                  // href="#link"
                >Chat</Nav.Link> */}
                <div 
                  className="project_main_screen_settings_icon_component"
                  onClick={(e) => {
                    this.fetchEasifyUsersDetails('/EasifyUser/fetchAllUser'); 
                    this.handleChangeTagProjectSettingsPopup(true); 
                    this.setState({tag_project_main_screen_loader: true, }); 
                  }}
                >
                  <svg className="project_main_screen_settings_icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="project_main_screen_settings_icon_path" d="m21.32 9.55-1.89-.63.89-1.78A1 1 0 0 0 20.13 6L18 3.87a1 1 0 0 0-1.15-.19l-1.78.89-.63-1.89A1 1 0 0 0 13.5 2h-3a1 1 0 0 0-.95.68l-.63 1.89-1.78-.89A1 1 0 0 0 6 3.87L3.87 6a1 1 0 0 0-.19 1.15l.89 1.78-1.89.63a1 1 0 0 0-.68.94v3a1 1 0 0 0 .68.95l1.89.63-.89 1.78A1 1 0 0 0 3.87 18L6 20.13a1 1 0 0 0 1.15.19l1.78-.89.63 1.89a1 1 0 0 0 .95.68h3a1 1 0 0 0 .95-.68l.63-1.89 1.78.89a1 1 0 0 0 1.13-.19L20.13 18a1 1 0 0 0 .19-1.15l-.89-1.78 1.89-.63a1 1 0 0 0 .68-.94v-3a1 1 0 0 0-.68-.95zM20 12.78l-1.2.4A2 2 0 0 0 17.64 16l.57 1.14-1.1 1.1-1.11-.6a2 2 0 0 0-2.79 1.16l-.4 1.2h-1.59l-.4-1.2A2 2 0 0 0 8 17.64l-1.14.57-1.1-1.1.6-1.11a2 2 0 0 0-1.16-2.82l-1.2-.4v-1.56l1.2-.4A2 2 0 0 0 6.36 8l-.57-1.11 1.1-1.1L8 6.36a2 2 0 0 0 2.82-1.16l.4-1.2h1.56l.4 1.2A2 2 0 0 0 16 6.36l1.14-.57 1.1 1.1-.6 1.11a2 2 0 0 0 1.16 2.79l1.2.4v1.59zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#525252"/>
                  </svg>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {this.handleProjectScreen(this.state.ProjectScreenActiveItem)}
        <ProjectSettings
          project_data={this.state.project_data}
          shared_project_easify_users_data={this.state.shared_project_easify_users_data}
          email_options={this.state.email_options}
          handleSharedProjectEasifyUsersData={this.handleSharedProjectEasifyUsersData}
          tag_project_settings_popup={this.state.tag_project_settings_popup}
          handleChangeTagProjectSettingsPopup={this.handleChangeTagProjectSettingsPopup}
        />
      </div>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div 
          className="" 
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px 0 0 0', 
            height: 'calc(100vh - 3.5rem)', 
            padding: '10px'
          }}
        >
          <div className="spinner_loader" hidden={!this.state.tag_project_main_screen_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_project_main_screen_loader}/>
          </div>
          {this.createProjectScreen()}
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}