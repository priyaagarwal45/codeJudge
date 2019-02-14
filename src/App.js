import React, { Component } from 'react';
import logo from './logo.svg';
import "antd/dist/antd.css";
import './App.css';
import { Table, Row, Col, Layout, Input, Button, Modal, Select, Form, Icon } from "antd";
import { Link, Redirect, withRouter } from "react-router-dom";
import axios from 'axios';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { Header, Sider, Content } = Layout;
let datalist = [];


class App extends Component {

 columns = [{
    title: 'Firstname',
    dataIndex: 'first_name',
    key: 'first_name',
  }, {
    title: 'Lastname',
    dataIndex: 'last_name',
    key: 'last_name',
  }, {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: 'Location Type',
    dataIndex: 'location_type',
    key: 'location_type',
  }, {
    title: 'Location',
    dataIndex: 'location_string',
    key: 'location_string',
  }, {
    title:"Action",
    key:"action",
    dataIndex:"id",
    render: (id) => (
      <div>
  <Button style={{ marginRight: 10 + "px"}} onClick={(e)=>{e.stopPropagation(); this.showModal(id)}} icon="edit"></Button>
  <Button icon="delete" onClick={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                         confirm({
                            title: 'Are you sure to delete this person?',
                            content: '',
                            okText: 'Yes',
                            okType: 'danger',
                            cancelText: 'No',
                            onOk() {
                              
                              },
                            onCancel() {
                              console.log('Cancel');
                            },
                          });
                        }}></Button></div>
    )
  }];
  
  constructor() {
		super();
		this.state = {
      showTable: false,
      showForm : true,
      first_name : "",
      last_name : "",
      mobile : "",
      email : "",
      location_type : "",
      location_string : "",
      status : "",
      communication : "",
      id : ""
		};
  }	
  state = { visible: false }

  showModal = (id) => {
    this.setState({
      visible: true,
      id : id,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleSubmit = () => {
    var log ={ 
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      mobile:this.state.mobile,
      email:this.state.email,
      location_type:this.state.location_type,
      location_string:this.state.location_string
    }
    return new Promise(resolve => {
      axios
          .post("http://18.233.115.218:8100/api/leads",log,{crossDomain:true,
          xDomainRequest:true,
          withCredentials:true,
          headers: { "Content-Type": "application/json" }
        })
        
        .then(resp => {
          if(resp.status === 200){
          console.log(resp.data);
          }
          else{
            Modal.error({
              title: 'Error!',
              content: resp.message,
            });
          }
        })
    })
  };

  filered = () => {
    return new Promise(resolve => {
      axios
        .get("http://18.233.115.218:8100/api/leads/?location_string=India ")
        .then(resp => {
          if (resp.status === 200) {
            this.list = [] ; 
            if (resp.data.length > 0) {
              resp.data.map((value, index) => {
                this.listobject = {
                  key: index + 1,
                  id: value.id,
                  updated_at: value.updated_at,
                  created_at: value.created_at,
                  first_name: value.first_name,
                  last_name: value.last_name,
                  mobile: value.mobile,
                  email: value.email,
                  location_type: value.location_type,
                  location_string: value.location_string,
                  status: value.status,
                  communication: value.communication,
                  tags: value.tags
                }
                this.list.push(this.listobject);
              })
            }
            this.datalist = this.list;
          }
          else{
            Modal.error({
              title: 'Error!',
              content: resp.message,
            });
          }
        })
    })
  };

  update = (id) => {
    return new Promise(resolve => {
      var data = {
        status:this.state.status,
        Comminication:this.state.communication
      }
      axios
      .put(`http://18.233.115.218:8100/api/leads/${id}`,data,{crossDomain:true,
      headers: { "Content-Type": "application/json" }
      })
      .then(resp => {
        if(resp.status === 200){
        console.log(resp.data);
        }
        else{
          Modal.error({
            title: 'Error!',
            content: resp.message,
          });
        }
      })
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    
    var showTable = {
			display: this.state.showTable ? "block" : "none"
    };
    var showForm = {
			display: this.state.showForm ? "block" : "none"
		};

    return (
      <div className="App">
      <div style={showForm}>
      <h1>Form</h1>
        <Form className="Dashboard-form" onSubmit={e =>
                            this.handleSubmit(e, this.props.form)
                        }>
          <FormItem>
            {getFieldDecorator("first_name", {
              rules: [
                { required: true, message: "Please input your First name" }
              ]
            })(
              <Input
                type="text"
                placeholder="Firstname"
                onChange={(e) => this.setState({ first_name: e.target.value })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("last_name", {
              rules: [
                { required: true, message: "Please input your lastname" }
              ]
            })(
              <Input
                type="text"
                placeholder="Lastname"
                onChange={(e) => this.setState({ last_name: e.target.value })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("mobile", {
              rules: [
                { required: true, message: "Please input your mobile no." }
              ]
            })(
              <Input
                type="text"
                placeholder="Mobile No."
                onChange={(e) => this.setState({ mobile: e.target.value })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "Please input your email" }
              ]
            })(
              <Input
                type="email"
                placeholder="Email-id"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("location_type", {
              rules: [
                { required: true, message: "Please input your location type" }
              ]
            })(<Select placeholder="Location type" style={{color:"white"}} value={this.state.location_type} onChange={(e) => this.setState({ location_type: e })}>
               <Option value = ' '>Location type</Option>
              <Option value = 'Country'>Country</Option>
              <Option value = 'City'>City</Option>
              <Option value = 'Zip'>Zip</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("location_string", {
              rules: [
                { required: true, message: "Please input your location" }
              ]
            })(
              <Input
                type="text"
                placeholder="Location"
                onChange={(e) => this.setState({ location_string: e.target.value })}
              />
            )}
          </FormItem>
          <FormItem>
            <Row>
              <Col span={12} className="left-area" >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={()=>{ this.handleSubmit(); this.setState({first_name :"",last_name:"",mobile:"",email:"",location_type:"",location_string:""})}}
                >
                  Send
                    </Button>
              </Col>
  
              <Col span={12} className="left-area" >
                <Button
                  type="primary"
                  className="login-form-button"
                  onClick={() => {this.filered(); this.setState({showTable : true, showForm: false})}}
                  >
                  List by location
                    </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        </div>
            <div className = "list" style = {showTable}>
        <Table columns={this.columns} dataSource={this.datalist} />
        <Button  onClick={() => {this.setState({showTable : false, showForm: true})}}>Back to Form</Button>
        </div>
        <Modal
          title="Edit information"
          visible={this.state.visible}
          onOk={()=>{this.update(this.state.id); this.handleOk()}}
          onCancel={this.handleCancel}
        >
         <Input style={{color:"black"}} type="text" placeholder="Status" value={this.state.status} onChange={(e) => this.setState({ status: e.target.value })}/>
         <Input  style={{color:"black",marginTop:10+'px'}} type="text" placeholder="Communication"  value={this.state.communication} onChange={(e) => this.setState({ communication: e.target.value })}/>
        </Modal>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(App);
export default WrappedNormalLoginForm;
