import React from "react";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField} from '@mui/material';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from 'axios'

function NewFolderFialog({open, setter, token, updater}) {

	const location = useLocation();
	const [folderName, setFolderName] = useState('');

	const handleClose = () => {
		setter(false);
		setFolderName('');
	}

	const create = () => {
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+folderName:folderName);
		axios.post('http://127.0.0.1:8000/api/create-folder', null,
			{params:{
				folder:name
			},
			headers: {'Authorization': `Bearer ${token}`}})
		.then(response=> {
			const data = response['data'];
			updater();
			console.log(response);
		})
		.catch(error=>{
			console.log(error);
		});
		handleClose();
	}
	return (
		<Dialog open={open} onClose={handleClose}>
        <DialogTitle>Новая папка</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Укажите название новой папки
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название"
            fullWidth
            variant="standard"
            value={folderName}
            onChange={(e)=>{setFolderName(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
        	<Button onClick={handleClose}>Отмена</Button>
          	<Button onClick={create}>Создать</Button>
          
        </DialogActions>
      </Dialog>
	);
}

export default NewFolderFialog;