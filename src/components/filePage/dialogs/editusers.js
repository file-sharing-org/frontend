import React from "react";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField, CircularProgress, Select, MenuItem, InputLabel, FormControl, List,
	ListItemButton, ListItem, ListItemText, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios'
import FileAPI from '../../../api/FileAPI';
import GroupAPI from '../../../api/GroupAPI';
import './editusers.css';

export default function EditUsersDialog({open, setter, token, contextmenu, close}) {
	const location = useLocation();
	const [fName, setFName] = useState(null);
	const [selectedGroup, setSelectedGroup] = useState('everyone');
	const [groupList, setGroupList] = useState(['everyone']);
	const [allUsers, setAllUsers] = useState([]);
	const [checked, setChecked] = React.useState([]);
	const [permissions, setPermissions] = useState([]);

	useEffect(()=>{
		if(contextmenu) {
			setFName(contextmenu.filename);
			
			setSelectedGroup('everyone');
			GroupAPI.getGroups()
			.then(response=> {
				const data = response['data'];
				console.log(data);
				setGroupList(data['groups'].map((item)=>item['name']));
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}, [contextmenu]);

	useEffect(()=>{
		GroupAPI.getUsersOfGroup({groupName: selectedGroup})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			setAllUsers(data['users']);
		})
		.catch(error=>{
			console.log(error);
		});
	}, [selectedGroup]);

	const handleClose = () => {
		setter(false);
		close();
	}


	const handleToggle = (value) => () => {
	    const currentIndex = checked.indexOf(value);
	    const newChecked = [...checked];

	    if (currentIndex === -1) {
	      newChecked.push(value);
	    } else {
	      newChecked.splice(currentIndex, 1);
	    }

	    setChecked(newChecked);
  	};

  	const handleTogglePermission = (value) => () => {
  		const currentIndex = permissions.indexOf(value);
	    const newPermission = [...permissions];

	    if (currentIndex === -1) {
	      newPermission.push(value);
	    } else {
	      newPermission.splice(currentIndex, 1);
	    }
	    setPermissions(newPermission);
  	};

	const handleAddRight = () => {
		const users = allUsers.filter((x)=> checked.indexOf(x['id'])!==-1).map((x)=>x['name']);
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+fName:fName);
		console.log(name);
		console.log(permissions);
		permissions.forEach((perm)=>{
			FileAPI.addUsers({token, users, filepath: name, permission: perm})
			.then(response=> {
				const data = response['data'];
				console.log(data);
			})
			.catch(error=>{
				console.log(error);
			});
		});

	};

	const handleDeleteRight = () => {
		const users = allUsers.filter((x)=> checked.indexOf(x['id'])!==-1).map((x)=>x['name']);
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+fName:fName);
		console.log(name);
		console.log(permissions);
		permissions.forEach((perm)=>{
			FileAPI.deleteUsers({token, users, filepath: name, permission: perm})
			.then(response=> {
				const data = response['data'];
				console.log(data);
			})
			.catch(error=>{
				console.log(error);
			});
		});
	};

	
	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Редактирование прав пользователей</DialogTitle>
		        <DialogContent>
		          <DialogContentText>
		          	Файл {fName}
		          </DialogContentText>
		          <FormControl fullWidth sx={{mt: 2}}>
			          <InputLabel id="select-user-group-label">Группа</InputLabel>
			          <Select
			          	sx={{width: '100%'}}
	          			labelId="select-user-group-label"
	          			id="select-user-group"
			          	value={selectedGroup}
			          	label="Группа"
			          	onChange={(e)=>{setSelectedGroup(e.target.value)}}
			        	>
			        	{groupList.map((item)=>(
			        		<MenuItem value={item}>{item}</MenuItem>))
			        	}
			        	</Select>
		        	</FormControl>
		        	<div class='editusers'>
		        		<List dense sx={{overflow: 'auto', flex: '1'}}>
		        			{allUsers.map((item)=>
		        				<ListItem key={item['id']}
					            >
		        					<ListItemButton onClick={handleToggle(item['id'])}>
		        						<Checkbox
							                onChange={handleToggle(item['id'])}
							                checked={checked.indexOf(item['id']) !== -1}
							             />
		        						<ListItemText primary={item['name']}/>
		        					</ListItemButton>
		        				</ListItem>)}
		        		
		        		</List>
		        		<FormControl sx={{flex: '1'}}>
		        			<FormGroup sx={{m: 'auto'}}>
		        			<FormControlLabel 
		        				control={
		        						<Checkbox
		        							checked={permissions.indexOf('look')!==-1}
		        							onChange={handleTogglePermission('look')}
		        						/>
		        						}
		        				labelPlacement="start"
		        				label='Чтение'/>
		        			<FormControlLabel 
		        				control={<Checkbox
		        							checked={permissions.indexOf('edit')!==-1}
		        							onChange={handleTogglePermission('edit')}
		        						/>}
		        				labelPlacement="start"
		        				label='Изменение'/>
		        			<FormControlLabel 
		        				control={<Checkbox
		        							checked={permissions.indexOf('move')!==-1}
		        							onChange={handleTogglePermission('move')}
		        						/>}
		        				labelPlacement="start"
		        				label='Перемещение'/>
		        			</FormGroup>
		        			
		        		</FormControl>
		        	</div>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={handleAddRight}>Добавить права</Button>
			        <Button onClick={handleDeleteRight}>Удалить права</Button>
		        	<Button onClick={handleClose}>Ок</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}