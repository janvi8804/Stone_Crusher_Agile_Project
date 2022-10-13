import React from "react";
// import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// import { ArrowDropDown, } from "@material-ui/icons";
import cookie from "react-cookies";

import person_placeholder from "../../assets/person_placeholder.png";
import './HeaderSidebar.css';

export default class AdminHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.getImage = this.getImage.bind(this)
  }

  getImage() {
    // if(this.props.image_url.length !== 0){
    //   if (this.props.image_url[0] !== "image_url") {
    //     // console.log("image_url")
    //     // return `http://localhost:8000/${this.state.avatar}`;
    //     return "data:image/png;base64," + this.props.image_url[0]
    //   }
    // }
      
    return person_placeholder;
  }

  onClicklogOut() {
    let allcookie = cookie.loadAll();
    console.log(allcookie);
    Object.entries(allcookie).map(([key,value])=>(
      cookie.remove(key)
    ))

    allcookie = cookie.loadAll();
    console.log(allcookie);

    window.location.href = "/";
  }

  createHeader() {
    return(
      <header className="main_header_main_div justify-content-between align-items-center d-flex w-100">
        <div className="ml-auto d-flex align-items-center">
          <img 
            className="rounded-circle mr-1" 
            src={this.getImage()} alt="profile" 
            style={{ height: '2.2rem', width: '2.2rem'}}
          />
          <div className="ml-1">{this.props.UserName}</div>
          <div className="ml-2 mr-1 main_header_onProfile_dropdown_list">
            {/* <div><ArrowDropDown/></div> */}
            <div className="main_header_down_arrow_icon_component">
              <svg className="main_header_down_arrow_icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34 18.34a2 2 0 0 0-2.82 0L24 25.42l-7.08-7.08a2 2 0 1 0-2.82 2.84l8.48 8.48a2.003 2.003 0 0 0 2.19.438c.243-.101.464-.25.65-.438L34 21.18a2 2 0 0 0 0-2.84z" fill="#FDFCFC"/>
              </svg>
            </div>
            <ul className="position-absolute p-0 " style={{ zIndex: 1, color: 'black'}}>
              {/* <li 
                onClick={() => {
                  this.props.handleChangeActiveItem(4); 
                  this.props.handleChangeUrl('/profile');
                }}
              >profile</li> */}
              <li 
                onClick={() => {
                  // this.handleChangeUrl('/logout');
                  this.onClicklogOut();
                }}
              >logout</li>
            </ul>
          </div>
        </div>
      </header>
    )
  }

  render() {
    return(
      <div className="">
        {this.createHeader()}
      </div>
    );
  }
}