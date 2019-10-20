import React, { Component } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import authService from "../../services/authService";
import lang from "../../common/lang";

var t = lang().changePassword;
var c = lang().common;

class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    clearState() {
        this.setState(this.getDefaultState());
    }

    getDefaultState() {
        return {
            password: "",
            newPassword: "",
            alert: false,
            error: false,
            message: ""
        };
    }

    onSave() {
        authService
            .changePassword(this.state.password, this.state.newPassword)
            .then(res => {
                this.setState({
                    message: t.success,
                    error: false,
                    alert: true
                });
            })
            .catch(err => {
                var error = false;
                var message = "";
                var alert = true;

                switch (err.response.status) {
                    case 401:
                        error = true;
                        message = t.wrongPassword;
                        break;
                    default:
                        message = c.serverError;
                        error = true;
                        break;
                }
                this.setState({ error, message, alert });
            });
    }

    onChange(e) {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name]: value
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
                    <Modal.Title>{t.changePassword}</Modal.Title>
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
                        <Form.Control
                            type="password"
                            placeholder={c.password}
                            name="password"
                            value={this.state.password}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="password"
                            placeholder={t.newPassword}
                            name="newPassword"
                            value={this.state.newPassword}
                            onChange={this.onChange}
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

export default ChangePasswordModal;
