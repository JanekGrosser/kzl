import React, { Component } from "react";
import PropTypes from 'prop-types';
import lang from "../common/lang";
import authService from "../services/authService";
import { withRouter } from "react-router-dom";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import EditUserModal from "./modal/EditUserModal";
import AddUserModal from "./modal/AddUserModal";
import { Dropdown, Button, Navbar, Nav } from "react-bootstrap";

var c = lang().common;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordModalOpened: false,
      userModalOpened: false
    };

    this.onLogout = this.onLogout.bind(this);
    this.hidePasswordModal = this.hidePasswordModal.bind(this);
    this.hideEditUserModal = this.hideEditUserModal.bind(this);
    this.hideAddUserModal = this.hideAddUserModal.bind(this);
    this.openPasswordModal = this.openPasswordModal.bind(this);
    this.openEditUserModal = this.openEditUserModal.bind(this);
    this.openAddUserModal = this.openAddUserModal.bind(this);
    
  }

  onLogout() {
    authService.logOut().then(() => {
      this.props.history.push("/login");
    });
  }

  hidePasswordModal() {
    this.setState({
      passwordModalOpened: false
    })
  }

  hideEditUserModal() {
    this.setState({
      userModalOpened: false
    })
  }

  hideAddUserModal() {
    this.setState({
      addUserModalOpened: false
    })
  }

  openPasswordModal() {
    this.setState({
      passwordModalOpened: true
    })
  }

  openEditUserModal() {
    this.setState({
      userModalOpened: true
    })
  }

  openAddUserModal() {
    this.setState({
      addUserModalOpened: true
    })
  }
  

  render() {
    return (
      <>
        <Navbar className="box-shadow" collapseOnSelect bg="light" expand="lg">
          <Navbar.Brand href="/">{c.brand}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="navbar-nav mr-auto">
              { authService.isSuperUserRole() ? <Nav.Link onClick={this.openAddUserModal}>{c.addUser}</Nav.Link> : "" }
              { authService.isPriviligedRole() ? <Nav.Link onClick={this.openEditUserModal}>{c.editUser}</Nav.Link> : "" }
            </Nav>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-user">
                <i className="fas fa-user"></i>{authService.getUsername()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.openPasswordModal}>{c.changePassword}</Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item>
                  <Button variant="outline-danger" onClick={this.onLogout}>
                    <i className="fas fa-sign-out-alt"></i>Wyloguj
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <ChangePasswordModal show={this.state.passwordModalOpened} onClose={this.hidePasswordModal} />
        <EditUserModal onUserSave={this.props.onUserChange} users={this.props.users} subdivisions={this.props.subdivisions} roles={this.props.roles} show={this.state.userModalOpened} onClose={this.hideEditUserModal}/>
        <AddUserModal show={this.state.addUserModalOpened} onClose={this.hideAddUserModal}/>
      </>
    );
  }
}

Header.propTypes = {
  users: PropTypes.array,
  subdivisions: PropTypes.array,
  roles: PropTypes.array,
  onUserChange: PropTypes.func
}

export default withRouter(Header);
