import React, { Component } from "react";
import { Modal, Button, Form, Alert, ListGroup } from "react-bootstrap";
import l from "../../common/lang";
import PropTypes from "prop-types";
import axios from "axios";
import util from "../../util";

var lang = l();

class EditUserModal extends Component {

    static getDerivedStateFromProps(props,state) {
        props.user.user_subdivisions = props.user.user_subdivisions.split(",").map((sub) => sub.trim()).join(",");
        return Object.assign({}, state, {
            selectedUser: props.user
        })
    }

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
            selectedUser: this.props.user,
            alert: false,
            error: false,
            message: ""
        };
    }

    onSave() {
        var userToSave = this.state.selectedUser.first_name + " " + this.state.selectedUser.last_name;
        if (this.state.selectedUser.user_id > -1) {
            var postObject = Object.assign({}, this.state.selectedUser);
            postObject.subdivision_id = postObject.user_subdivisions;
            axios
                .post(`/users/${this.state.selectedUser.user_id}`, postObject)
                .then(res => {
                    this.props.onUserSave(this.state.selectedUser);
                    this.setState({
                        alert: true,
                        error: false,
                        message: util.format(lang.userEdited, userToSave)
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        alert: true,
                        error: true,
                        message: util.format(lang.userEditError, userToSave)
                    })
                });
        }
    }

    onDelete() {
        var userToDelete = this.state.selectedUser.first_name + " " + this.state.selectedUser.last_name;
        if (this.state.selectedUser.user_id > -1) {
            axios
                .delete(`/users/${this.state.selectedUser.user_id}`)
                .then(res => {
                    this.props.onUserDelete(this.state.selectedUser);
                    this.setState({
                        alert: true,
                        message: util.format(lang.userDeleted, userToDelete)
                    });
                })
                .catch((err) => {
                    console.error(err);
                    this.setState({
                        alert: true,
                        error: true,
                        message: util.format(lang.userDeleteError, userToDelete)
                    })
                })
        }
    }

    onChange(e) {

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
        var selectedUser = Object.assign(
            {},
            this.state.selectedUsers.find(u => {
                return u.user_id == user_id;
            })
        );

        this.setState({
            selectedUser
        });
    }

    removeSubdivision(id) {
        var selectedUser = this.state.selectedUser;
        var user_subdivisions = selectedUser.user_subdivisions;
        var newSubdivisions = user_subdivisions
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== id)
            .join(",")
            .trim();

        selectedUser.user_subdivisions = newSubdivisions;

        this.setState({
            selectedUser
        });
    }

    onSubSelected(e) {
        var id = e.target.value;

        var selectedUser = this.state.selectedUser;
        var user_subdivisions = selectedUser.user_subdivisions;
        var newSubdivisions =
            user_subdivisions === "" ? [] : user_subdivisions.split(",");
            
        newSubdivisions.map(sub => sub.trim());
        newSubdivisions.push(id);
        newSubdivisions = newSubdivisions.join(",");
        newSubdivisions.trim();
        selectedUser.user_subdivisions = newSubdivisions;

        this.setState({
            selectedUser
        });
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={() => {
                    this.clearState();
                    this.props.onClose();
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{lang.editUser}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>{lang.csr}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.csr}
                            name="username_csr"
                            value={this.state.selectedUser.username_csr}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.firstName}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.firstName}
                            name="first_name"
                            value={this.state.selectedUser.first_name}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.lastName}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.lastName}
                            name="last_name"
                            value={this.state.selectedUser.last_name}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.telephone}</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder={lang.telephone}
                            name="phone_num"
                            value={this.state.selectedUser.phone_num}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group></Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.chosenSubdivisions}</Form.Label>
                        <ListGroup>
                            {Object.keys(this.props.subdivisions)
                                .filter(sub_id => {
                                    return this.state.selectedUser.user_subdivisions
                                        .split(",")
                                        .includes(sub_id);
                                })
                                .map(sub_id => {
                                    return (
                                        <ListGroup.Item
                                            key={sub_id}
                                        >
                                            <i
                                                className="far fa-times-circle text-danger"
                                                onClick={() =>
                                                    this.removeSubdivision(
                                                        sub_id
                                                    )
                                                }
                                            ></i>
                                            {this.props.subdivisions[sub_id]}
                                        </ListGroup.Item>
                                    );
                                })}
                        </ListGroup>
                        <Form.Control
                            as="select"
                            name="addNewSub"
                            onChange={this.onSubSelected}
                            value={"initial"}
                        >
                            <option disabled key={-1} value="initial">
                                {lang.addNewSubdivision}}
                            </option>
                            {Object.keys(this.props.subdivisions)
                                .filter(sub_id => {
                                    return !this.state.selectedUser.user_subdivisions
                                        .split(",")
                                        .includes(sub_id);
                                })
                                .map(sub_id => {
                                    return (
                                        <option
                                            key={sub_id}
                                            value={sub_id}
                                        >
                                            {this.props.subdivisions[sub_id]}
                                        </option>
                                    );
                                })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.role}</Form.Label>
                        <Form.Control
                            as="select"
                            name="role_id"
                            onChange={this.onChange}
                            value={this.state.selectedUser.role_id}
                        >
                            <option disabled key={0} value={-1}>
                                {lang.chooseRole}
                            </option>
                            {Object.keys(this.props.roles).map((role_id, el) => (
                                <option key={el + 1} value={role_id}>
                                    {this.props.roles[role_id]}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label={lang.active}
                            name="active"
                            onChange={this.onChange}
                            checked={this.state.selectedUser.active == 1}
                        />
                    </Form.Group>
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
                        <Button variant="danger" onClick={this.onDelete}>
                            {lang.deleteUser}
                        </Button>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.clearState();
                            this.props.onClose();
                        }}
                    >
                        {lang.close}
                    </Button>
                    <Button variant="primary" onClick={this.onSave}>
                        {lang.save}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

EditUserModal.propTypes = {
    user: PropTypes.object,
    subdivisions: PropTypes.object,
    roles: PropTypes.object,
    onUserSave: PropTypes.func,
    onUserDelete: PropTypes.func
};

export default EditUserModal;
