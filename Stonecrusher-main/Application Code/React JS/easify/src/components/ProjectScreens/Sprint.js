import React from "react";
import { Row, Col, Container, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faTrash } from "@fortawesome/free-solid-svg-icons";

import './Sprint.css';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class Sprint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      project_data: this.props.project_data, 
      sprint_data: [], 
      last_unique_key_number: 0, 
      sprint_backlog_item_data: [], 
      sprint_container_display: [], 

      sprint_name: "", 
      sprint_duration: "1 Week", 

      tag_sprint_loader: true, 
      tag_sprint_create_new_popup: false, 
      error: '', 
    };

    this.onChangeSprintName = this.onChangeSprintName.bind(this);
    this.onChangeSprintDuration = this.onChangeSprintDuration.bind(this);
    // this.onFocusSprintAdd = this.onFocusSprintAdd.bind(this);
    // this.onBlurSprintAdd = this.onBlurSprintAdd.bind(this);
    // this.onKeyUpSprintAdd = this.onKeyUpSprintAdd.bind(this);
    // this.onChangeSprintItemType = this.onChangeSprintItemType.bind(this);
    // this.onChangeSprintItemPriority = this.onChangeSprintItemPriority.bind(this);
    this.onClickCreateNewSprint = this.onClickCreateNewSprint.bind(this);
    this.onClickCreateSprint = this.onClickCreateSprint.bind(this);
    this.onClickSprintArrow = this.onClickSprintArrow.bind(this);
    this.onClickCancelCreateNewSprintPopup = this.onClickCancelCreateNewSprintPopup.bind(this);
    this.onClickSprintBacklogItemTrash = this.onClickSprintBacklogItemTrash.bind(this);
    this.onClickSprintTrash = this.onClickSprintTrash.bind(this);
    this.onChangeSprintBacklogItemProgress = this.onChangeSprintBacklogItemProgress.bind(this);
  }

  componentDidMount() {
    let str = '/sprint/fetch?project_id=' + this.props.project_data.project_id;
    this.fetchSprintDetails(str);
  }

  onChangeSprintName(e) {
    this.setState({sprint_name: e.target.value})
  }

  onChangeSprintDuration(e) {
    this.setState({sprint_duration: e.target.value})
  }

  onChangeSprintBacklogItemProgress(e, sprint_backlog_item_value) {
    // this.setState({tag_product_backlog_loader: true, });

    let str = '/task/update?name=' + sprint_backlog_item_value.name + 
    '&unique_key_number=' + sprint_backlog_item_value.unique_key_number + 
    '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
    '&type='+ sprint_backlog_item_value.type + 
    '&priority=' + sprint_backlog_item_value.priority + 
    '&sprint_id=' + sprint_backlog_item_value.sprint_id + 
    '&project_id=' + this.props.project_data.project_id + 
    '&created_by=' + parseInt(cookie.load('user')[0].id) + 
    '&id=' + sprint_backlog_item_value.id + 
    '&progress=' + e.target.value;
    console.log(str);

    this.sendSprintBacklogItemDetails(str)
  }

  // onFocusSprintAdd(e) {
  //   // console.log("F: ", e.target.value)
  // }

  // onBlurSprintAdd(e) {
  //   // this.setState({sprint_new_item: e.target.value})
  //   if(e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
  //     this.setState({
  //       last_unique_key_number: this.state.last_unique_key_number + 1, 
  //       tag_sprint_loader: true, 
  //     }, () => {
  //       let str = '/task/add?name=' + e.target.value + '&unique_key_number=' + this.state.last_unique_key_number + 
  //       '&unique_key_name=' + this.props.project_data.project_unique_key_name + '&priority=-&type=-' + 
  //       '&project_id=' + this.props.project_data.project_id + '&created_by=' + parseInt(cookie.load('user')[0].id);
  //       console.log(str);

  //       this.sendNewBacklogItemDetails(str);
  //     });
  //   }
  // }

  // onKeyUpSprintAdd(e) {
  //   if (e.keyCode === 13) {
  //     e.preventDefault();
  //     e.target.blur();
  //   }
  // }

  // onChangeSprintItemType(e, backlog_item_value) {
  //   // this.setState({tag_sprint_loader: true, });

  //   let str = '/task/update?name=' + backlog_item_value.name + '&unique_key_number=' + backlog_item_value.unique_key_number + 
  //   '&unique_key_name=Book' + this.props.project_data.project_unique_key_name + '&priority=-&type='+ e.target.value + 
  //   '&project_id=' + this.props.project_data.project_id + '&created_by=' + parseInt(cookie.load('user')[0].id)
  //    + '&id=' + backlog_item_value.id;
  //   console.log(str);

  //   this.sendNewBacklogItemDetails(str)
  // }

  // onChangeSprintItemPriority(e, backlog_item_value) {
  //   // this.setState({tag_sprint_loader: true, });

  //   let str = '/task/update?name=' + backlog_item_value.name + '&unique_key_number=' + backlog_item_value.unique_key_number + 
  //   '&unique_key_name=Book' + this.props.project_data.project_unique_key_name + '&priority=' + e.target.value + '&type='+ backlog_item_value.type + 
  //   '&project_id=' + this.props.project_data.project_id + '&created_by=' + parseInt(cookie.load('user')[0].id)
  //    + '&id=' + backlog_item_value.id;
  //   console.log(str);

  //   this.sendNewBacklogItemDetails(str)
  // }

  // onClickCreateSprintItem() {
  //   console.log("Hello")
  // }

  onClickCreateNewSprint(e) {
    this.setState({tag_sprint_create_new_popup: true, });
  }

  onClickCancelCreateNewSprintPopup(e) {
    this.setState({
      sprint_name: "", 
      sprint_duration: "1 Week", 
      tag_sprint_create_new_popup: false, 
    });
  }

  onClickCreateSprint(e) {
    this.setState({tag_sprint_loader: true, });

    let str = '/sprint/add?name=' + this.state.sprint_name + '&duration=' + this.state.sprint_duration + 
    '&project_id=' + this.props.project_data.project_id + 
    '&unique_key_number=' + this.state.last_unique_key_number;
    console.log(str);

    this.sendSprintDetails(str);
  }

  onClickSprintArrow(e, i) {
    if(this.state.sprint_container_display[i]) {
      document.getElementById('sprint_arrow_right_icon_component_id_' + i).style.transform = 'rotate(90deg)';
      document.getElementById('sprint_container_row_id_' + i).style.display = 'flex';
      let temp_sprint_container_display = this.state.sprint_container_display;
      temp_sprint_container_display[i] = !temp_sprint_container_display[i];
      this.setState({sprint_container_display: temp_sprint_container_display});
    } else {
      document.getElementById('sprint_arrow_right_icon_component_id_' + i).style.transform = 'rotate(0deg)';
      document.getElementById('sprint_container_row_id_' + i).style.display = 'none';
      let temp_sprint_container_display = this.state.sprint_container_display;
      temp_sprint_container_display[i] = !temp_sprint_container_display[i];
      this.setState({sprint_container_display: temp_sprint_container_display});
    }
    console.log(this.state.sprint_container_display)
  }

  onClickSprintBacklogItemTrash(e, sprint_backlog_item_value) {
    this.setState({tag_sprint_loader: true, });

    let str = '/task/update?name=' + sprint_backlog_item_value.name + 
    '&unique_key_number=' + sprint_backlog_item_value.unique_key_number + 
    '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
    '&type='+ sprint_backlog_item_value.type + 
    '&priority=' + sprint_backlog_item_value.priority + 
    '&project_id=' + this.props.project_data.project_id + 
    '&created_by=' + parseInt(cookie.load('user')[0].id) + 
    '&id=' + sprint_backlog_item_value.id + 
    '&sprint_id=-&progress=-';
    console.log(str);

    this.sendSprintBacklogItemDetails(str);
  }

  onClickSprintTrash(e, sprint_value) {
    this.setState({tag_sprint_loader: true, });

    let str = '/sprint/delete?project_id=' + this.props.project_data.project_id + 
    '&unique_key_number=' + sprint_value.unique_key_number;

    this.deleteSprintDetails(str);
  }

  async fetchSprintDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data)
            let temp_array_sprint_container_display = [];

            for(let i=0 ; i<res.data.data.sprint_data.length ; i++) {
              temp_array_sprint_container_display.push(false);
            }

            this.setState({
              sprint_data: res.data.data.sprint_data, 
              last_unique_key_number: res.data.data.last_unique_key_number, 
              sprint_backlog_item_data: res.data.data.sprint_backlog_item_data, 
              sprint_container_display: temp_array_sprint_container_display, 
            });
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
          tag_sprint_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async sendSprintDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data)
            this.setState({
              sprint_data: res.data.data.sprint_data, 
              last_unique_key_number: res.data.data.last_unique_key_number, 
              sprint_backlog_item_data: res.data.data.sprint_backlog_item_data, 
              sprint_name: "", 
              sprint_duration: "1 Week", 
              tag_sprint_create_new_popup: false, 
            });
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
          tag_sprint_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async sendSprintBacklogItemDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data.backlog_item_data)
            // this.setState({
            //   sprint_data: res.data.data.sprint_data, 
            //   last_unique_key_number: res.data.data.last_unique_key_number, 
            //   sprint_backlog_item_data: res.data.data.sprint_backlog_item_data, 
            // });
            let str = '/sprint/fetch?project_id=' + this.props.project_data.project_id;
            this.fetchSprintDetails(str)
          } else if(res.data.status === 201) {
            console.log(res.data.print_error)
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        // this.setState({
        //   tag_sprint_loader: false, 
        // })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async deleteSprintDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data.backlog_item_data)
            // this.setState({
            //   sprint_data: res.data.data.sprint_data, 
            //   last_unique_key_number: res.data.data.last_unique_key_number, 
            //   sprint_backlog_item_data: res.data.data.sprint_backlog_item_data, 
            // });
            let str = '/sprint/fetch?project_id=' + this.props.project_data.project_id;
            this.fetchSprintDetails(str)
          } else if(res.data.status === 201) {
            console.log(res.data.print_error)
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }

        // this.setState({
        //   tag_sprint_loader: false, 
        // })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  // async sendNewBacklogItemDetails(str) {
  //   // if(this.state.tag_send_project_details === true) {
  //     await api.get(str)
  //     .then(res => {
  //       if(res.status === 200) {
  //         if (res.data.status === 200) {
  //           console.log(res.data.data.backlog_item_data)
  //           this.setState({
  //             backlog_item_data: res.data.data.backlog_item_data, 
  //             last_unique_key_number: res.data.data.last_unique_key_number,  
  //             sprint_new_item: '', 
  //           });
  //         } else if(res.data.status === 201) {
  //           console.log(res.data.print_error)
  //           this.setState({
  //             error: res.data.print_error, 
  //           })
  //         } else {
  //           alert(res.data.error)
  //           console.log(res.data.error)
  //         }
  //       }

  //       this.setState({
  //         tag_sprint_loader: false, 
  //       })
  //     })
  //     .catch(err =>{
  //       console.log(err);
  //     })
  //   // }
  // }

  createNewSprintPopup() {
    return(
      <div className="sprint_create_new_popup_component" hidden={!this.state.tag_sprint_create_new_popup}>
        <Container className="sprint_create_new_popup">
          <div className="sprint_create_new_popup_header_component">
            <div></div>
            <div><b>Create Sprint</b></div>
            <div className="sprint_create_new_popup_cancel_icon_component" onClick={(e) => this.onClickCancelCreateNewSprintPopup(e)}>
              <svg className="sprint_create_new_popup_cancel_icon" width="18" height="18" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.403 12.952 19.7 6.666a1.004 1.004 0 0 0-1.42-1.42l-6.285 6.297L5.71 5.247a1.003 1.003 0 1 0-1.42 1.419l6.296 6.286-6.295 6.286a.999.999 0 0 0 0 1.419 1 1 0 0 0 1.419 0l6.285-6.296 6.286 6.296a1 1 0 0 0 1.637-.325 1 1 0 0 0-.218-1.094l-6.296-6.286z" fill="#030202"/>
              </svg>
            </div>
          </div>

          <hr className="sprint_create_new_popup_horizontal_divider"/>

          <Row className="px-4 my-2">
            <Col className="p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div className="sprint_create_new_popup_label" >Sprint Name</div>
            </Col>
            <Col className="p-0 m-0">
              <div style={{ display: 'flex' }}>
                <input 
                  className="sprint_create_new_popup_input" 
                  placeholder={`Sprint - ${this.state.last_unique_key_number}`} 
                  style={{ width: '35%', borderRadius: '8px 0 0 8px', borderRight: 'none', }} 
                  disabled 
                />
                <input 
                  className="sprint_create_new_popup_input" 
                  placeholder="Enter sprint name" 
                  style={{ borderRadius: '0 8px 8px 0', borderLeft: 'none', }} 
                  onChange={this.onChangeSprintName}
                  // onBlur={this.onBlurProjectName}
                  value={this.state.sprint_name}
                />
              </div>
            </Col>
          </Row>

          <Row className="px-4 my-2">
            <Col className="p-0 m-0" xl={12} style={{textAlign: "start"}}>
              <div className="sprint_create_new_popup_label">Duration</div>
            </Col>
            <Col className="p-0 m-0">
              <select className="sprint_create_new_popup_input" defaultValue={this.state.sprint_duration} name="duration" onChange={this.onChangeSprintDuration}>
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="3 Weeks">3 Weeks</option>
                <option value="4 Weeks">4 Weeks</option>
              </select>
            </Col>           
          </Row>

          <div className="justify-content-center d-flex my-3">
            <div className="sprint_create_new_popup_create_button" onClick={(e) => this.onClickCreateSprint(e)}>
              Create
            </div>
          </div>
        </Container>
      </div>
    )
  }

  createSprint() {
    // var check_access = (parseInt(this.props.project_data.project_owner_id) === parseInt(cookie.load('user')[0].id)) || 
    //   (this.props.project_data.project_my_role === 'Project Member');

    return(
      <div className="sprint_component">
        {
          this.state.sprint_data.map( (sprint_value, i) => {
            return(
              <Container className="sprint_container" key={i}>
                <div className="sprint_row">
                  <div 
                    id={`sprint_arrow_right_icon_component_id_${i}`} 
                    className="sprint_arrow_right_icon_component" 
                    onClick={(e) => this.onClickSprintArrow(e, i)} 
                  >
                    <FontAwesomeIcon className="sprint_arrow_right_icon" icon={faCaretRight} />
                  </div>
                  <b className="sprint_title">Sprint - {sprint_value.unique_key_number} {sprint_value.name}</b>
                  <div className="sprint_duration">(Duration: {sprint_value.duration})</div>
                  <div className="sprint_trash_icon_component">
                    <FontAwesomeIcon 
                      className="sprint_trash_icon" 
                      icon={faTrash} 
                      onClick={(e) => this.onClickSprintTrash(e, sprint_value)}
                    />
                  </div>
                </div>
                <Container id={`sprint_container_row_id_${i}`} className="sprint_container_row">
                  <div className="sprint_row sprint_row_title">
                    <div className="sprint_col_title sprint_col_title_0 justify-content-start d-flex"></div>
                    <div className="sprint_col_title sprint_col_title_1 justify-content-center d-flex p-0">Item</div>
                    <div className="sprint_col_title sprint_col_title_2 justify-content-center d-flex">Type</div>
                    <div className="sprint_col_title sprint_col_title_3 justify-content-center d-flex">Priority</div>
                    <div className="sprint_col_title sprint_col_title_4 justify-content-center d-flex">Progress</div>
                    <div className="sprint_col_title sprint_col_title_5 justify-content-center d-flex"></div>
                  </div>
                  {
                    this.state.sprint_backlog_item_data[i].map( (sprint_backlog_item_value, j) => {
                      return(
                        <div className="sprint_row sprint_row_data" key={j}>
                          <div className="sprint_col_data sprint_col_data_0 justify-content-start d-flex">
                          </div>
                          <div className="sprint_col_data sprint_col_data_1 justify-content-start d-flex">
                            {this.props.project_data.project_unique_key_name}-{sprint_backlog_item_value.unique_key_number} {sprint_backlog_item_value.name}
                          </div>
                          <div className="sprint_col_data sprint_col_data_2 justify-content-center d-flex">
                            {sprint_backlog_item_value.type}
                          </div>
                          <div className="sprint_col_data sprint_col_data_3 justify-content-center d-flex">
                            {sprint_backlog_item_value.priority}
                          </div>
                          <div className="sprint_col_data sprint_col_data_4 justify-content-center d-flex">
                            <select className="sprint_select_progress" defaultValue={sprint_backlog_item_value.progress} onChange={(e) => this.onChangeSprintBacklogItemProgress(e, sprint_backlog_item_value)}>
                              <option className="sprint_select_option_progress" value="-">-</option>
                              <option className="sprint_select_option_progress" value="To Do">To Do</option>
                              <option className="sprint_select_option_progress" value="In Progress">In Progress</option>
                              <option className="sprint_select_option_progress" value="Done">Done</option>
                            </select>
                          </div>
                          <div className="sprint_col_data sprint_col_data_5 justify-content-center d-flex">
                            <FontAwesomeIcon 
                              className="sprint_backlog_item_trash_icon" 
                              icon={faTrash} 
                              onClick={(e) => this.onClickSprintBacklogItemTrash(e, sprint_backlog_item_value)}
                            />
                          </div>
                        </div>
                      )
                    })
                  }
                </Container>
              </Container>
            )
          })
        }
        
      </div>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div className="sprint_main_div mt-3">
          <div className="spinner_loader" hidden={!this.state.tag_sprint_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_sprint_loader}/>
          </div>
          <div className="sprint_create_new_row">
            <div className="sprint_create_new_button" onClick={(e) => this.onClickCreateNewSprint(e)}>
              <svg className="sprint_create_new_plus_icon" width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.583 22.916h-12.5v-12.5a2.083 2.083 0 0 0-4.166 0v12.5h-12.5a2.083 2.083 0 1 0 0 4.167h12.5v12.5a2.083 2.083 0 0 0 4.166 0v-12.5h12.5a2.083 2.083 0 1 0 0-4.167z" fill="#525252"/>
              </svg>
              <div className="sprint_create_new_text">Create Sprint</div>
            </div>
          </div>
          {this.createNewSprintPopup()}
          {this.createSprint()}
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}