import React from "react";
// import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// import {
//   MenuBook, 
//   AccountBox, 
//   SupervisorAccount, 
//   } from "@mui/icons-material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

import './HeaderSidebar.css';

export default class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  createMainSidebar() {
    return(
      <div className="main_sidebar_main_div justify-content-center" style={{width: '14rem', height: '100vh', padding: '10px'}}>
        <div className="main_sidebar_app_name d-flex align-items-center text-white">
          {/* <a onClick={() => {this.props.handleChangeActiveItem(0); this.props.handleChangeUrl('/home');}}> */}
            <h4 
            // onClick={() => {this.props.handleChangeActiveItem(1); this.props.handleChangeUrl('/home');}} 
            className="app-name-font">Easify</h4>
          {/* </a> */}
        </div>
        <ul className="main_sidebar_nav_list">
          {/* <li 
            className={`nav-item ${this.props.ActiveItem === 1 ? "active" : ""}`}
            onClick={() => {this.props.handleChangeActiveItem(1); this.props.handleChangeUrl('/home');}}
          >
            <MenuBook fontSize="small" className="main_sidebar_nav_icon"/>
            Home
          </li> */}
          <li 
            className={`main_sidebar_nav_item ${this.props.ActiveItem === 2 || this.props.ActiveItem === 4 ? "main_sidebar_active" : ""}`}
            onClick={() => {this.props.handleChangeActiveItem(2); this.props.handleChangeUrl('/my-project');}}
          >
            {/* <FontAwesomeIcon icon={faFileUpload} className="upload_icon main_sidebar_nav_icon"/> */}
            My Projects
          </li>
          <li 
            className={`main_sidebar_nav_item ${this.props.ActiveItem === 3 || this.props.ActiveItem === 5 ? "main_sidebar_active" : ""}`}
            onClick={() => {this.props.handleChangeActiveItem(3); this.props.handleChangeUrl('/shared');}}
          >
            {/* <FontAwesomeIcon icon={} className="main_sidebar_nav_icon" /> */}
            {/* <SupervisorAccount fontSize="small" className="main_sidebar_nav_icon"/> */}
            Shared Projects
          </li>
          {/* <li 
            className={`nav-item ${this.props.ActiveItem === 4 ? "active" : ""}`}
            onClick={() => {this.props.handleChangeActiveItem(4); this.props.handleChangeUrl('/profile');}}
          >
            <FontAwesomeIcon icon={} className="main_sidebar_nav_icon" />
            <AccountBox fontSize="small" className="main_sidebar_nav_icon"/>
            Profile
          </li> */}
        </ul>
      </div>
    )
  }

  render() {
    return(
      <div className="">
        {this.createMainSidebar()}
      </div>
    );
  }
}