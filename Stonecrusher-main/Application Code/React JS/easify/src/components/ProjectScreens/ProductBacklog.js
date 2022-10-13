import React from "react";
import { Container, } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import cookie from "react-cookies";
import axios from 'axios';
import {Puff as Loader} from 'react-loader-spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import './ProductBacklog.css';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default class ProductBacklog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      project_data: this.props.project_data, 
      backlog_item_data: [], 
      last_unique_key_number: 0, 

      sprint_data: [], 

      product_backlog_new_item: "", 

      tag_product_backlog_loader: true, 
      error: '', 
    };

    this.onChangeProductBacklogAddItem = this.onChangeProductBacklogAddItem.bind(this);
    this.onFocusProductBacklogAddItem = this.onFocusProductBacklogAddItem.bind(this);
    this.onBlurProductBacklogAddItem = this.onBlurProductBacklogAddItem.bind(this);
    this.onKeyUpProductBacklogAddItem = this.onKeyUpProductBacklogAddItem.bind(this);
    this.onChangeProductBacklogItemType = this.onChangeProductBacklogItemType.bind(this);
    this.onChangeProductBacklogItemPriority = this.onChangeProductBacklogItemPriority.bind(this);
    this.onChangeProductBacklogItemSprint = this.onChangeProductBacklogItemSprint.bind(this);
    this.onClickCreateProductBacklogItem = this.onClickCreateProductBacklogItem.bind(this);
    this.onClickProductBacklogitemTrash = this.onClickProductBacklogitemTrash.bind(this);
  }

  componentDidMount() {
    let str = '/sprint/fetch?project_id=' + this.props.project_data.project_id;
    this.fetchSprintDetails(str);
  }

  onChangeProductBacklogAddItem(e) {
    this.setState({product_backlog_new_item: e.target.value})
  }

  onFocusProductBacklogAddItem(e) {
    // console.log("F: ", e.target.value)
  }

  onBlurProductBacklogAddItem(e) {
    // this.setState({product_backlog_new_item: e.target.value})
    if(e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
      this.setState({
        last_unique_key_number: this.state.last_unique_key_number + 1, 
        tag_product_backlog_loader: true, 
      }, () => {
        let str = '/task/add?name=' + e.target.value + 
        '&unique_key_number=' + this.state.last_unique_key_number + 
        '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
        '&project_id=' + this.props.project_data.project_id + 
        '&created_by=' + parseInt(cookie.load('user')[0].id) + 
        '&type=-&priority=-&progress=-&sprint_id=-';
        console.log(str);

        this.sendNewBacklogItemDetails(str);
      });
    }
  }

  onKeyUpProductBacklogAddItem(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
    }
  }

  onChangeProductBacklogItemType(e, backlog_item_value) {
    // this.setState({tag_product_backlog_loader: true, });

    let str = '/task/update?name=' + backlog_item_value.name + 
    '&unique_key_number=' + backlog_item_value.unique_key_number + 
    '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
    '&type='+ e.target.value + 
    '&priority=' + backlog_item_value.priority + 
    '&sprint_id=' + backlog_item_value.sprint_id + 
    '&project_id=' + this.props.project_data.project_id + 
    '&created_by=' + parseInt(cookie.load('user')[0].id) + 
    '&id=' + backlog_item_value.id + 
    '&progress=' + backlog_item_value.progress;
    console.log(str);

    this.sendNewBacklogItemDetails(str)
  }

  onChangeProductBacklogItemPriority(e, backlog_item_value) {
    // this.setState({tag_product_backlog_loader: true, });

    let str = '/task/update?name=' + backlog_item_value.name + 
    '&unique_key_number=' + backlog_item_value.unique_key_number + 
    '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
    '&type='+ backlog_item_value.type + 
    '&priority=' + e.target.value + 
    '&sprint_id=' + backlog_item_value.sprint_id + 
    '&project_id=' + this.props.project_data.project_id + 
    '&created_by=' + parseInt(cookie.load('user')[0].id) + 
    '&id=' + backlog_item_value.id + 
    '&progress=' + backlog_item_value.progress;
    console.log(str);

    this.sendNewBacklogItemDetails(str)
  }

  onChangeProductBacklogItemSprint(e, backlog_item_value) {
    // this.setState({tag_product_backlog_loader: true, });
    
    let str = '/task/update?name=' + backlog_item_value.name + 
    '&unique_key_number=' + backlog_item_value.unique_key_number + 
    '&unique_key_name=' + this.props.project_data.project_unique_key_name + 
    '&type='+ backlog_item_value.type + 
    '&priority=' + backlog_item_value.priority + 
    '&sprint_id=' + e.target.value + 
    '&project_id=' + this.props.project_data.project_id + 
    '&created_by=' + parseInt(cookie.load('user')[0].id) + 
    '&id=' + backlog_item_value.id + 
    '&progress=-';
    console.log(str);

    this.sendNewBacklogItemDetails(str)
  }

  onClickCreateProductBacklogItem() {
    console.log("Hello")
  }

  onClickProductBacklogitemTrash(e, backlog_item_value) {
    this.setState({tag_product_backlog_loader: true, });
    
    let str = '/task/delete?unique_key_number=' + backlog_item_value.unique_key_number + 
    '&project_id=' + this.props.project_data.project_id + 
    '&id=' + backlog_item_value.id;
    console.log(str);

    this.deleteProductBacklogItemDetails(str)
  }

  async fetchBacklogItemsDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data.backlog_item_data)
            this.setState({
              backlog_item_data: res.data.data.backlog_item_data, 
              last_unique_key_number: res.data.data.last_unique_key_number, 
              product_backlog_new_item: '', 
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
          tag_product_backlog_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async sendNewBacklogItemDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data.backlog_item_data)
            this.setState({
              backlog_item_data: res.data.data.backlog_item_data, 
              last_unique_key_number: res.data.data.last_unique_key_number,  
              product_backlog_new_item: '', 
            });
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

        this.setState({
          tag_product_backlog_loader: false, 
        })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async fetchSprintDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data)
            this.setState({
              sprint_data: res.data.data.sprint_data, 
            });
            str = '/task/fetch?project_id=' + this.props.project_data.project_id;
            this.fetchBacklogItemsDetails(str);
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res)
          }
        }

        // this.setState({
        //   tag_product_backlog_loader: false, 
        // })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }

  async deleteProductBacklogItemDetails(str) {
    // if(this.state.tag_send_project_details === true) {
      await api.get(str)
      .then(res => {
        if(res.status === 200) {
          if (res.data.status === 200) {
            console.log(res.data.data)
            // this.setState({
            //   sprint_data: res.data.data.sprint_data, 
            // });
            let str = '/sprint/fetch?project_id=' + this.props.project_data.project_id;
            this.fetchSprintDetails(str);
          } else if(res.data.status === 201) {
            this.setState({
              error: res.data.print_error, 
            })
          } else {
            alert(res.data.error)
            console.log(res)
          }
        }

        // this.setState({
        //   tag_product_backlog_loader: false, 
        // })
      })
      .catch(err =>{
        console.log(err);
      })
    // }
  }


  createProductBacklog() {
    // var check_access = (parseInt(this.props.project_data.project_owner_id) === parseInt(cookie.load('user')[0].id)) || 
    //   (this.props.project_data.project_my_role === 'Project Member');

    return(
      <div className="product_backlog_component">
        <Container className="product_backlog_container">
          {/* <div className="product_backlog_row"><b className="product_backlog_title">Backlog</b></div> */}
          <Container className="product_backlog_container_row">
            <div className="product_backlog_row product_backlog_row_title">
              <div className="product_backlog_col_title product_backlog_col_title_0 justify-content-start d-flex"></div>
              <div className="product_backlog_col_title product_backlog_col_title_1 justify-content-center d-flex p-0">Item</div>
              <div className="product_backlog_col_title product_backlog_col_title_2 justify-content-center d-flex">Type</div>
              <div className="product_backlog_col_title product_backlog_col_title_3 justify-content-center d-flex">Priority</div>
              <div className="product_backlog_col_title product_backlog_col_title_4 justify-content-center d-flex">Sprint</div>
              <div className="product_backlog_col_title product_backlog_col_title_5 justify-content-center d-flex"></div>
            </div>
            {
              this.state.backlog_item_data.map( (backlog_item_value, i) => {
                return(
                  <div className="product_backlog_row product_backlog_row_data" key={i}>
                    <div className="product_backlog_col_data product_backlog_col_data_0 justify-content-start d-flex">
                    </div>
                    <div className="product_backlog_col_data product_backlog_col_data_1 justify-content-start d-flex">
                      {this.props.project_data.project_unique_key_name}-{backlog_item_value.unique_key_number} {backlog_item_value.name}
                    </div>
                    <div className="product_backlog_col_data product_backlog_col_data_2 justify-content-center d-flex">
                      <select className="product_backlog_select_type" defaultValue={backlog_item_value.type} onChange={(e) => this.onChangeProductBacklogItemType(e, backlog_item_value)}>
                        <option className="product_backlog_select_option_type" value="-">-</option>
                        <option className="product_backlog_select_option_type" value="User Story">User Story</option>
                        <option className="product_backlog_select_option_type" value="Task">Task</option>
                        <option className="product_backlog_select_option_type" value="Bug">Bug</option>
                      </select>
                    </div>
                    <div className="product_backlog_col_data product_backlog_col_data_3 justify-content-center d-flex">
                      <select className="product_backlog_select_priority" defaultValue={backlog_item_value.priority} onChange={(e) => this.onChangeProductBacklogItemPriority(e, backlog_item_value)}>
                        <option className="product_backlog_select_option_priority" value="-">-</option>
                        <option className="product_backlog_select_option_priority" value="Low">Low</option>
                        <option className="product_backlog_select_option_priority" value="Midium">Midium</option>
                        <option className="product_backlog_select_option_priority" value="High">High</option>
                      </select>
                    </div>
                    <div className="product_backlog_col_data product_backlog_col_data_4 justify-content-center d-flex">
                      <select className="product_backlog_select_sprint" defaultValue={backlog_item_value.sprint_id} onChange={(e) => this.onChangeProductBacklogItemSprint(e, backlog_item_value)}>
                        <option className="product_backlog_select_option_sprint" value="-">-</option>
                        {
                          this.state.sprint_data.map( (sprint_value, j) => {
                            return(
                              <option 
                                className="product_backlog_select_option_sprint" 
                                value={sprint_value.unique_key_number} 
                                key={j}
                              >
                                {sprint_value.unique_key_number}
                              </option>  
                            )
                          })
                        }
                      </select>
                    </div>
                    <div className="product_backlog_col_data product_backlog_col_data_5 justify-content-center d-flex">
                      <FontAwesomeIcon 
                        className="product_backlog_item_trash_icon" 
                        icon={faTrash} 
                        onClick={(e) => this.onClickProductBacklogitemTrash(e, backlog_item_value)}
                      />
                    </div>
                  </div>
                )
              })
            }
            <div className="product_backlog_row product_backlog_row_add_new">
              <div className="product_backlog_col_add_new product_backlog_col_add_new_0 justify-content-start d-flex"></div>
              <div className="product_backlog_col_add_new product_backlog_col_add_new_1 justify-content-start d-flex">
                <input 
                  className="product_backlog_add_item_input" 
                  placeholder="+ Add Item" 
                  onChange={this.onChangeProductBacklogAddItem} 
                  value={this.state.product_backlog_new_item} 
                  onFocus={this.onFocusProductBacklogAddItem} 
                  onBlur={this.onBlurProductBacklogAddItem} 
                  onKeyUp={this.onKeyUpProductBacklogAddItem} 
                />
              </div>
            </div>
          </Container>
        </Container>
      </div>
    )
  }

  render() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      return(
        <div className="product_backlog_main_div mt-3">
          <div className="spinner_loader" hidden={!this.state.tag_product_backlog_loader}>
            <Loader color="#84160f" height={100} width={100} visible={this.state.tag_product_backlog_loader}/>
          </div>
          {this.createProductBacklog()}
        </div>
      );
    } else {
      window.location.href = "/login";
    }
  }
}