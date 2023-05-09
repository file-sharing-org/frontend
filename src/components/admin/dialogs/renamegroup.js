import React from "react";
import {TextField, FormControl, Button, FormHelperText, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, InputLabel,
	Select, MenuItem, List, ListItem, ListItemButton, Checkbox, ListItemText} from "@mui/material";
import {useState, useEffect} from "react";
import GroupAPI from '../../../api/GroupAPI';




export default function RenameGroupDialog({token, open, setter}) {
	const [groupList, setGroupList] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState('');
	const [groupName, setGroupName] = useState('');

	useEffect(()=>{
		if(open) {
			setSelectedGroup('');
			setGroupName((prev)=>'');
			GroupAPI.getGroups()
			.then(response=> {
				const data = response['data'];
				console.log(data);
				setGroupList(data['groups'].map((item)=>item['name']).filter((x)=>x!=='everyone'));
				setSelectedGroup(data['groups'].filter((x)=>x['name']!=='everyone')[0]['name']);
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}, [open]);

	const handleSubmit = () => {
		GroupAPI.renameGroup({token: token, oldGroupName: selectedGroup, newGroupName: groupName})
		.then(response=> {
			const data = response['data'];
			console.log(data);
			handleClose();
		})
		.catch(error=>{
			console.log(error);
		});
	};

	const handleClose = () =>{
		setter(false);
	}


	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Переименнование группы</DialogTitle>
		        <DialogContent>
		          <TextField name='group' label="Новое название группы" onChange={(e)=>setGroupName(e.target.value)} value={groupName} sx={{marginTop: '10px'}} fullWidth/>
		          <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
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
		          </div>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={handleClose}>Отмена</Button>
			        <Button disabled={groupName===''} onClick={handleSubmit}>Переименновать</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}