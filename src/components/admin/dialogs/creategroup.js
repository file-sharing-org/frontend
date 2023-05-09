import React from "react";
import {TextField, FormControl, Button, FormHelperText, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, InputLabel,
	Select, MenuItem, List, ListItem, ListItemButton, Checkbox, ListItemText} from "@mui/material";
import {useState, useEffect} from "react";
import GroupAPI from '../../../api/GroupAPI';




export default function CreateGroupDialog({token, open, setter}) {

	const [formValues, setFormValues] = useState({email: '', name: '', password: ''});
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [groupList, setGroupList] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState('everyone');
	const [allUsers, setAllUsers] = useState([]);
	const [checked, setChecked] = useState([]);
	const [groupName, setGroupName] = useState('');

	useEffect(()=>{
		if(open) {
			setSelectedGroup('everyone');
			setChecked((prev)=>[]);
			setGroupName((prev)=>'');
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
	}, [open]);

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

	const handleSubmit = () => {
		const users = allUsers.filter((x)=> checked.indexOf(x['id'])!==-1).map((x)=>x['name']);
		GroupAPI.createGroup({token: token, groupName: groupName, users: users})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			handleClose();
		})
		.catch(error=>{
			console.log(error);
		});
	};

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

	const handleClose = () => {
		setter(false);
	};


	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Создание группы</DialogTitle>
		        <DialogContent>
		          <TextField name='group' label="Название новой группы" onChange={(e)=>setGroupName(e.target.value)} value={groupName} sx={{marginTop: '10px'}} fullWidth/>
		          <DialogContentText>
		          	Пользователи новой группы
		          </DialogContentText>
		          <div style={{width: '100%', display: 'flex', flexDirection: 'column', height: '50vh'}}>
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
			          	<List dense sx={{overflow: 'auto', flex: '1', width: '100%'}}>
			        			{allUsers.map((item)=>
			        				<ListItem key={item['id']}>
		        					<ListItemButton onClick={handleToggle(item['id'])}>
		        						<Checkbox
							                onChange={handleToggle(item['id'])}
							                checked={checked.indexOf(item['id']) !== -1}
							             />
		        						<ListItemText primary={item['name']}/>
		        					</ListItemButton>
		        				</ListItem>)}
		        		</List>
		          </div>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={handleClose}>Отмена</Button>
			        <Button onClick={handleSubmit}>Создать группу</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}