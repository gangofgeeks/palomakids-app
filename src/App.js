import React, { Component } from 'react';
import { useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from '@material-table/core';

function App() {
  const [res, setRes] = useState([]);
  const columns = [
    { title: 'Day', field: 'day.S' },
    { title: 'Time', field: 'time.S' },
    { title: 'Kid1', field: 'kidNames.SS[0]' },
    { title: 'Kid2', field: 'kidNames.SS[1]' },
    { title: 'Kid3', field: 'kidNames.SS[2]' },
    { title: 'Kid4', field: 'kidNames.SS[3]' }
  ];
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


    useEffect(() => {
    fetchData();
    res.sort((a, b) => a.day.S - b.day.S)
  }, []);


  
    return (
      <div className="App">
     
      <MaterialTable  columns={columns} data={res} enableColumnActions={false}
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
      }}
      muiTableBodyRowProps={{ hover: false }} title='Basketball Lessons Schedule' />
    </div>
    );
  }

export default App;
