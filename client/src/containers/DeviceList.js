import React, { Component } from "react";
import {Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
// import BootstrapTable from 'react-bootstrap-table';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
// import TableHeaderColumn from 'react-bootstrap-table';
import './DeviceList.css';
import update from 'immutability-helper';


// https://react-bootstrap-table.github.io/react-bootstrap-table2/


 class DeviceList extends Component {
    constructor(props) {
        super(props);

      }

      state = {authenticatedUser: null, devices: null}

   componentDidMount(){

       if (this.props.history.location.state.user === 'parent'){
        this.setState({
            authenticatedUser: 'parent'
          });
       }
       // get list - /api/device-list
       //axios.get('/api/device-list').then(response => {
       axios.get('/devices/').then(response => {
       //debugger;
           if (response.data.devices){
            this.setState({
                devices: response.data.devices
                //devices: response.data
              });
           }
       });
   } // end of component will mount
   onClickToggleStatus(cell, row, rowIndex){
     //TODO: show spinner toggling status
     // UPDATE STATUS BY BACK END CALL
    //  debugger;
    // const nextState = {...this.state.devices};
    const newStatus = this.state.devices.slice() //copy the array
    // const foo = Object.assign({}, this.state.devices, {status: 'further value'});
    //
    // this.setState({ids: newIds})
     if (cell.toUpperCase() === 'UNPAUSED'){
        cell = 'PAUSED';
        newStatus[0].status = 'PAUSED' //execute the manipulations
        this.setState({devices: newStatus});
     }else{
      cell = 'UNPAUSED';
     }
    // alert('Product #', rowIndex);
   }

   cellButton(cell, row, enumObject, rowIndex) {
    //  debugger;
    return (
       <button
          type="button"
          onClick={() =>
          this.onClickToggleStatus(cell, row, rowIndex)}
       >
       {cell.toUpperCase()}
       </button>
    )
 }

  render() {
      // debugger;

    const devices = this.state.devices ? this.state.devices : null;
      const columns = [
        {
            dataField: '_id',
            text: 'id'
        },
        {
        dataField: 'devicename',
        text: 'devicename'
      }, {
        dataField: 'status',
        text: 'status'
      }


    ];



    function buttonFormatter(cell, row){
      return '<div "><Button class="delbutton xtype="submit" bsStyle="primary" bsSize="large" block>Delete</Button></div>';
    }

    const cellEditProp = {
      mode: 'click',
      blurToSave: true
    };

    return (
      // TODO: add edit cell
      // add delete button
      // editable={ false }

     <div>
         { this.state && this.state.devices &&
            <div>
            <BootstrapTable data={ devices } cellEdit={ cellEditProp }>
          <TableHeaderColumn dataField='id' hidden isKey>Device  ID</TableHeaderColumn>
          <TableHeaderColumn dataField='devicename'>Device Name</TableHeaderColumn>
          <TableHeaderColumn dataField='status' editable={false} dataFormat={this.cellButton.bind(this)}>Device Status</TableHeaderColumn>
          {this.state.authenticatedUser && this.state.authenticatedUser  === 'parent' > 0 &&
        <TableHeaderColumn dataField="button" dataFormat={this.cellButton.bind(this)}>Buttons</TableHeaderColumn>
      }
          </BootstrapTable>
            </div>

         }

      </div>


    );
  }
}

export default DeviceList;
