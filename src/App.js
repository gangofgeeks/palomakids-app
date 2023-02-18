import React, { Component } from 'react';
import { useState, useEffect} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import MaterialTable from '@material-table/core';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
Amplify.configure(awsExports);


function App({ signOut, user }) {
  
  const [res, setRes] = useState([]);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState([]);
  const [slots, setSlots] = useState([]);
   
   const [rowData, setRowData] = useState([]);

   const [modalInput, setModalInput] = useState({
       isOpen:false,
       date:''
   
   });

   const malav = [
    {value: 'Malav Srivastava',    text: 'Malav'   }
    

   
];
const dia = [
    {value: 'Diya Sharma',    text: 'Diya'   }
   
];

const myra = [
    {value: 'Myra Singhal',    text: 'Myra'   }
   
];
const sumay = [
    {value: 'Sumay',    text: 'Sumay'   }
   
];
const shivansh = [
    {value: 'Shivansh Pawar',    text: 'Shivansh'   }
   
];
const ishaan = [
    {value: 'Ishaan',    text: 'Ishaan'   }
   
];

const dhanvi = [
    {value: 'Dhanvi Desai',    text: 'Dhanvi'   }
   
];

const siya = [
    {value: 'Siya Sharma',    text: 'Siya'   },
    {value: 'Sara Sharma',    text: 'Sara'   }
   
];

const rohin = [
    {value: 'Rohin Singhal',    text: 'Rohin'   }
   
];

   const childrenParent = new Map();
   
   childrenParent.set("goyalmeghs01@gmail.com",myra);
   childrenParent.set("mohitsrivastava12@yahoo.co.in",malav);
   childrenParent.set("mayank.kaushal123@gmail.com",sumay);
   childrenParent.set("swapnilpawar.ibm@gmail.com",shivansh);
   childrenParent.set("varshuu21@yahoo.co.in",ishaan);
   childrenParent.set("hdesai_78@hotmail.com",dhanvi);
   childrenParent.set("vishal.sharma2003@gmail.com",siya);
   childrenParent.set("neelamsgl@gmail.com",rohin);
   childrenParent.set("deephpsharma@gmail.com",dia);
   
   

const [selectedName, setSelectedName] = useState([]);

  const columns = [
    { title: 'Date', field: 'dateOfEvent.S', },
    { title: 'Day', field: 'day.S', },
    {
    title: "Manage",
    field: "open_modal",
    editable: false,
    render: (rowData) =>
        (
        <button disabled={selectedName.length === undefined || selectedName.length<2} onClick={() => handleDialogOpen(rowData)}>Manage</button>
        )
    },
    { title: 'Time', field: 'timeOfEvent.S' },
    { title: 'Names', field: 'childrenNames.S' },
    { title: 'Already Paid', field: 'paidNames.S' },

    
    
  ];

  const handleChange=(event)=>{
    console.log(event.target.value);
    setSelectedName(event.target.value);
  }

  const fetchData = () => {
    console.log("The seleted one:"+selectedName);
    const api = 'https://7yr0xfh2j5.execute-api.us-east-2.amazonaws.com/beta';
    const data = { "name" : "Mike" };
    axios
      .post(api, data,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    crossDomain: true
  })
      .then((response) => {
        console.log(response);
        setRes(response.data.Items);
      })
      .catch((error) => {
        console.log(error);
      });
    }

      const addData = (rowData) => {
        console.log(rowData.dateOfEvent.S);
        var toAdd='';
        if(selectedName === undefined || selectedName == ''){
          setSuccess('');
          setError("Please select your child's name here");
          return;
        }
        else if(rowData.childrenNames === undefined || rowData.childrenNames.S === undefined || 
          rowData.childrenNames.S.length <2){
          console.log("Selected name is:"+selectedName);
          toAdd=selectedName;
        }
        else if((rowData.childrenNames.S).split(',').length>3){
            setSuccess('');
          setError("All 4 slots already booked.");
          return;
        }
        else if((rowData.childrenNames.S).includes(selectedName)){
            console.log("Already added:"+selectedName);
            toAdd=selectedName;
             setSuccess('');
            setError(selectedName +" Already in slot");
             setSuccess('');
            return;
        }
        
        else{
          console.log("All Added"+rowData.childrenNames.S+','+selectedName);
          toAdd=rowData.childrenNames.S+','+selectedName;

        }

        var map = new Map([
            ['date', rowData.dateOfEvent.S],
            ['day', rowData.day.S],
            ['time', rowData.timeOfEvent.S],
            ['names', toAdd],
            ['paidNames', rowData.paidNames?.S],
        ]);
        var obj = Object.fromEntries(map);
        var jsonString = JSON.stringify(obj);
        console.log(jsonString);
        addToSlot(jsonString,selectedName + " added to slot successfully");
    
    }




    const markPaid = (rowData) => {
        console.log(rowData.dateOfEvent.S);
        var toAdd='';
        if(selectedName === undefined || selectedName == ''){
           setSuccess('');
          setError("Please select your child's name here");

          return;
        }
        else if(rowData.childrenNames=== undefined || rowData.childrenNames.S === undefined ||
          rowData.childrenNames.S.length<2){
          console.log("No one in this slot, no payment needed:"+selectedName);
         setSuccess('');
        setError("No payment needed, you were not in the slot:"+selectedName);
          return;
        }
         else if(!(rowData.childrenNames.S).includes(selectedName)){
            console.log("No payment needed"+selectedName);
            toAdd=selectedName;
             setSuccess('');
            setError("No payment needed, you were not in the slot:"+selectedName);
            return;
        }
        else if(rowData.paidNames=== undefined || rowData.paidNames.S === undefined || 
          rowData.paidNames.S.length < 2){
          console.log("Selected name is:"+selectedName);
          toAdd=selectedName;
        }
        else if((rowData.paidNames.S).includes(selectedName)){
            console.log("Already Paid:"+selectedName);
            toAdd=selectedName;
             setSuccess('');
            setError(selectedName+" already paid for the slot");
            return;
        }
        
        else{
          console.log("All Added"+rowData.paidNames.S+', '+selectedName);
          toAdd=rowData.paidNames.S+','+selectedName;

        }

        var map = new Map([
            ['date', rowData.dateOfEvent.S],
            ['day', rowData.day.S],
            ['time', rowData.timeOfEvent.S],
            ['paidNames', toAdd],
            ['names', rowData.childrenNames.S],
        ]);
        var obj = Object.fromEntries(map);
        var jsonString = JSON.stringify(obj);
        console.log(jsonString);
        addToSlot(jsonString,selectedName + " paid successfully for slot");
    
    }



