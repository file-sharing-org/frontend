import React from "react";
import "./loginForm.css";
import {TextField, Paper, FormControl, Button} from "@mui/material";
import {Link} from "react-router-dom";


function LoginForm() {
	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
				<TextField label="Логин"/>
				<TextField type="password" label="Пароль"/>
				<Button variant="contained" sx={{m: 1}}>Войти</Button>
				<div className="formlogin__label">
					Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
				</div>
			</FormControl>
		</Paper>
		);
}

export default LoginForm;