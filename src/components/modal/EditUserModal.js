import React, { Component } from "react";
import { Modal, Button, Form, Alert, ListGroup } from "react-bootstrap";
import lang from "../../common/lang";
import PropTypes from "prop-types";
import axios from "axios";
import authService from "../../services/authService";

var t = lang().editUser;
var c = lang().common;

class EditUserModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onUserSelected = this.onUserSelected.bind(this);
        this.removeSubdivision = this.removeSubdivision.bind(this);
        this.onSubSelected = this.onSubSelected.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    clearState() {
        this.setState(this.getDefaultState());
    }

    getDefaultState() {
        return {
            selectedUser: this.getDefaultUserState(),
            alert: false,
            error: false,
            message: ""
        };
    }

    getDefaultUserState() {
        return {
            first_name: "",
            last_name: "",
            role_id: -1,
            user_subdivisions: "",
            username_csr: "",
            user_id: -1,
            active: 0
        }
    }

    onSave() {
        var userToSave = this.state.selectedUser.username_csr;
        if (this.state.selectedUser.user_id > -1) {
            var postObject = Object.assign({}, this.state.selectedUser);
            postObject.subdivision_id = postObject.user_subdivisions;
            axios.post(`/users/${this.state.selectedUser.user_id}`, postObject)
                .then((res) => {
                    this.props.onUserSave(this.state.selectedUser);
                    this.setState({
                        selectedUser: this.getDefaultUserState(),
                        alert: true,
                        message: `Uzytkownik ${userToSave} zapisany prawidlowo`
                    })
                })
                .catch((err) => {
                    
                })
        }
    }

    onDelete() {
        var userToDelete = this.state.selectedUser.username_csr;
        if (this.state.selectedUser.user_id > -1) {
            axios.delete(`/users/${this.state.selectedUser.user_id}`)
                .then((res) => {
                    this.setState({
                        selectedUser: this.getDefaultUserState(),
                        alert: true,
                        message: `Uzytkownik ${userToDelete} usunięty`
                    })
                })
        }
    }

    onChange(e) {
        var target = e.target;
        
        var name = e.target.name;
        var value = e.target.value;
        var selectedUser = this.state.selectedUser;

        if (name == "active") {
            value = e.target.checked ? 1 : 0;
        } 

        selectedUser[name] = value;
 
        this.setState({
            selectedUser,
            alert: false
        });
    }

    onUserSelected(e) {
        var user_id = e.target.value;
        var selectedUser = Object.assign({},this.props.users.find((u) => {
            return u.user_id == user_id;
        }));

        this.setState({
            selectedUser
        })
    }

    removeSubdivision(id) {
        debugger;
        var selectedUser = this.state.selectedUser;
        var user_subdivisions = selectedUser.user_subdivisions;
        var newSubdivisions = user_subdivisions.split(",").map(parseInt).filter((s) => s !== id).join(',');

        

        selectedUser.user_subdivisions = newSubdivisions;
        
        this.setState({
            selectedUser
        })

    }

    onSubSelected(e) {
        var id = e.target.value;
        debugger;

        var selectedUser = this.state.selectedUser;
        var user_subdivisions = selectedUser.user_subdivisions;
        var newSubdivisions = user_subdivisions === "" ? [] : user_subdivisions.split(",");
        newSubdivisions.push(id);
        newSubdivisions = newSubdivisions.join(",");
        selectedUser.user_subdivisions = newSubdivisions;
        
        this.setState({
            selectedUser
        })
    }

    render() {
        console.log(this.state.selectedUser);
        return (
            <Modal
                show={this.props.show}
                onHide={() => {
                    this.clearState();
                    this.props.onClose();
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t.header}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.state.alert ? (
                        <Alert
                            variant={this.state.error ? "danger" : "success"}
                        >
                            {this.state.message}
                        </Alert>
                    ) : (
                        ""
                    )}
                    <Form.Group>
                        <Form.Control as="select" name="selectedUser" onChange={this.onUserSelected} value={this.state.selectedUser.user_id}>
                            <option disabled key={0} value={-1}>Wybierz uzytkownika</option>
                            { this.props.users.map((user,el) => 
                                <option key={el + 1} value={user.user_id}>{user.first_name + " " + user.last_name + " (" + user.username_csr + ")"}</option>    
                            )}
                        </Form.Control>
                    </Form.Group>
                    { this.state.selectedUser.user_id !== -1 ?
                        <>
                            <Form.Group>
                                <Form.Label>CSR</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={c.csr}
                                    name="username_csr"
                                    value={this.state.selectedUser.username_csr}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Imię</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={c.firstName}
                                    name="first_name"
                                    value={this.state.selectedUser.first_name}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nazwisko</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={c.lastName}
                                    name="last_name"
                                    value={this.state.selectedUser.last_name}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Telefon</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder={c.telephone}
                                    name="phone_num"
                                    value={this.state.selectedUser.phone_num}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                            <Form.Group>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Wybrani podwykonawcy</Form.Label>
                                <ListGroup>
                                    {
                                        this.props.subdivisions.filter((sub) => {
                                            var id = sub.subdivision_id;
                                            return this.state.selectedUser.user_subdivisions.split(',').map((el) => parseInt(el)).includes(id)
                                        }).map((sub) => {
                                            return <ListGroup.Item key={sub.subdivision_id}><i className="far fa-times-circle text-danger" onClick={() => this.removeSubdivision(sub.subdivision_id)}></i>{sub.subdivision_name}</ListGroup.Item>;
                                        })
                                    }
                                </ListGroup>
                                <Form.Control as="select" name="addNewSub" onChange={this.onSubSelected} value={"initial"}>
                                    <option disabled key={-1} value='initial'>Dodaj nowego podwykonawce</option>
                                    {
                                        this.props.subdivisions.filter((sub) => {
                                            var id = sub.subdivision_id;
                                            return !this.state.selectedUser.user_subdivisions.split(',').map((el) => parseInt(el)).includes(id)
                                        }).map((sub) => {
                                            return <option key={sub.subdivision_id} value={sub.subdivision_id}>{sub.subdivision_name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Rola</Form.Label>
                                <Form.Control as="select" name="role_id" onChange={this.onChange} value={this.state.selectedUser.role_id}>
                                        <option disabled key={0} value={-1}>Wybierz role</option>
                                        { this.props.roles.map((role,el) => 
                                            <option key={el + 1} value={role.role_id}>{role.role}</option>    
                                        )}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check type="checkbox" label="Aktywny" name="active" onChange={this.onChange} checked={this.state.selectedUser.active == 1} />
                            </Form.Group>
                            { authService.isSuperUserRole() ? <Form.Group>
                                <Button variant="danger" onClick={this.onDelete}>Usuń</Button>
                            </Form.Group> : "" }
                        </>
                        : "" }
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.clearState();
                            this.props.onClose();
                        }}
                    >
                        {c.close}
                    </Button>
                    <Button variant="primary" onClick={this.onSave}>
                        {c.save}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

EditUserModal.propTypes = {
    users: PropTypes.array,
    subdivisions: PropTypes.array,
    roles: PropTypes.array,
    onUserSave: PropTypes.func
};

export default EditUserModal;