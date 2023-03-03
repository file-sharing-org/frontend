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
	const checkEmail=(event)=> {
		setEmailDirty(true);
		if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)) {
			// console.log("govno");
			setIsValidEmail(false);
		} else {
			setIsValidEmail(true);
		}
	}

	const checkPassword = ()=>{
		setPasswordDirty(true);
		if(password2==password1) {
			setPasswordEquals(true);
		} else {
			setPasswordEquals(false);
		}
	}

	useEffect(()=>{
		checkPassword();
	}, [password1, password2]);

	const onSubmit = ()=>{
		if(isValidEmail && isPasswordEquals) {
			//TODO
		}
	}
	

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
				{!isEmailDirty||isValidEmail ? <TextField label="Почта" required onBlur={checkEmail} onChange={(e)=>setEmail(e.target.value)} value={email} helperText=" "/>
							  : <TextField label="Почта" required onBlur={checkEmail} onChange={(e)=>setEmail(e.target.value)} value={email} error helperText="Неправильный формат почты"/>}
				{!isPasswordDity||isPasswordEquals?	
					<TextField type="password" label="Пароль" onChange={(e)=>{setPassword1(e.target.value);}} value={password1} required />
				:
					<TextField type="password" label="Пароль" onChange={(e)=>{setPassword1(e.target.value);}} value={password1} required error/>
				}
				{!isPasswordDity||isPasswordEquals?
					<TextField type="password" label="Повторите пароль" helperText=" " onChange={(e)=>{setPassword2(e.target.value);}} value={password2} required/>	
				:
					<TextField type="password" label="Повторите пароль" helperText="Пароли не совпадают" onChange={(e)=>{setPassword2(e.target.value);}} value={password2} required error/>
				}
				<Button variant="contained" sx={{m: 1}} onClick={onSubmit}>Зарегистрироваться</Button>
			</FormControl>
		</Paper>
		);
}

export default RegisterForm;