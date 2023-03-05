import React from "react";
import {useState, useEffect} from "react";
import "./registerForm.css";
import {TextField, Paper, FormControl, Button} from "@mui/material";
import {Link} from "react-router-dom";
import { useForm, Controller} from "react-hook-form";




function RegisterForm() {
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isEmailDirty, setEmailDirty] = useState(false);
	const [isPasswordEquals, setPasswordEquals] = useState(false);
	const [isPasswordDity, setPasswordDirty] = useState(false);


	const [formValues, setFormValues] = useState({email:'', password1:'', password2:''});
	const checkEmail=()=> {
		
		if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formValues.email)) {
			// console.log("govno");
			setIsValidEmail(false);
		} else {
			setIsValidEmail(true);
		}
	}
	useEffect(()=>{
		checkEmail();
	},[formValues.email]);

	const checkPassword = ()=>{
		if(formValues.password1.length>0 && formValues.password2.length>0 && formValues.password2==formValues.password1) {
			setPasswordEquals(true);
		} else {
			setPasswordEquals(false);
		}
	}

	useEffect(()=>{
		console.log('effect');
		checkPassword();
	}, [formValues.password1, formValues.password2]);

	const handleInputChange = (e) => {
		setFormValues({
			...formValues, [e.target.name]: e.target.value
		});
	}

	const onSubmit = (e)=>{
		e.preventDefault();
		console.log("submit");
		setPasswordDirty(true);
		setEmailDirty(true);
		console.log(formValues);
		if(isValidEmail && isPasswordEquals) {
			//TODO
		}
	}
	

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<form onSubmit={onSubmit}>
				<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
					<TextField name='email' id='email' label="Почта" required
						onChange={(e)=>{handleInputChange(e);setEmailDirty(true);}} value={formValues.email}
						helperText={isEmailDirty&&!isValidEmail?"Неправильный формат почты":" "} error={isEmailDirty&&!isValidEmail}
						inputProps={{pattern: '[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+'}}/>
					
					<TextField name='password1' type="password" label="Пароль" onChange={(e)=>{handleInputChange(e);setPasswordDirty(true)}} value={formValues.password1} required error={isPasswordDity&&!isPasswordEquals}/>
					
					<TextField name='password2' type="password" label="Повторите пароль" helperText={isPasswordDity&&!isPasswordEquals?"Пароли не совпадают":" "} onChange={(e)=>{handleInputChange(e);}} value={formValues.password2} required error={isPasswordDity&&!isPasswordEquals}/>	
					
					<Button variant="contained" sx={{m: 1}} type="submit">Зарегистрироваться</Button>
					
				</FormControl>
			</form>
		</Paper>
		);
}

export default RegisterForm;