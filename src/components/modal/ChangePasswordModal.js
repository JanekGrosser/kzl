import React, { Component } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import authService from "../../services/authService";
import l from "../../common/lang";
import stringUtil from "../../util/stringUtil";

var lang = l();

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
                    message: lang.passwordChanged,
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
                        message = lang.wrongPassword;
                        break;
                    default:
                        message = lang.serverError;
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
                    <Modal.Title>{lang.changePassword}</Modal.Title>
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
                            placeholder={lang.password}
                            name="password"
                            value={this.state.password}
                            onChange={this.onChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="password"
                            placeholder={lang.newPassword}
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

export default ChangePasswordModal;
