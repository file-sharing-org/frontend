import React from "react";
import {useEffect, useState} from "react";
import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField} from '@mui/material';
import Cookies from 'universal-cookie';
import axios from 'axios'
import FileAPI from '../../../api/FileAPI';

export default function DeleteDialog({open, setter, token, updater, contextmenu, close}) {
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
	}

	const handleDelete = () => {
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+filename:filename);
		console.log(name);
		const req = isFile?FileAPI.deleteFile:FileAPI.deleteFolder;
		req({name, token})
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
        <DialogTitle>Удаление</DialogTitle>
        <DialogContent>
          <DialogContentText>
          	{contextmenu&&contextmenu.isFile?
          		`Удалить файл ${contextmenu&&contextmenu.filename}?`:
            	`Удалить папку ${contextmenu&&contextmenu.filename}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        	<Button onClick={handleClose}>Отмена</Button>
          	<Button onClick={handleDelete}>Удалить</Button>
          
        </DialogActions>
      </Dialog>
	);
}