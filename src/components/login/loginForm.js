import React from "react";
import "./loginForm.css";
import {TextField, Paper, FormControl, Button, FormHelperText} from "@mui/material";
import {Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import {useState, useEffect} from "react";

function LoginForm() {

	const [formValues, setFormValues] = useState({username: '', password:''});
	const [error, setError] = useState(false);

	const handleInputChange = (e) => {
		setFormValues({
			...formValues, [e.target.name]: e.target.value
		});
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formValues);
	}

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<form onSubmit={handleSubmit}>
				<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
					<TextField id='username' name='username' label="Логин" onChange={handleInputChange} value={formValues.username}/>
					<TextField name='password' type="password" label="Пароль" onChange={handleInputChange} value={formValues.password}/>
					<FormHelperText error>{error?'Неверные данные':' '}</FormHelperText>
					<Button variant="contained" sx={{m: 1}} type='submit'>Войти</Button>
					<div className="formlogin__label">
						Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
					</div>
				</FormControl>
			</form>
		</Paper>
		);
}

export default LoginForm;