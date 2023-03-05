import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import FilePage from "./components/filePage";
import Login from "./components/login/login";
import Register from "./components/login/register";
import "./styles.css"


function App() {
  return (
      <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/file" element={<FilePage/>}/>
        <Route exact path="*" element={<Navigate to="/file"/>}/>
      </Routes>
  );
}

export default App;
