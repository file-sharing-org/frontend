import React from "react";
import {useState, useEffect, useRef} from "react";
import "./registerForm.css";
import {TextField, Paper, FormControl, Button} from "@mui/material";
import {Link} from "react-router-dom";
import { useForm, Controller} from "react-hook-form";
import Cookies from 'universal-cookie';
import axios from 'axios'



function RegisterForm() {
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isEmailDirty, setEmailDirty] = useState(false);
	const [isPasswordEquals, setPasswordEquals] = useState(false);
	const [isPasswordDity, setPasswordDirty] = useState(false);

	const passwordRef = React.createRef();
	const cookies = new Cookies();


	const [formValues, setFormValues] = useState({email:'', name:'', password:'', password_confirmation:''});
	const checkEmail=()=> {
		
		if(!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formValues.email)) {
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
		if(passwordRef.current==null) return;
		const psref = passwordRef.current.children[1].children[0];
		if(formValues.password.length>0 && formValues.password_confirmation.length>0 && formValues.password_confirmation==formValues.password) {
			setPasswordEquals(true);
			psref.setCustomValidity('');
		} else {
			setPasswordEquals(false);
			psref.setCustomValidity('Пароли не совпадают');
		}
	}

	useEffect(()=>{
		console.log('effect');
		checkPassword();
	}, [formValues.password, formValues.password_confirmation]);

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
			axios.post('http://127.0.0.1:8000/api/register',
				formValues,
				{headers: {'Content-Type': 'application/json'}})
			.then(response=>{
				const data = response['data'];
				if(data['status']==='success') {
					cookies.set('token', data['token']);	
				}
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}
	

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<form onSubmit={onSubmit}>
				<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
					<TextField name='email' id='email' label="Почта" required
						onChange={(e)=>{handleInputChange(e);setEmailDirty(true);}} value={formValues.email}
						helperText={isEmailDirty&&!isValidEmail?"Неправильный формат почты":" "} error={isEmailDirty&&!isValidEmail}
						type='email'/>

					<TextField name='name' label='Логин' required onChange={(e)=>{handleInputChange(e);}} value={formValues.name}/>
					
					<TextField name='password' type="password" label="Пароль" onChange={(e)=>{handleInputChange(e);setPasswordDirty(true)}} value={formValues.password1} required error={isPasswordDity&&!isPasswordEquals}/>
					
					<TextField ref={passwordRef} name='password_confirmation' type="password" label="Повторите пароль" helperText={isPasswordDity&&!isPasswordEquals?"Пароли не совпадают":" "} onChange={(e)=>{handleInputChange(e);}} value={formValues.password2} required error={isPasswordDity&&!isPasswordEquals}/>	
					
					<Button variant="contained" sx={{m: 1}} type="submit">Зарегистрироваться</Button>
					
				</FormControl>
			</form>
		</Paper>
		);
}

export default RegisterForm;