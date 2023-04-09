import {Link, Navigate, useLocation} from "react-router-dom";
import React from "react";
import {useEffect, useState} from "react";
import {Container, Box} from '@mui/material';
import AccountInfo from "./filePage/account";
import FileBox from "./filePage/fileBox";
import Cookies from 'universal-cookie';
import axios from 'axios'
import AuthAPI from '../api/AuthAPI';

function FilePage() {

	
	const initCookies=new Cookies();
	const [token, setToken] = useState(initCookies.get('token'));
	const [accountName, setAccountName] = useState('');
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
				cookies.set('token', data['authorisation']['token']);	
				setToken(data['authorisation']['token'], {path:'/'});
				setAccountName(data['user']['name']);
			} else {
				setToken(null);
			}
			inRequest = false;
			console.log('new TOKEN: '+token);
			console.log(response);
		})
		.catch(error=>{
			inRequest = false;
			setToken(null);
			console.log(error);
		});
	},[]);
	


	return (
		<>
		{token==null&&<Navigate to='/login'/>}
		<Container maxWidth={false} sx={{width: '80%', paddingTop: '50px', height: '100vh', display:'flex', flexFlow:'column'}}>
			
			<AccountInfo src="/logo.png" text={accountName} height='50px'/>
			<FileBox token={token}/>
		</Container>
		</>
		);
}

export default FilePage;