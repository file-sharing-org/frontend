import React from "react";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField, CircularProgress, Select, MenuItem, InputLabel, FormControl, List,
	ListItemButton, ListItem, ListItemText, Checkbox, FormControlLabel, FormGroup, ListSubheader  } from '@mui/material';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios'
import FileAPI from '../../../api/FileAPI';
import GroupAPI from '../../../api/GroupAPI';
import './editgroups.css';

export default function EditGroupsDialog({open, setter, token, contextmenu, close}) {
	const location = useLocation();
	const [fName, setFName] = useState(null);
	const [groupList, setGroupList] = useState(['everyone']);
	const [checked, setChecked] = React.useState([]);
	const [permissions, setPermissions] = useState([]);

	useEffect(()=>{
		if(contextmenu) {
			setFName(contextmenu.filename);
			GroupAPI.getGroups()
			.then(response=> {
				const data = response['data'];
				console.log(data);
				setGroupList(data['groups']);
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}, [contextmenu]);

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
		const groups = groupList.filter((x)=> checked.indexOf(x['id'])!==-1).map((x)=>x['name']);
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+fName:fName);
		console.log(name);
		console.log(permissions);
		permissions.forEach((perm)=>{
			FileAPI.addGroups({token, groups, filepath: name, permission: perm})
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
		const groups = groupList.filter((x)=> checked.indexOf(x['id'])!==-1).map((x)=>x['name']);
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+fName:fName);
		console.log(name);
		console.log(permissions);
		permissions.forEach((perm)=>{
			FileAPI.deleteGroups({token, groups, filepath: name, permission: perm})
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
	        	<DialogTitle>Редактирование прав групп</DialogTitle>
		        <DialogContent>
		          <DialogContentText>
		          	Файл {fName}
		          </DialogContentText>
		        	<div class='editgroups'>
		        		<List dense sx={{overflow: 'auto', flex: '1'}}
		        			subheader={
		        				<ListSubheader>
		        					Группы
		        				</ListSubheader>
		        			}>
		        			{groupList.map((item)=>
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