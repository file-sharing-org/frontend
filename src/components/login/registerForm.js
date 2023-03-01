import React from "react";
import {useState} from "react";
import "./registerForm.css";
import {TextField, Paper, FormControl, Button} from "@mui/material";
import {Link} from "react-router-dom";


function RegisterForm() {
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isPasswordEquals, setPasswordEquals] = useState(false);
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');	
	const checkEmail=(event)=> {
		if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)) {
			// console.log("govno");
			setIsValidEmail(false);
		} else {
			setIsValidEmail(true);
		}
	}

	const checkPassword = (event)=>{
		let password = event.target.value;
		if(password==password1) {
			setPasswordEquals(true);
		} else {
			setPasswordEquals(false);
		}
	}
	

	return (
		<Paper elevation={10} sx={{padding: '1em', 'border-radius': '10px'}}>
			<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
				{isValidEmail ? <TextField label="Почта" required onBlur={checkEmail} helperText=" "/>
							  : <TextField label="Почта" required onBlur={checkEmail} error helperText="Неправильный формат почты"/>}
				{isPasswordEquals?	
					<TextField type="password" label="Пароль" onChange={(e)=>setPassword1(e.target.value)} value={password1} required />
				:
					<TextField type="password" label="Пароль" onChange={(e)=>setPassword1(e.target.value)} value={password1} required error/>
				}
				{isPasswordEquals?
					<TextField type="password" label="Повторите пароль" helperText=" " onChange={checkPassword} required/>	
				:
					<TextField type="password" label="Повторите пароль" helperText="Пароли не совпадают" onChange={checkPassword} required error/>
				}
				<Button variant="contained" sx={{m: 1}}>Зарегистрироваться</Button>
			</FormControl>
		</Paper>
		);
}

export default RegisterForm;