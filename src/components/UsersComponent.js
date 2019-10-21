import React, { Component } from "react";
import {
    Table,
    Container,
    Button,
    InputGroup,
    FormControl
} from "react-bootstrap";
import EditUserModal from "./modal/EditUserModal";
import l from "../common/lang";

var lang = l();

class UsersComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            search: "",
            user: {
                first_name: "",
                last_name: "",
                role_id: -1,
                user_subdivisions: "",
                username_csr: "",
                user_id: -1,
                active: 0
            },
            filtered: []
        };

        this.onEditUser = this.onEditUser.bind(this);
        this.hideEditUserModal = this.hideEditUserModal.bind(this);
        this.openEditUserModal = this.openEditUserModal.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onEditUser(user) {
        this.setState({
            modal: true,
            user: user
        });
    }

    openEditUserModal() {
        this.setState({
            modal: true
        });
    }

    hideEditUserModal() {
        this.setState({
            modal: false
        });
    }

    onSearch(e) {
        this.setState({
            search: e.target.value
        })
    }

    render() {
        var filtered = this.props.users.filter(user => {
            return user.first_name.indexOf(this.state.search) > -1|| 
            user.last_name.indexOf(this.state.search) > -1 || 
            user.username_csr.indexOf(this.state.search) > -1 ||
            user.phone_num.indexOf(this.state.search) > -1;
        });
        return (
            <>
                <h2>Uzytkownicy</h2>
                <div style={{ display: "flex" }}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                            <i className="fas fa-search"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder={lang.search}
                            aria-label="searchbox"
                            aria-describedby="basic-addon1"
                            onChange={this.onSearch}
                            value={this.state.search}
                        />
                    </InputGroup>
                </div>
                <div className="table-wrapper">
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>{lang.firstName}</th>
                                <th>{lang.lastName}</th>
                                <th>{lang.csr}</th>
                                <th>{lang.telephone}</th>
                                <th>{lang.active}</th>
                                <th>{lang.role}</th>
                                <th>{lang.subdivisions}</th>
                                <th>{lang.edit}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user, el) => {
                                return (
                                    <tr key={user.username_csr}>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.username_csr}</td>
                                        <td>{user.phone_num}</td>
                                        <td>
                                            {user.active === 1 ? "Tak" : "Nie"}
                                        </td>
                                        <td>{user.role}</td>
                                        <td>
                                            {user.user_subdivisions
                                                .split(",")
                                                .map(sub_id => {
                                                    var sub_id = sub_id.trim();
                                                    return this.props
                                                        .subdivisions[sub_id];
                                                })
                                                .join(",")}
                                        </td>
                                        <td>
                                            <Button
                                                variant="success"
                                                onClick={() =>
                                                    this.onEditUser(user)
                                                }
                                            >
                                                {lang.edit}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
                <EditUserModal
                    user={this.state.user}
                    onUserDelete={this.props.onUserDelete}
                    onUserSave={this.props.onUserChange}
                    subdivisions={this.props.subdivisions}
                    roles={this.props.roles}
                    show={this.state.modal}
                    onClose={this.hideEditUserModal}
                />
            </>
        );
    }
}

export default UsersComponent;
