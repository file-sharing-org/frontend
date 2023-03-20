import {Link, Navigate} from "react-router-dom";
import React from "react";
import {Container, Box} from '@mui/material';
import AccountInfo from "./filePage/account";
import FileBox from "./filePage/fileBox";
import Cookies from 'universal-cookie';

function FilePage() {

	const cookies=new Cookies();

	const token = cookies.get('token');

	return (
		<>
		{token==null&&<Navigate to='/login'/>}
		<Container maxWidth={false} sx={{width: '80%', paddingTop: '50px', height: '100vh', display:'flex', flexFlow:'column'}}>
			
			<AccountInfo src="/logo.png" text="Имя Фамилия" height='50px'/>
			<FileBox />
		</Container>
		</>
		);
}

export default FilePage;