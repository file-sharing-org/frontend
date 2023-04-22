import React from "react";
import {Container, Box, Dialog, DialogContent, DialogTitle, DialogContentText,DialogActions, Button, TextField, CircularProgress} from '@mui/material';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios'
import FileAPI from '../../../api/FileAPI';

export default function ShowFileLinkDialog({open, setter, token, contextmenu, close}) {
	const location = useLocation();
	const [link, setLink] = useState(null);
	const [fName, setFName] = useState(null);
	const [notifyOpen, setNotify] = useState(false);

	const handleLink = (filename) => {
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+filename:filename);
		console.log(name);
		
		FileAPI.createLink({token, filename: name})
		.then(response=> {
			const data = response['data'];
			console.log(response);
			setLink(data['url']);
		})
		.catch(error=>{
			console.log(error);
		});
	}

	useEffect(()=>{
		if(contextmenu && contextmenu.isFile) {
			setFName(contextmenu.filename);
		}
		if(open && fName) {
			handleLink(fName);
		}
	}, [open, contextmenu]);

	

	const handleClose = () => {
		setter(false);
		setLink('');
		close();
	}

	const handleClick = () => {
		navigator.clipboard.writeText(link);
		setNotify(true);
	}

	const handleNotifyClose = () => {
		setNotify(false);
	}

	
	return (
		<>
			<Snackbar open={notifyOpen} autoHideDuration={6000} onClose={handleNotifyClose}>
				<MuiAlert onClose={handleNotifyClose} elevation={6} variant="filled">
					Ссылка скопирована в буфер!
				</MuiAlert>
			</Snackbar>
			<Dialog open={open} onClose={handleClose} fullWidth>
	        	<DialogTitle>Создание ссылки</DialogTitle>
		        <DialogContent>
		          <DialogContentText>
		          	Ссылка на {fName}
		          </DialogContentText>
		          {link?
			          <TextField
			            autoFocus
			            margin="dense"
			            id="filelink"
			            label="Нажмите, чтобы скопировать"
			            InputProps={{
				            readOnly: true,
				          }}
			            fullWidth
			            value={link}
			            onClick={handleClick}
			          />
			      :
		          	<div style={{width: '100%', height:'100%', display:'flex', 'alignItems':'center', 'justifyContent': 'center'}}><CircularProgress /></div>
		          }
		        </DialogContent>
		        <DialogActions>
		        	<Button onClick={handleClose}>Ок</Button>
		        </DialogActions>
	     	</Dialog>
     	</>
	);
}