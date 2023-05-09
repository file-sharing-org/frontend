import React from "react";
import {TextField, FormControl, Button, FormHelperText, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, InputLabel,
	Select, MenuItem, List, ListItem, ListItemButton, Checkbox, ListItemText} from "@mui/material";
import {useState, useEffect} from "react";
import GroupAPI from '../../../api/GroupAPI';




export default function DeleteGroupDialog({token, open, setter}) {

	const [formValues, setFormValues] = useState({email: '', name: '', password: ''});
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [groupList, setGroupList] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState('');

	useEffect(()=>{
		if(open) {
			setSelectedGroup('');
			GroupAPI.getGroups()
			.then(response=> {
				const data = response['data'];
				console.log(data);
				setGroupList(data['groups'].map((item)=>item['name']).filter((x)=>x!=='everyone'));
			})
			.catch(error=>{
				console.log(error);
			});
		}
	}, [open]);

	const handleSubmit = () => {
		GroupAPI.deleteGroup({token, groupName: selectedGroup})
		.then(response=> {
			const data = response['data'];
			console.log(data);
		})
		.catch(error=>{
			console.log(error);
		});
	};

	const handleClose = () => {
		setter(false);
	};


	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Удаление группы</DialogTitle>
		        <DialogContent>
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
		          </div>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={handleClose}>Отмена</Button>
			        <Button disabled={selectedGroup===''} onClick={handleSubmit} color="error">Удалить группу</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}