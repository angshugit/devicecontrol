import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import {
  BootstrapTable,
  TableHeaderColumn,
  InsertButton
} from "react-bootstrap-table";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import "./DeviceList.css";
import update from "immutability-helper";

class DeviceList extends Component {
  constructor(props) {
    super(props);
  }

  state = { authenticatedUser: null, devices: null };

  componentDidMount() {
    if (this.props.history.location.state.user === "parent") {
      this.setState({
        authenticatedUser: "parent"
      });
    }
    axios.get("/devices/").then(response => {
      if (response.data.devices) {
        this.setState({
          devices: response.data.devices
        });
      }
    });
  }

  /**
   * toggle device status on click of button
   * @param {*} cell
   * @param {*} row
   * @param {*} rowIndex
   */
  onClickToggleStatus(cell, row, rowIndex) {
    //TODO: show spinner toggling status
    // UPDATE STATUS BY BACK END CALL
    let toggleValue;
    const newStatus = this.state.devices.slice(); //copy the array
    if (cell.toUpperCase() === "UNPAUSED") {
      toggleValue = "PAUSED";
    } else {
      toggleValue = "UNPAUSED";
    }
    newStatus[rowIndex].status = toggleValue; //execute the manipulations
    this.setState({ devices: newStatus });
    axios.put(`/devices/${row._id}`, {
      status: toggleValue
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });

  }

  cellButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type="button"
        onClick={() => this.onClickToggleStatus(cell, row, rowIndex)}
      >
        {cell.toUpperCase()}
      </button>
    );
  }

  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type="button"
        className="btn btn-warning react-bs-table-del-btn"
        onClick={() => this.onClickDeleteDevices(cell, row, rowIndex)}
      >
        <span>
          <i className="glyphicon glyphicon-trash" />Delete
        </span>
      </button>
    );
  }

  onClickDeleteDevices(cell, row, rowIndex) {
    let removedList = this.state.devices.filter(
      item => item.devicename !== row.devicename
    );
    this.setState({ devices: removedList });
    // TODO: make call to backlend to delete
    debugger;
    axios.delete(`/devices/${row._id}`)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleInsertButtonClick = onClick => {
    // Custom your onClick event here,
    // it's not necessary to implement this function if you have no any process before onClick
    console.log("This is my custom function for InserButton click event");
    onClick();
  };

  createCustomInsertButton = onClick => {
    return (
      <InsertButton
        btnText="CustomInsertText"
        btnContextual="btn-warning"
        className="my-custom-class"
        btnGlyphicon="glyphicon-edit"
        onClick={() => this.handleInsertButtonClick(onClick)}
      />
    );
  };
  onAfterInsertRow(item) {
    this.setState(prevState => ({
      // devices: prevState.devices.concat(item)
      devices: [...prevState.devices, item]
    }));
    debugger;
    // TODO: make an ajax call to add new device
  }

  render() {
    // debugger;

    const devices = this.state.devices ? this.state.devices : null;
    const columns = [
      {
        dataField: "_id",
        text: "_id"
      },
      {
        dataField: "devicename",
        text: "devicename"
      },
      {
        dataField: "status",
        text: "status"
      }
    ];

    // function buttonFormatter(cell, row) {
    //   return '<div "><Button class="delbutton xtype="submit" bsStyle="primary" bsSize="large" block>Delete</Button></div>';
    // }

    //   <button
    //   type="button"
    //   onClick={() => this.onClickToggleStatus(cell, row, rowIndex)}
    // >
    //   {cell.toUpperCase()}
    // </button>
    function deleteFormatter() {
      return '<button type="button" class="btn btn-warning react-bs-table-del-btn"><span><i class="glyphicon glyphicon-trash">Delete</span></button>';
    }

    function buttonFormatter(cell, row) {
      return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
    }

    const cellEditProp = {
      mode: "click",
      blurToSave: true
    };
    const options = {
      insertBtn: this.createCustomInsertButton,
      afterInsertRow: this.onAfterInsertRow.bind(this)
    };

    return (
      <div>
        {this.state &&
          this.state.devices && (
            <div>
              <BootstrapTable
                options={options}
                data={devices}
                cellEdit={cellEditProp}
                insertRow={true}
              >
                <TableHeaderColumn dataField="_id" hidden isKey>
                  Device ID
                </TableHeaderColumn>
                <TableHeaderColumn dataField="devicename">
                  Device Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="status"
                  editable={false}
                  dataFormat={this.cellButton.bind(this)}
                >
                  Device Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="button"
                  editable={false}
                  dataFormat={this.deleteButton.bind(this)}
                  hiddenOnInsert
                >
                  Delete
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          )}
      </div>
    );
  }
}

export default DeviceList;
