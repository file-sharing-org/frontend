import React from "react";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField} from '@mui/material';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from 'axios'
import FileAPI from '../../../api/FileAPI';

export default function RenameDialog({open, setter, token, updater, contextmenu, close}) {
	const location = useLocation();
	let filename = null;
	let isFile = false;
	if(contextmenu!=null) {
		filename=contextmenu.filename;
		isFile=contextmenu.isFile;
	}
	const [fName, setFName] = useState(null);

	useEffect(()=>{
		if(contextmenu) {
			setFName(contextmenu.filename);
		}
	}, [contextmenu]);

	

	const handleClose = () => {
		setter(false);
		setFName('');
	}

	const rename = () => {
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+filename:filename);
		console.log(name);
		const req = isFile?FileAPI.renameFile:FileAPI.renameFolder;
		req({name, newName: fName, token})
		.then(response=> {
			const data = response['data'];
			updater();
			console.log(response);
		})
		.catch(error=>{
			console.log(error);
		});
		handleClose();
		close();
	}
	return (
		<Dialog open={open} onClose={handleClose}>
        <DialogTitle>Переименновать</DialogTitle>
        <DialogContent>
          <DialogContentText>
          	{contextmenu&&contextmenu.isFile?
          		'Укажите новое название файла':
            	'Укажите новое название папки'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название"
            fullWidth
            variant="standard"
            value={fName}
            onChange={(e)=>{setFName(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
        	<Button onClick={handleClose}>Отмена</Button>
          	<Button onClick={rename}>Переименновать</Button>
          
        </DialogActions>
      </Dialog>
	);
}