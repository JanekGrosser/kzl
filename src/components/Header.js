import React, { Component } from "react";
import PropTypes from 'prop-types';
import l from "../common/lang";
import authService from "../services/authService";
import { withRouter, Link } from "react-router-dom";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import AddUserModal from "./modal/AddUserModal";
import { Dropdown, Button, Navbar, Nav } from "react-bootstrap";

var lang = l();

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordModalOpened: false,
      userModalOpened: false
    };

    this.onLogout = this.onLogout.bind(this);
    this.hidePasswordModal = this.hidePasswordModal.bind(this);
    this.hideAddUserModal = this.hideAddUserModal.bind(this);
    this.openPasswordModal = this.openPasswordModal.bind(this);
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

  openAddUserModal() {
    this.setState({
      addUserModalOpened: true
    })
  }
  

  render() {
    return (
      <>
        <Navbar className="box-shadow" collapseOnSelect bg="light" expand="lg">
          <Navbar.Brand href="/">{lang.brand}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="navbar-nav mr-auto">
              { authService.isRegularRole() ? <Link className="nav-link" to="/">Kalendarz biezacy</Link> : "" }
              { authService.isRegularRole() ? <Link className="nav-link" to="/booking">Kalendarz rezerwacji grafiku</Link> : "" }
              { authService.isSuperUserRole() ? <Nav.Link onClick={this.openAddUserModal}>{lang.addUser}</Nav.Link> : "" }
              { authService.isPriviligedRole() ? <Link className="nav-link" to="/users">{lang.users}</Link> : "" }
              <Nav.Link className="show-mobile" onClick={this.openPasswordModal}>{lang.changePassword}</Nav.Link>
              <Nav.Link className="show-mobile text-danger" onClick={this.onLogout}>{lang.logout}</Nav.Link>
            </Nav>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-user">
                <i className="fas fa-user"></i>{authService.getUsername()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.openPasswordModal}>{lang.changePassword}</Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item>
                  <Button variant="outline-danger" onClick={this.onLogout}>
                    <i className="fas fa-sign-out-alt"></i>{lang.logout}
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
        <ChangePasswordModal show={this.state.passwordModalOpened} onClose={this.hidePasswordModal} />
        <AddUserModal onAddUser={this.props.onAddUser} users={this.props.users} subdivisions={this.props.subdivisions} roles={this.props.roles} show={this.state.addUserModalOpened} onClose={this.hideAddUserModal}/>
      </>
    );
  }
}

Header.propTypes = {
  users: PropTypes.array,
  subdivisions: PropTypes.object,
  roles: PropTypes.object,
  onUserChange: PropTypes.func,
  onAddUser: PropTypes.func,
  onUserDelete: PropTypes.func
}

export default withRouter(Header);
