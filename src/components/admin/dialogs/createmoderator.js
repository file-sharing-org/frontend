import React from "react";
import {TextField, FormControl, Button, FormHelperText, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent} from "@mui/material";
import {useState} from "react";
import GroupAPI from '../../../api/GroupAPI';

export default function CreateModeratorDialog({token, open, setter}) {

	const [formValues, setFormValues] = useState({email: '', name: '', password: ''});
	const [isValidEmail, setIsValidEmail] = useState(true);

	const checkEmail = (e) => {
		if(!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(e.target.value)) {
			// console.log("govno");
			setIsValidEmail(false);
		} else {
			setIsValidEmail(true);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		GroupAPI.createModerator({token, name: formValues.name, email: formValues.email, password: formValues.password})
		.then(response=>{
			const data = response['data'];
			console.log(data);
			handleClose();
		})
		.catch(error=>{
			console.log(error);
		});
	};

	const handleClose = () => {
		setter(false);
		setFormValues((prev)=> {return {email: '', name: '', password: ''}});
	};

	const handleInputChange = (e) => {
		setFormValues((prev) => {return {...prev, [e.target.name]: e.target.value}});
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Создание модератора</DialogTitle>
		        <DialogContent>
		          <DialogContentText>
		          	Новые данные модератора
		          </DialogContentText>
		        	<form onSubmit={handleSubmit}>
		        		<FormControl sx={{width: '100%', '& .MuiTextField-root': { m: 1}}}>
		        			<TextField id='email' name='email' type="email" label="Почта модератора" onChange={(e)=>{handleInputChange(e);checkEmail(e);}} value={formValues.email} error={!isValidEmail} required/>
							<TextField id='name' name='name' label="Логин модератора" onChange={handleInputChange} value={formValues.name} required/>
							<TextField name='password' type="password" label="Пароль" onChange={handleInputChange} value={formValues.password} required/>
							
					        <DialogActions>
						        <Button onClick={handleClose}>Отмена</Button>
						        <Button type="submit">Создать модератора</Button>
					        </DialogActions>
						</FormControl>
		        	</form>
		        </DialogContent>
	     	</Dialog>
     	</>
	);
}