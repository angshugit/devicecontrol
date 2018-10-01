// TODO: onClickToggleStatus use bind instead
// mention that EDIT is done on double click only
// CHANGE deviocename to deviceName
// GET RID OF EXTRA devices
// GET RID OF UNNECESSARY ITEMS IN STATE
// PUT BACK closeButton IN MODAL HEADER
// ADD FormControl and labelControl in modal
// CHANGE 'Paused' to 'paused' and same for 'unpaused'
//  show spinner toggling status
// how to get authenticated role

import React, { Component } from "react";
import { Button, Modal, ControlLabel, FormControl } from "react-bootstrap";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "./Login.css";
import "./DeviceList.css";

class DeviceList extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    userRole: null,
    devices: null,
    showAddDeviceModal: false,
    newDeviceName: "",
    newDeviceStatus: "Paused"
  };
  componentDidMount() {
    if (this.props.history.location && this.props.history.location.state.role) {
      this.setState({
        userRole: this.props.history.location.state.role
      });
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('authToken');
    axios
      .get("/v1/devices/")
      .then(response => {
        if (response.data.devices) {
          this.setState({
            devices: response.data.devices
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * adds new device
   */
  addNewDevice() {
    this.setState({ showAddDeviceModal: true });
  }
  /**
   * toggle device status on click of button
   * @param {*} cell
   * @param {*} row
   * @param {*} rowIndex
   */
  onClickToggleStatus(cell, row, rowIndex) {
    let toggleValue;
    const newStatus = this.state.devices.slice(); //copy the array
    if (cell.toUpperCase() === "UNPAUSED") {
      toggleValue = "PAUSED";
    } else {
      toggleValue = "UNPAUSED";
    }
    newStatus[rowIndex].status = toggleValue; //execute the manipulations
    this.setState({ devices: newStatus });
    axios
      .put(`/v1/devices/${row._id}`, {
        status: toggleValue
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * render button element to change status of the device
   * @param {*} cell
   * @param {*} row
   * @param {*} enumObject
   * @param {*} rowIndex
   */
  statusCellButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type="button"
        onClick={() => this.onClickToggleStatus(cell, row, rowIndex)}
      >
        {cell.toUpperCase()}
      </button>
    );
  }
  /**
   * renders delete button to delete device
   * @param {*} cell
   * @param {*} row
   * @param {*} enumObject
   * @param {*} rowIndex
   */
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
  /**
   * event handler to delete device
   * @param {*} cell
   * @param {*} row
   * @param {*} rowIndex
   */
  onClickDeleteDevices(cell, row, rowIndex) {
    let removedList = this.state.devices.filter(
      item => item.devicename !== row.devicename
    );
    this.setState({ devices: removedList });
    axios
      .delete(`/v1/devices/${row._id}`)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   *  save new data to database after user edits the cell
   * @param {*} param0
   * @param {*} cellName
   */
  onAfterSaveCell(row, cellName, cellValue) {
    axios
      .put(`/v1/devices/${row._id}`, {
        devicename: cellValue
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * handling devicename edit and save
   * @param {*} event
   */
  handleDeviceNameChange(event) {
    this.setState({ newDeviceName: event.target.value });
  }
  /**
   * handling device status edit and save
   * @param {*} event
   */
  handleDeviceStatusChange(event) {
    this.setState({ newDeviceStatus: event.target.value });
  }
  /**
   * save new device
   * @param {*} event
   */
  saveNewDevice(event) {
    axios
      .post("/v1/devices/", {
        devicename: this.state.newDeviceName,
        status: this.state.newDeviceStatus
      })
      .then(response => {
        if (response.data.devicename) {
          const data = response.data;
          const newdevice = {
            devicename: data.devicename,
            status: data.status,
            _id: data._id
          };
          this.setState(previousState => ({
            devices: [...this.state.devices, newdevice]
          }));
          this.setState({ showAddDeviceModal: false });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ showAddDeviceModal: false });
      });
  }

  render() {
    const role = this.state.userRole;
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
    const cellEditProp = {
      mode: "dbclick",
      blxurToSave: true,
      afterSaveCell: this.onAfterSaveCell
    };
    return (
      <div>
        {role === "admin" && this.state &&
          this.state.devices && (
            <div className="deviceListWrapper">
              <div className="row form-group">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      onClick={this.addNewDevice.bind(this)}
                      className="btn btn-info react-bs-table-add-btn "
                    >
                      <span>
                        <i className="glyphicon glyphicon-plus" />New
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <BootstrapTable
                cellEdit={cellEditProp}
                data={devices}
                tableHeaderClass={"colHidden"}
              >
                <TableHeaderColumn dataField="_id" hidden isKey hiddenOnInsert>
                  Device ID
                </TableHeaderColumn>
                <TableHeaderColumn dataField="devicename">
                  Device Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="status"
                  editable={false}
                  dataFormat={this.statusCellButton.bind(this)}
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
              <Modal show={this.state.showAddDeviceModal} container={this}>
                <Modal.Header>
                  <Modal.Title id="add-new-device-modal">
                    Add New Device
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modal-body">
                    <div className="form-group">
                      <ControlLabel>Device Name</ControlLabel>
                      <FormControl
                        type="text"
                        value={this.state.newDeviceName}
                        placeholder="Device Name"
                        onChange={this.handleDeviceNameChange.bind(this)}
                      />
                    </div>
                    <div className="form-group">
                      <ControlLabel>Device Status</ControlLabel>
                      <FormControl
                        componentClass="select"
                        placeholder="Select Status"
                        value={this.state.newDeviceStatus}
                        onChange={this.handleDeviceStatusChange.bind(this)}
                      >
                        <option value="Paused">Paused</option>
                        <option value="Unpaused">Unpaused</option>
                      </FormControl>
                    </div>
                  </div>
                </Modal.Body>
                <div className="modal-footer react-bs-table-inser-modal-footer">
                  <span>
                    <Button
                      className="btn btn-primary btn-large centerButton"
                      onClick={this.saveNewDevice.bind(this)}
                    >
                      Save
                    </Button>
                  </span>
                </div>
              </Modal>
            </div>
          )}
      </div>
    );
  }
}
export default DeviceList;
