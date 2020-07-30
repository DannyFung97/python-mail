import React, { Component } from 'react';
import { Table, Button } from 'reactstrap'
import ReactNotifications from 'react-notifications-component';
import { store } from 'react-notifications-component';
import $ from 'jquery'
import 'react-notifications-component/dist/theme.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.list = [{
      task: 'a',
      assignee: 'b',
      date: 'c',
      email: 'd'
      //sample list
    }]
    this.sendMail = this.sendMail.bind(this)
    this.notification_sentMail = this.notification_sentMail.bind(this)
    this.notification_failMail = this.notification_failMail.bind(this)
  }

  //when the app first starts up
  componentDidMount() {
    $.ajax({
      type: "POST",
      url: "/getAllTasks/",
      data: {},
      success: (info) => {
        this.list = info
      }
    });
  }

  //send email via ajax and python
  sendMail() {
    document.getElementById('emailButton').disabled = true;
    $.ajax({
      type: "POST",
      url: "/function/",
      data: {},
      success: (isSent) => {
        console.log(isSent)
        document.getElementById('emailButton').disabled = false;
        if (isSent) { this.notification_sentMail() }
        else { this.notification_failMail() }
      },
      error: () => {
        document.getElementById('emailButton').disabled = false;
        this.notification_failMail()
      }
    });
  }

  //mail sent
  notification_sentMail() {
    store.addNotification({
      title: "Email Sent",
      message: "Assignee has received the email.",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "zoomIn"],
      animationOut: ["animated", "zoomOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }

  //mail not sent
  notification_failMail() {
    store.addNotification({
      title: "Email could not be sent",
      message: "Something happened that prevented the email from sending.",
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "zoomIn"],
      animationOut: ["animated", "zoomOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }

  render() {
    return (
      <div>
        <ReactNotifications />
        <div id='table'>
          <Table responsive bordered id='table'>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Date</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {this.list.length > 0 ? (
                this.list.map((object, i) => {
                  return <tr key={i}>
                    <th className="t-id" scope="row" row={i}>{object.task}</th>
                    <td>{object.assignee}</td>
                    <td>{object.date}</td>
                    <td>{<Button id='emailButton' color="success" onClick={() => this.sendMail(object.email)}>Send Mail</Button>}</td>
                  </tr>
                })
              ) : null
              }
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;