const closeModal=()=> {
      setModalInput({isOpen:false});
  }

    const removeData = (rowData) => {
        console.log(rowData.dateOfEvent.S);
        var toAdd='';
        if(selectedName === undefined || selectedName == ''){
           setSuccess('');
          setError("Please select child's name here");
          return;
        }
        else if(rowData.childrenNames=== undefined || rowData.childrenNames.S === undefined){
           setSuccess('');
          setError(selectedName+ " not in this slot");
          return;
          
        }
        else if((rowData.childrenNames.S).includes(selectedName)){
            console.log("To be removed:"+selectedName);
            const names=rowData.childrenNames.S.split(',');
            for (var i = 0; i < names.length; i++) {
              if(names[i] != selectedName && names[i].length>1){
                toAdd=  names[i] + ',';
              }
            }
    
        }
        else{
           setSuccess('');
          setError(selectedName+ " not in this slot");
          return;
        }

        var map = new Map([
            ['date', rowData.dateOfEvent.S],
            ['time', rowData.timeOfEvent.S],
            ['names', toAdd],
            ['paidNames', rowData.paidNames?.S],
            ['day', rowData.day.S],
        ]);
        var obj = Object.fromEntries(map);
        var jsonString = JSON.stringify(obj);
        console.log(jsonString);
        addToSlot(jsonString,selectedName + " removed from slot successfully");
    
    }



      const handleDialogOpen = (rowData) => {
        if(selectedName === undefined || selectedName.length<2){
          setError("Please select your child's name here");
          return;
        }
        setError('');
        setSuccess('');
        setRowData(rowData);
    setModalInput({isOpen: true, date: rowData.dateOfEvent.S,
      day:rowData.day.S,
      time:rowData.timeOfEvent.S,
      names:rowData.childrenNames.S,
      paidNames:rowData.paidNames.S,
    });
};
     const addToSlot = (data, message) => {
    const api = 'https://o6cja6tpcl.execute-api.us-east-2.amazonaws.com/beta';
    
    axios
      .post(api, data,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    crossDomain: true
  })
      .then((response) => {
        console.log(response);
        fetchSlots();
        setError('');
        setSuccess(message);
        closeModal();
        
      })
      .catch((error) => {
        console.log(error);
         setSuccess('');
        setError(error);
      });
    }


    const fetchSlots = () => {
    const api = 'https://o6cja6tpcl.execute-api.us-east-2.amazonaws.com/beta/getslots';
    const data = { "name" : "Mike" };
    axios
      .post(api, data,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    crossDomain: true
  })
      .then((response) => {
        console.log(response);
        const items = response.data.Items;
        const sortedItems = items.sort((a, b) => a.dateOfEvent.S.localeCompare (b.dateOfEvent.S));
        setSlots(sortedItems);
      })
      .catch((error) => {
        console.log(error);
      });
    }


    useEffect(() => {
      
    fetchData();
    fetchSlots();
    if(childrenParent.get(user.attributes.email) !=undefined){
     setSelectedName(childrenParent.get(user.attributes.email)[0].value);
    }
    
  }, []);


  
    return (

       

      <div className="App" id="screenFiller">

     <Modal
        isOpen={modalInput.isOpen}
        rowData={rowData}
        onRequestClose={closeModal}
        
        contentLabel="Manage kid for a slot"
      >
      <div align="center">
        <h2 style={{color:"orange"}}>Lesson on {modalInput.date},{modalInput.day} at {modalInput.time}</h2>

        
        <div style={{color: 'red'}}>
      
      <p>{error}</p>
    </div>

      <div style={{color: 'green'}}>
      
      <p>{success}</p>
    </div>

    <div align="center" >
         <button onClick={() => markPaid(rowData)}>Mark Slot as paid</button>
          </div>
          <br/>

          <img src={require('./people.png')}/>

    <table><tbody><tr>
        <td style={{color:"blue"}}>Child Name</td> <td> {selectedName}</td>
        </tr>
          <br/>
          <tr>
        <td style={{color:"blue"}}>Payment for slot </td> <td>{modalInput.names && 
          modalInput.names.split(',').length>3 ?'$15':'$20'}</td>
        </tr>
        <tr>
        <td style={{color:"blue"}}>Children in slot </td> <td>{modalInput.names}</td>
        </tr>
        <br/>
        <tr rowSpan="2">
        <td style={{color:"blue"}}>Slot Payent Done</td> <td>{modalInput.paidNames}</td>
        </tr>
        
         <br/>
         <br/>

          <tr rowSpan="2">
          <td style={{color:"green"}}><button style={{color:"green"}} onClick={() => addData(rowData)}>Add to Slot</button></td>
          <td style={{color:"red"}}><button style={{color:"red"}} onClick={() => removeData(rowData)}>Remove from Slot</button></td>
          </tr>
          <br/>
         
         
          </tbody>
          </table>
          <div align="center">
          <button onClick={closeModal}>close</button>
          </div>
        </div>
      </Modal>

       
      <div>
      <table><tr><td>
    <img width="100px"   src={require('./basketball.jpg')} /></td>
      <td><span><p align="center" style={{color:"darkorange"}}>
      Coach Name : Schwan Humes,   Contact(For Zelle) : 830-714-3486</p> </span> </td>
      </tr>
      </table>
      </div>

            <div style={{color: 'red'}}>
      
      <p>{error}</p>
    </div>

      <div style={{color: 'green'}}>
      
      <p>{success}</p>
    </div>
    <div style={{align: 'center'} }>
    <h1>Hello {user.attributes.name}</h1>
    <div>
    

    {(childrenParent.get(user.attributes.email) && childrenParent.get(user.attributes.email).length ==1) &&
       
          <label>
            Your enrolled child's name: <span style={{color:"darkorange"}}>{selectedName}</span>
                     </label>
        
      


      }


      {childrenParent.get(user.attributes.email) && childrenParent.get(user.attributes.email).length >1 &&
       
          <div className="select-container">
          <label> Select your child's name :
          <select  style={{color:"darkorange"}} onChange={handleChange}>
            {childrenParent.get(user.attributes.email).map((option) => (
              <option value={option.value}>{option.text}</option>
            ))}
          </select>
          </label>
        </div>
        
      


      }

      {(childrenParent.get(user.attributes.email) === undefined || childrenParent.get(user.attributes.email).length < 1) &&
            <label style={{color:"orange"}}> Your email is not associated with any enrolled kid </label>
          }
  


  </div>
  
  
   

          
      </div>
    
     

      <MaterialTable columns={columns} data={slots} enableColumnActions={false}
      enableColumnFilters={false}
      
      enableBottomToolbar={false}
      enableTopToolbar={false}
      options={{
        paging:true,
        pageSize:5,       // make initial page size
        emptyRowsWhenPaging: false,   // To avoid of having empty rows
        pageSizeOptions:[5,10,20,50],    // rows selection options
        headerStyle: { color: 'blue' } ,
        titleStyle: { color: 'orange' } 


      }}
      muiTableBodyRowProps={{ hover: false }} title='Basketball Lessons Schedule' />

      
     
      </div>
    
    );
  }

export default withAuthenticator(App);
