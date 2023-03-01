import React from "react";
import {Route, Routes} from "react-router-dom";
import FilePage from "./components/filePage";
import Login from "./components/login/login";
import Register from "./components/login/register";
import "./styles.css"


function App() {
  return (
      <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="*" element={<FilePage/>}/>
      </Routes>
  );
}

export default App;
