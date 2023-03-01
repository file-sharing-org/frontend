import React from "react";
import RegisterForm from "./registerForm";
import Container from '@mui/material/Container';




function Register() {
	return (
		<Container maxWidth="sm" sx={{padding: '100px'}}>
				<RegisterForm />
		</Container>
	);
}

export default Register;