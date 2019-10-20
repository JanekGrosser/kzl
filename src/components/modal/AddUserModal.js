import React, { Component } from "react";
import { Modal, Button, Form, Alert, ListGroup } from "react-bootstrap";
import l from "../../common/lang";
import PropTypes from "prop-types";
import axios from "axios";

var lang = l();

class AddUserModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onUserSelected = this.onUserSelected.bind(this);
        this.removeSubdivision = this.removeSubdivision.bind(this);
        this.onSubSelected = this.onSubSelected.bind(this);
    }

    clearState() {
        this.setState(this.getDefaultState());
    }

    getDefaultState() {
        return {
            newUser: this.getDefaultUserState(),
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
        };
    }

    onSave() {
        var userToSave = this.state.newUser.username_csr;
        if (this.state.newUser.user_id > -1) {
            var postObject = Object.assign({}, this.state.newUser);
            postObject.subdivision_id = postObject.user_subdivisions;
            axios
                .post(`/users/${this.state.newUser.user_id}`, postObject)
                .then(res => {
                    this.props.onUserSave(this.state.newUser);
                    this.setState({
                        newUser: this.getDefaultUserState(),
                        alert: true,
                        message: `Uzytkownik ${userToSave} zapisany prawidlowo`
                    });
                })
                .catch(err => {});
        }
    }

    onChange(e) {
        var target = e.target;

        var name = e.target.name;
        var value = e.target.value;
        var newUser = this.state.newUser;

        if (name == "active") {
            value = e.target.checked ? 1 : 0;
        }

        newUser[name] = value;

        this.setState({
            newUser,
            alert: false
        });
    }

    onUserSelected(e) {
        var user_id = e.target.value;
        var newUser = Object.assign(
            {},
            this.props.users.find(u => {
                return u.user_id == user_id;
            })
        );

        this.setState({
            newUser
        });
    }

    removeSubdivision(id) {
        debugger;
        var newUser = this.state.newUser;
        var user_subdivisions = newUser.user_subdivisions;
        var newSubdivisions = user_subdivisions
            .split(",")
            .map(parseInt)
            .filter(s => s !== id)
            .join(",");

        newUser.user_subdivisions = newSubdivisions;

        this.setState({
            newUser
        });
    }

    onSubSelected(e) {
        var id = e.target.value;
        debugger;

        var newUser = this.state.newUser;
        var user_subdivisions = newUser.user_subdivisions;
        var newSubdivisions =
            user_subdivisions === "" ? [] : user_subdivisions.split(",");
        newSubdivisions.push(id);
        newSubdivisions = newSubdivisions.join(",");
        newUser.user_subdivisions = newSubdivisions;

        this.setState({
            newUser
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
                    <Modal.Title>{lang.addUser}</Modal.Title>
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
                        <Form.Label>{lang.csr}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.csr}
                            name="username_csr"
                            value={this.state.newUser.username_csr}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.firstName}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.firstName}
                            name="first_name"
                            value={this.state.newUser.first_name}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.lastName}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={lang.lastName}
                            name="last_name"
                            value={this.state.newUser.last_name}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.telephone}</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder={lang.telephone}
                            name="phone_num"
                            value={this.state.newUser.phone_num}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group></Form.Group>
                    <Form.Group>
                        <Form.Label>{lang.chosenSubdivisions}</Form.Label>
                        <ListGroup>
                            {Object.keys(this.props.subdivisions)
                                .filter(sub_id => {
                                    return this.state.newUser.user_subdivisions
                                        .split(",")
                                        .map(el => parseInt(el))
                                        .includes(sub_id);
                                })
                                .map(sub_id => {
                                    return (
                                        <ListGroup.Item key={sub_id}>
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
                                {lang.addNewSubdivision}
                            </option>
                            {Object.keys(this.props.subdivisions)
                                .filter(sub_id => {
                                    return !this.state.newUser.user_subdivisions
                                        .split(",")
                                        .map(el => parseInt(el))
                                        .includes(sub_id);
                                })
                                .map(sub_id => {
                                    return (
                                        <option key={sub_id} value={sub_id}>
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
                            value={this.state.newUser.role_id}
                        >
                            <option disabled key={0} value={-1}>
                                {lang.chooseRole}
                            </option>
                            {Object.keys(this.props.roles).map(
                                (role_id, el) => (
                                    <option key={el + 1} value={role_id}>
                                        {this.props.roles[role_id]}
                                    </option>
                                )
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label={lang.active}
                            name="active"
                            onChange={this.onChange}
                            checked={this.state.newUser.active == 1}
                        />
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

AddUserModal.propTypes = {
    onAddUser: PropTypes.func
};

export default AddUserModal;
