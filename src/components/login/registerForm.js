import React from "react";
import {useState, useEffect} from "react";
import "./registerForm.css";
import {TextField, Paper, FormControl, Button} from "@mui/material";
import {Link} from "react-router-dom";


function RegisterForm() {
	const [email, setEmail] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isEmailDirty, setEmailDirty] = useState(false);
	const [isPasswordEquals, setPasswordEquals] = useState(false);
	const [isPasswordDity, setPasswordDirty] = useState(false);
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');	
	const checkEmail=()=> {
		
		if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
			// console.log("govno");
			setIsValidEmail(false);
		} else {
			setIsValidEmail(true);
		}
	}
	useEffect(()=>{
		checkEmail();
	},[email]);

	const checkPassword = ()=>{
		if(password1.length>0 && password2.length>0 && password2==password1) {
			setPasswordEquals(true);
		} else {
			setPasswordEquals(false);
		}
	}

	useEffect(()=>{
		console.log('effect');
		checkPassword();
	}, [password1, password2]);

	const onSubmit = ()=>{
		console.log("submit");
		setPasswordDirty(true);
		setEmailDirty(true);
		if(isValidEmail && isPasswordEquals) {
			//TODO
		}
	}
	

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<form onSubmit={()=>onSubmit()}>
				<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
					<TextField label="Почта" required onChange={(e)=>{setEmail(e.target.value);setEmailDirty(true);}} value={email} helperText={isEmailDirty&&!isValidEmail?"Неправильный формат почты":" "} error={isEmailDirty&&!isValidEmail}/>
					
					<TextField type="password" label="Пароль" onChange={(e)=>{setPassword1(e.target.value);setPasswordDirty(true);}} value={password1} required error={isPasswordDity&&!isPasswordEquals}/>
					
					<TextField type="password" label="Повторите пароль" helperText={isPasswordDity&&!isPasswordEquals?"Пароли не совпадают":" "} onChange={(e)=>{setPassword2(e.target.value);}} value={password2} required error={isPasswordDity&&!isPasswordEquals}/>	
					
					<Button variant="contained" sx={{m: 1}} onClick={onSubmit}>Зарегистрироваться</Button>
					<input type="submit" style={{display:'none'}}/>
				</FormControl>
			</form>
		</Paper>
		);
}

export default RegisterForm;