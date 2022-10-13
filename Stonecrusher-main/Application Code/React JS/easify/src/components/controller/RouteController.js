import React, { Component } from "react";
import cookie from "react-cookies";

export default class RouteController extends Component {

  componentWillMount() {
    const is_login = cookie.load("is_login");
    if (parseInt(is_login) === 1) {
      window.location.href = "/my-project";
    } else {
      window.location.href = "/login";
    }
  }

  render() {
    return <div></div>;
  }
}
