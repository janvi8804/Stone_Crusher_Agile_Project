import React from "react";
import { Row, Col, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
/* 
import moment from 'moment';

import interact from 'interactjs';
import Timeline from 'react-calendar-timeline';
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css';
*/

import MainSidebar from '../HeaderSidebar/MainSidebar';
import Header from '../HeaderSidebar/Header';
import MyProjectPage from '../MyProject/MyProjectPage';
import ProjectMainScreen from '../ProjectScreens/ProjectMainScreen';
// import ClassroomPage from './ClassroomPage';
// import UploadPage from './UploadPage';
// import UserPage from './UserPage';
// import ProfilePage from './ProfilePage';

import './HomePage.css';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ActiveItem: this.props.ActiveItem,

      project_data: [], 

      userName: parseInt(cookie.load("is_login")) === 1 ? cookie.load("user")[0]["name"] : "",
      // image_url: this.props.image_url //image_url
    };

    this.handleChangeActiveItem = this.handleChangeActiveItem.bind(this)
    this.handleChangeUrl = this.handleChangeUrl.bind(this)
    this.handleChangeProjectScreen = this.handleChangeProjectScreen.bind(this)
    this.handleChangeUserName = this.handleChangeUserName.bind(this)
    this.handleChangeImageUrl = this.handleChangeImageUrl.bind(this)
  }
  
  handleChangeActiveItem(active) {
    this.setState({ActiveItem: active})
    console.log(active)
  }

  handleChangeUrl(Url) {
    window.history.pushState(null, null, Url)
    console.log(Url)
  }

  handleChangeProjectScreen(project_data) {
    this.setState({project_data: project_data})
    console.log(project_data)
  }

  handleChangeUserName(name) {
    this.setState({userName: name})
  }

  handleChangeImageUrl(image_url) {
    this.setState({image_url: image_url})
  }

  createHomePage() {
    return(
      <div>
        <Row className="home_greetings justify-content-center m-0 p-0">
          Hello
        </Row>
        <Row className="justify-content-center m-0 p-0">
          Project 1
        </Row>
      </div>
    )
  }

  handleHomePage(active) {
    switch(active) {
    //   // case 0: return this.createAdminMainPage()

      case 1: return this.createHomePage();

      case 2: return <MyProjectPage 
                        key={this.state.ActiveItem}
                        ActiveItem={this.state.ActiveItem} 
                        handleChangeActiveItem={this.handleChangeActiveItem} 
                        handleChangeUrl={this.handleChangeUrl} 
                        handleChangeProjectScreen={this.handleChangeProjectScreen} 
                      />
      
      case 3: return <MyProjectPage 
                        key={this.state.ActiveItem}
                        ActiveItem={this.state.ActiveItem} 
                        handleChangeActiveItem={this.handleChangeActiveItem} 
                        handleChangeUrl={this.handleChangeUrl} 
                        handleChangeProjectScreen={this.handleChangeProjectScreen} 
                      />

      case 4: return <ProjectMainScreen 
                        key={this.state.ActiveItem}
                        project_data={this.state.project_data}
                      />

      case 5: return <ProjectMainScreen 
                        key={this.state.ActiveItem}
                        project_data={this.state.project_data}
                      />

    //   case 3: return <UserPage 
    //                     ActiveItem={this.state.ActiveItem} 
    //                     handleChangeActiveItem={this.handleChangeActiveItem} 
    //                     handleChangeUrl={this.handleChangeUrl}  
    //                   />

    //   case 4: return <ProfilePage 
    //                     handleChangeUserName={this.handleChangeUserName} 
    //                     image_url={this.state.image_url}//image_url 
    //                     handleChangeImageUrl={this.handleChangeImageUrl} 
    //                   />

      default: this.createHomePage()
      
    }
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div className="">
          <Row className="p-0 m-0">
            <MainSidebar 
              ActiveItem={this.state.ActiveItem} 
              handleChangeActiveItem={this.handleChangeActiveItem} 
              handleChangeUrl={this.handleChangeUrl} 
            />
            <Col className="p-0 m-0" style={{ backgroundColor: '#84160f' }}>
              <Header 
                ActiveItem={this.state.ActiveItem} 
                handleChangeActiveItem={this.handleChangeActiveItem} 
                handleChangeUrl={this.handleChangeUrl} 
                UserName={this.state.userName} 
                // image_url={this.state.image_url}//image_url 
              />
              <div style={{ backgroundColor: 'white', borderRadius: '16px 0 0 0', height: 'calc(100vh - 3.5rem)' }}>
                {this.handleHomePage(this.state.ActiveItem)}
              </div>
            </Col>
          </Row> 
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}