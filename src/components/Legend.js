import React, { Component } from "react";
import statusService from "../services/statusService";

class Legend extends Component {
    render() {
        var ids = this.props.ids || statusService.getAllStatusIds();
        return (
            <ul className="legenda">
                {ids.map(id => {
                    return (
                        <li key={"legend-item-"+id} className={statusService.getClassForStatusId(id)}>
                            <i className="fas fa-stop"></i>
                            <span>{statusService.getStatusDescriptionForStatusId(id)}</span>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default Legend;
