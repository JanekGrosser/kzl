import React, { Component } from "react";
import PropTypes from 'prop-types';
import lang from "../common/lang";
import authService from "../services/authService";
import { withRouter, Link } from "react-router-dom";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import AddUserModal from "./modal/AddUserModal";
import { Dropdown, Button, Navbar, Nav } from "react-bootstrap";

var l = lang();

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordModalOpened: false,
      userModalOpened: false,
      expanded: false
    };

    this.onLogout = this.onLogout.bind(this);
    this.hidePasswordModal = this.hidePasswordModal.bind(this);
    this.hideAddUserModal = this.hideAddUserModal.bind(this);
    this.openPasswordModal = this.openPasswordModal.bind(this);
    this.openAddUserModal = this.openAddUserModal.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    
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
  
  onClick(path) {
    this.setState({expanded: false})
    this.props.history.push(path);
  }

  toggleNavbar() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    return (
      <>
        <Navbar collapseOnSelect className="box-shadow" bg="light" expand="lg" expanded={this.state.expanded}>
          <Navbar.Brand>
            <Link className="navbar-brand" to="/">{l.brand}</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={this.toggleNavbar}/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="navbar-nav mr-auto">
              { authService.isRegularRole() ? <Nav.Item className="nav-link" onClick={() => this.onClick("/")}>{l.currentCalendar}</Nav.Item > : "" }
              { authService.isRegularRole() ? <Nav.Item className="nav-link"  onClick={() => this.onClick("/booking")}>{l.bookingCalendar}</Nav.Item > : "" }
              { authService.isSuperUserRole() ? <Nav.Item className="nav-link"  onClick={this.openAddUserModal}>{l.addUser}</Nav.Item> : "" }
              { authService.isPriviligedRole() ? <Nav.Item className="nav-link"  onClick={() => this.onClick("/users")}>{l.users}</Nav.Item > : "" }
              { authService.isPriviligedRole() ? <Nav.Item className="nav-link"  onClick={() => this.onClick("/summary-daily")}>{l.summaryDaily}</Nav.Item > : "" }
              { authService.isPriviligedRole() ? <Nav.Item className="nav-link"  onClick={() => this.onClick("/technician")}>{l.technicianCalendar}</Nav.Item > : "" }
              <Nav.Link className="show-mobile" onClick={this.openPasswordModal}>{l.changePassword}</Nav.Link>
              <Nav.Link className="show-mobile text-danger" onClick={this.onLogout}>{l.logout}</Nav.Link>
            </Nav>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-user">
                <i className="fas fa-user"></i>{authService.getUsername()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.openPasswordModal}>{l.changePassword}</Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item>
                  <Button variant="outline-danger" onClick={this.onLogout}>
                    <i className="fas fa-sign-out-alt"></i>{l.logout}
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
