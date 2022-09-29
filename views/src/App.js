import './App.css';
import Axios from "axios";
import React,{useState,useEffect} from "react";
function App() {
  const [employeeName,setemplyoeeName]=useState("");
  const [employeePassword,setemplyoeePassword]=useState("");
  const [employeelist,setemployeelist]=useState([]);
  const [newemployeename,setnewemployeename]=useState("");
  const [newemployeePassword,setnewemployeePassword]=useState("");
  const addlist=()=>{
    Axios.post("http://localhost:3001/insert",{
      employeeName:employeeName,
    employeePassword:employeePassword,
  });
  };
  useEffect(()=>{
Axios.get("http://localhost:3001/read").then((Response)=>{
  setemployeelist(Response.data);
})
  },[])
  
  const deleteEmployee=(id)=>{
    Axios.get('http://localhost:3001/delete',{
      id:id,
    });
  };

  const updatedEmployee=(id)=>{
    Axios.put("http://localhost:3001/update",{
      id:id,
      newemployeename:newemployeename,
      newemployeePassword:newemployeePassword,

  });
  };
  return(

      <div className="App">
       <h1> crud Application </h1>
        <div className='form'>
          <label>Client Name: </label>
          <input type='text' name='name' onChange={(event)=>{setemplyoeeName(event.target.value)}}/>
          <label>Password: </label>
          <input type='text' name='Password' onChange={(event)=>{setemplyoeePassword(event.target.value)}}/>
  
          <button onClick={addlist}>Create</button>
          <h1>Employee List</h1>
          {/* {employeelist.map((value,key)=>{
            return(
              
           <div key={key} className="result">
           <h1>{value.employeeName}</h1><h1>{value.employeePassword}</h1>
           
           <input type="text" placeholder='setnewname' onChange={(event)=>{setnewemployeename(event.target.value)}}></input>
           <button onClick={()=>updatedEmployee(value._id)}>Update</button>
           <button onClick={()=>deleteEmployee(value._id)}>Delete</button>
           </div>
            )
          })} */}
        </div>

    </div>

  );
}

export default App;
