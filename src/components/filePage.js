import {Link, Navigate, useLocation} from "react-router-dom";
import React from "react";
import {useEffect, useState} from "react";
import {Container, Box, Button} from '@mui/material';
import AccountInfo from "./filePage/account";
import FileBox from "./filePage/fileBox";
import Cookies from 'universal-cookie';
import axios from 'axios'
import AuthAPI from '../api/AuthAPI';
import './filepage.css';

function FilePage() {

	
	const initCookies=new Cookies();
	const [token, setToken] = useState(null);
	const [accountName, setAccountName] = useState('');
	const [isAdmin, setAdmin] = useState(false);
	let inRequest = false;
	const location = useLocation();

	useEffect(()=>{
		const cookies=new Cookies();
		let token2 = cookies.get('token');
		console.log(token2);
		if(inRequest) return;
		inRequest = true;
		AuthAPI.refresh({token: token2})
		.then(response=> {
			if(response['status']==200) {
				const data = response['data'];
				cookies.set('token', data['authorisation']['token'], {path:'/'});	
				setToken(data['authorisation']['token']);
				setAccountName(data['user']['name']);
				setAdmin((prev)=>data['user']['is_admin']); 
			} else {
				setToken('');
			}
			inRequest = false;
			console.log(response);
		})
		.catch(error=>{
			inRequest = false;
			setToken('');
			console.log(error);
		});
	},[]);
	


	return (
		<>
		{token!=null && token==='' && <Navigate to='/login'/>}
		<Container maxWidth={false} sx={{width: '80%', paddingTop: '50px', height: '100vh', display:'flex', flexFlow:'column'}}>
			<div class='headerBox'>
				<AccountInfo src="/logo.png" text={accountName} height='50px'/>
				{isAdmin && <Button variant="contained" component={Link} to='/admin'>Админская панель</Button>}
			</div>
			{token!=null&&<FileBox token={token}/>}
		</Container>
		</>
		);
}

export default FilePage;