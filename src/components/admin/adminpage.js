import React from "react";
import {Link, Navigate} from "react-router-dom";
import {Container, Box, Menu, MenuItem, CircularProgress, Button} from '@mui/material';
import {useState, useEffect} from "react";
import AuthAPI from '../../api/AuthAPI';
import Cookies from 'universal-cookie';
import './adminpage.css';
import CreateModeratorDialog from './dialogs/createmoderator';
import CreateGroupDialog from './dialogs/creategroup';
import DeleteGroupDialog from './dialogs/deletegroup';
import RenameGroupDialog from './dialogs/renamegroup';
import EditGroupDialog from './dialogs/editgroup';

export default function AdminPage() {
	const [moderatorOpen, setModeratorOpen] = useState(false);
	const [groupOpen, setGroupOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [token, setToken] = useState(null);
	const [isAdmin, setIsAdmin] = useState(null);
	let inRequest = false;

	useEffect(()=>{
		if(inRequest) return;
		inRequest = true;
		console.log('refresh');
		const cookies=new Cookies();
		let tmpToken = cookies.get('token');
		AuthAPI.refresh({token: tmpToken})
		.then(response=>{
			inRequest=false;
			const data = response['data'];
			setToken(data['authorisation']['token']);
			cookies.set('token', data['authorisation']['token']);
			setIsAdmin(data['user']['is_admin']);
		})
		.catch(error=>{
			inRequest = false;
			cookies.set('token', '');
			setToken('');
			console.log(error);
		});
		//setToken((prev)=>cookies.get('token'));
		
	}, []);

	const handleModerator = () => {
		setModeratorOpen(true);
	};

	const handleGroup = () => {
		setGroupOpen(true);
	};

	const handleDelete = () => {
		setDeleteOpen(true);
	};

	const handleRename = () => {
		setRenameOpen(true);
	};

	const handleEdit = () => {
		setEditOpen(true);
	}

	return (
		<>
			{token!=null && token===''&&<Navigate to='/login'/>}
			{isAdmin!=null && !isAdmin && <Navigate to='/file'/>}
			<Container maxWidth={false} sx={{display:'flex', flexDirection: 'column', width: '80%', paddingTop: '50px', height: '100vh'}}>
				<div style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
					<Button variant="contained" sx={{width: 0.1}} component={Link} to='/file'>Выйти</Button>
				</div>
				<Box sx={{display: 'flex', flexFlow:'column', mt:'20px', bgcolor: '#ffffff', height:1, alignItems: 'center', pt: '10px'}}>
					{(token==null || isAdmin==null) &&
						<CircularProgress/>
					}
					{token!=null && isAdmin!=null &&
						<div class='adminpage__buttons'>
							<Button variant="contained" sx={{width: 0.5}} onClick={handleModerator}>Создать модератора</Button>
							<Button variant="contained" sx={{width: 0.5}} onClick={handleGroup}>Создать группу</Button>
							<Button color='error' variant="contained" sx={{width: 0.5}} onClick={handleDelete}>Удалить группу</Button>
							<Button variant="contained" sx={{width: 0.5}} onClick={handleRename}>Переименновать группу</Button>
							<Button variant="contained" sx={{width: 0.5}} onClick={handleEdit}>Изменить группу</Button>
						</div>
					}
				</Box>
			</Container>
			<CreateModeratorDialog token={token} open={moderatorOpen} setter={setModeratorOpen} />
			<CreateGroupDialog token={token} open={groupOpen} setter={setGroupOpen}/>
			<DeleteGroupDialog token={token} open={deleteOpen} setter={setDeleteOpen}/>
			<RenameGroupDialog token={token} open={renameOpen} setter={setRenameOpen}/>
			<EditGroupDialog token={token} open={editOpen} setter={setEditOpen}/>
		</>
		);
}