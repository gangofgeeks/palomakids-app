import React, { Component } from 'react';
import { useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from '@material-table/core';


function App() {
  
  const [res, setRes] = useState([]);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState([]);
  const [slots, setSlots] = useState([]);
   const [selectedName, setSelectedName] = useState([]);

   const childrenNames = [
  { value: 'Dia Sharma', label: 'Dia' },
  { value: 'Ishaan', label: 'Ishaan' },
  { value: 'Malav Srivastava', label: 'Malav' }
]

  const columns = [
    { title: 'Date', field: 'dateOfEvent.S', },
    { title: 'Day', field: 'day.S', },

    { title: 'Time', field: 'timeOfEvent.S' },
    { title: 'Names', field: 'childrenNames.S' },
    { title: 'Already Paid', field: 'paidNames.S' },

    
     {
    title: "Custom Add",
    field: "internal_action",
    editable: false,
    render: (rowData) =>
        (
        <button
            color="secondary"
            onClick={() => addData(rowData)}   > Add Me    </button>
        )
    },

    {
    title: "Custom Remove",
    field: "remove",
    editable: false,
    render: (rowData) =>
        (
        <button
            color="secondary"
            onClick={() => removeData(rowData)}   > Remove Me    </button>
        )
    },
    {
    title: "Payment",
    field: "paid",
    editable: false,
    render: (rowData) =>
        (
        <button
            color="secondary"
            onClick={() => markPaid(rowData)}   > Mark as Paid</button>
        )
    }
  ];

  const handleChange=(event)=>{
    console.log(event.target.value);
    setSelectedName(event.target.value);
  }

  const fetchData = () => {
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
        else if(rowData.paidNames=== undefined || rowData.paidNames.S === undefined){
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
          console.log("All Added"+rowData.paidNames.S+','+selectedName);
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
                toAdd= '\"' + names[i] + '\"'+',';
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
        setSlots(response.data.Items);
      })
      .catch((error) => {
        console.log(error);
      });
    }


    useEffect(() => {
    fetchData();
    fetchSlots();
    res.sort((a, b) => a.day.S - b.day.S)
  }, []);


  
    return (
      <div className="App">
      <img src={require('./basketball.jpg')} width="40%"/>

            <div style={{color: 'red'}}>
      
      <p>{error}</p>
    </div>

      <div style={{color: 'green'}}>
      
      <p>{success}</p>
    </div>
    <div style={{align: 'center'} }>
            <select style={{color: 'blue'} }onChange={(e:Event) => handleChange(e)}>
            <option value="">Select your child name</option>
            <option value="Dia Sharma">Dia</option>
            <option value="Dhanvi Desai">Dhanvi</option>
            <option value="Ishaan">Ishaan</option>
  <option value="Malav Srivastava">Malav</option>
  <option value="Myra Singhal">Myra</option>
  <option value="Rohin Singhal">Rohin</option>
  <option value="Shivansh Pawar">Shivansh</option>
  <option value="Sumay">Sumay</option>

  
  
  
   
</select>
          
      </div>
    
     

      <MaterialTable  columns={columns} data={slots} enableColumnActions={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      options={{
        paging:true,
        pageSize:6,       // make initial page size
        emptyRowsWhenPaging: false,   // To avoid of having empty rows
        pageSizeOptions:[6,12,20,50],    // rows selection options
        headerStyle: { color: 'blue' } ,
        titleStyle: { color: 'orange' } ,


      }}
      muiTableBodyRowProps={{ hover: false }} title='Basketball Lessons Schedule' />

      <div>
      <p>Coach - Contact Number</p>
      </div>
     
      </div>
    
    );
  }

export default App;
