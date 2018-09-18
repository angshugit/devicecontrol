import React, { Component } from "react";
import {Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
// import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table-next';


export default class DeviceList extends Component {
    constructor(props) {
        super(props);

      }

      state = {authenticatedUser: null, devices: null}

   componentDidMount(){
    console.log('component did mounty');

       if (this.props.history.location.state.user === 'parent'){
        this.setState({
            authenticatedUser: 'parent'
          });
       }
       // get list - /api/device-list
       axios.get('/api/device-list').then(response => {
           if (response.data.devices){
            this.setState({
                devices: response.data.devices
              });
           }
       });
   } // end of component will mount

   handleInsertButtonClick = (onClick) => {
    // Custom your onClick event here,
    // it's not necessary to implement this function if you have no any process before onClick
    console.log('This is my custom function for InserButton click event');
    onClick();
  }
   createCustomInsertButton = (onClick) => {
    // return (
    //   <InsertButton
    //     btnText='CustomInsertText'
    //     btnContextual='btn-warning'
    //     className='my-custom-class'
    //     btnGlyphicon='glyphicon-edit'
    //     onClick={ () => this.handleInsertButtonClick(onClick) }/>
    // );
  }
  render() {
    const products = [];

    function addProducts(quantity) {
      const startId = products.length;
      for (let i = 0; i < quantity; i++) {
        const id = startId + i;
        products.push({
          id: id,
          name: 'Item name ' + id,
          price: 2100 + i
        });
      }
    }

    addProducts(5);
    const  buttonFormatter = function(cell, row){
      return '<BootstrapButton type="submit"></BootstrapButton>';
    }

      //...
      const options = {
        insertBtn: this.createCustomInsertButton
      };
      // todo: redundant code
    //   const devices = this.state.devices ? this.state.devices : null;
      //TODO: MOVE THE ID SOMEWHERE
      const columns = [
        {
            dataField: 'id',
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

    return (


     <div>
         { this.state && this.state.devices &&
            <div>
            <BootstrapTable keyField='id' data={ this.state.devices } columns={ columns }
            striped={true}
            cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }/>
            </div>

         }

      </div>


    );
  }
}