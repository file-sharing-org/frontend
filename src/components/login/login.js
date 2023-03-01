import React from "react";
import "./login.css";
import LoginForm from "./loginForm";
import Container from '@mui/material/Container';




function Login() {
	return (
		<Container maxWidth="sm" sx={{padding: '100px'}}>
				<LoginForm />
		</Container>
	);
}

export default Login;