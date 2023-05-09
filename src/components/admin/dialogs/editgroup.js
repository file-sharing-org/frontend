import React from "react";
import {TextField, FormControl, Button, FormHelperText, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, InputLabel,
	Select, MenuItem, List, ListItem, ListItemButton, Checkbox, ListItemText} from "@mui/material";
import {useState, useEffect} from "react";
import GroupAPI from '../../../api/GroupAPI';




export default function EditGroupDialog({token, open, setter}) {

	const [formValues, setFormValues] = useState({email: '', name: '', password: ''});
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [groupList, setGroupList] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState('everyone');
	const [editGroupName, setEditGroupName] = useState('everyone');
	const [allUsers, setAllUsers] = useState([]);
	const [usersList, setUsersList] = useState([]);
	const [selectedUserList, setSelectedUserList] = useState([]);

	const [checkedDelete, setCheckedDelete] = useState([]);
	const [checkedAdd, setCheckedAdd] = useState([]);

	useEffect(()=>{
		if(open) {
			setSelectedGroup('everyone');
			setEditGroupName('');
			setCheckedDelete([]);
			setCheckedAdd([]);
			GroupAPI.getGroups()
			.then(response=> {
				const data = response['data'];
				console.log(data);
				setGroupList(data['groups'].map((item)=>item['name']));
				setEditGroupName(data['groups'].filter((item)=>item['name']!=='everyone')[0]['name']);
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}, [open]);

	useEffect(()=>{
		setCheckedAdd([]);
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

	useEffect(()=>{
		setCheckedDelete([]);
		if(selectedGroup===editGroupName) {
			setSelectedGroup('everyone');
		}
		GroupAPI.getUsersOfGroup({groupName: editGroupName})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			setSelectedUserList(data['users']);
		})
		.catch(error=>{
			console.log(error);
		});
	}, [editGroupName]);

	useEffect(()=>{
		const ids = selectedUserList.map((x)=>x['id']);
		setUsersList(allUsers.filter((x)=>!ids.includes(x['id'])));
	}, [allUsers, selectedUserList]);

	const handleDeleteUsers = () => {
		const users = selectedUserList.filter((x)=>checkedDelete.indexOf(x['id'])!==-1).map((x)=>x['name']);
		GroupAPI.deleteUsersFromGroup({token, groupName: editGroupName, users})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			setSelectedUserList((prev)=>prev.filter((x)=>!(checkedDelete.indexOf(x['id'])!==-1)));
			setCheckedDelete([]);
		})
		.catch(error=>{
			console.log(error);
		});
	};

	const handleAddUsers = () => {
		const users = usersList.filter((x)=>checkedAdd.indexOf(x['id'])!==-1).map((x)=>x['name']);
		GroupAPI.addUsersToGroup({token, groupName: editGroupName, users})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			setSelectedUserList((prev)=>[...prev, ...usersList.filter((x)=>checkedAdd.indexOf(x['id'])!==-1)]);
			setCheckedAdd([]);
		})
		.catch(error=>{
			console.log(error);
		});
	};


	const handleToggleDelete = (value) => () => {
	    const currentIndex = checkedDelete.indexOf(value);
	    const newChecked = [...checkedDelete];

	    if (currentIndex === -1) {
	      newChecked.push(value);
	    } else {
	      newChecked.splice(currentIndex, 1);
	    }

	    setCheckedDelete(newChecked);
  	};

  	const handleToggleAdd = (value) => () => {
	    const currentIndex = checkedAdd.indexOf(value);
	    const newChecked = [...checkedAdd];

	    if (currentIndex === -1) {
	      newChecked.push(value);
	    } else {
	      newChecked.splice(currentIndex, 1);
	    }

	    setCheckedAdd(newChecked);
  	};

	const handleClose = () => {
		setter(false);
	};


	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Изменение группы</DialogTitle>
		        <DialogContent>
		          <div style={{width: '100%', display: 'flex', flexDirection: 'row', height: '50vh', justifyContent: 'space-between'}}>
			          <div style={{width: '45%', display: 'flex', flexDirection: 'column'}}>
				          <FormControl fullWidth sx={{mt: 2}}>
					          <InputLabel id="select-user-group-label1">Редактируемая группа</InputLabel>
					          <Select
					          	sx={{width: '100%'}}
			          			labelId="select-user-group-label1"
			          			id="select-user-group1"
					          	value={editGroupName}
					          	label="Редактируемая группа"
					          	onChange={(e)=>{setEditGroupName(e.target.value)}}>
					        	{groupList.filter((item)=>item!=='everyone').map((item)=>(
					        		<MenuItem value={item}>{item}</MenuItem>))
					        	}
					        	</Select>
				        	</FormControl>
				          	<List dense sx={{overflow: 'auto', flex: '1', width: '100%'}}>
				        			{selectedUserList.map((item)=>
				        				<ListItem key={item['id']}>
			        					<ListItemButton onClick={handleToggleDelete(item['id'])}>
			        						<Checkbox
								                onChange={handleToggleDelete(item['id'])}
								                checked={checkedDelete.indexOf(item['id']) !== -1}
								             />
			        						<ListItemText primary={item['name']}/>
			        					</ListItemButton>
			        				</ListItem>)}
			        		</List>
			        		<Button disabled={checkedDelete.length==0} variant='contained' color='error' onClick={handleDeleteUsers}>Удалить выделенных</Button>
			          </div>
			          <div style={{width: '45%', display: 'flex', flexDirection: 'column'}}>
				          <FormControl fullWidth sx={{mt: 2}}>
					          <InputLabel id="select-user-group-label2">Группа</InputLabel>
					          <Select
					          	sx={{width: '100%'}}
			          			labelId="select-user-group-label2"
			          			id="select-user-group2"
					          	value={selectedGroup}
					          	label="Группа"
					          	onChange={(e)=>{setSelectedGroup(e.target.value)}}>
					        	{groupList.filter((item)=>item!==editGroupName).map((item)=>(
					        		<MenuItem value={item}>{item}</MenuItem>))
					        	}
					        	</Select>
				        	</FormControl>
				          	<List dense sx={{overflow: 'auto', flex: '1', width: '100%'}}>
				        			{usersList.map((item)=>
				        				<ListItem key={item['id']}>
			        					<ListItemButton onClick={handleToggleAdd(item['id'])}>
			        						<Checkbox
								                onChange={handleToggleAdd(item['id'])}
								                checked={checkedAdd.indexOf(item['id']) !== -1}
								             />
			        						<ListItemText primary={item['name']}/>
			        					</ListItemButton>
			        				</ListItem>)}
			        		</List>
			        		<Button disabled={checkedAdd.length==0} variant='contained' onClick={handleAddUsers}>Добавить выделенных</Button>
			          </div>
		          </div>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={handleClose}>Готово</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}