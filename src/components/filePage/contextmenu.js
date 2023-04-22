import React from "react";
import {useEffect, useState} from "react";
import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import {Container, Box, Menu, MenuItem, CircularProgress, Divider} from '@mui/material';
import Cookies from 'universal-cookie';
import axios from 'axios'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LinkIcon from '@mui/icons-material/Link';
import NewFolderFialog from './dialogs/newfolder';
import RenameDialog from './dialogs/rename';
import DeleteDialog from './dialogs/delete';
import ShowLinkDialog from './dialogs/showfilelink';
import FileAPI from '../../api/FileAPI';

export default function FileContextMenu({contextMenu, setContextMenu, token, updateLocation}) {

	const [newFileOpen, setNewFileOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
	const [showLinkOpen, setShowLinkOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [fileCopy, setFileCopy] = useState(null);
	const [fileCut, setFileCut] = useState(null);


	const cookies = new Cookies();

	const location = useLocation();

	const handleClose = () => {
		setContextMenu(null);
	};


	const createFolder = () => {
		setNewFileOpen(true);
		console.log("new filedialog");
		//handleClose();
	}

	const downloadFile = () => {
		handleClose();
		const filename = contextMenu.filename;
		const path = location['pathname'].slice(6);

		const name = path + (path.length>0?'/'+filename:filename);
		FileAPI.downloadFile({name, token})
		.then(response=> {
			const data = response['data'];
			const href = URL.createObjectURL(response.data);

		    // create "a" HTML element with href to file & click
		    const link = document.createElement('a');
		    link.href = href;
		    link.setAttribute('download', filename); //or any other extension
		    document.body.appendChild(link);
		    link.click();

		    // clean up "a" element & remove ObjectURL
		    document.body.removeChild(link);
		    URL.revokeObjectURL(href);
		})
		.catch((error)=> {
			console.log(error);
		})

	}

	const handleRename = () => {
		const filename = contextMenu.filename;
		setRenameOpen(true);
		//handleClose();
	}

	const handleCopy = () => {
		const filename = contextMenu.filename;
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+filename:filename);
		setFileCopy([name, contextMenu.isFile]);
		setFileCut(null);
		handleClose();
	}

	const handleCut = () => {
		const filename = contextMenu.filename;
		const path = location['pathname'].slice(6);
		const name = path + (path.length>0?'/'+filename:filename);
		setFileCut([name, contextMenu.isFile]);
		setFileCopy(null);
		handleClose();
	}

	const handlePaste = () => {
		let req = null;
		let filename = null;
		if(fileCopy) {
			filename=fileCopy[0];
			req = fileCopy[1]?FileAPI.copyFile:FileAPI.copyFolder;
		}
		else if(fileCut) {
			filename = fileCut[0];
			req = fileCut[1]?FileAPI.rebaseFile:FileAPI.rebaseFolder;
		}
		if(filename==null || req==null) {
			handleClose();
			return;
		}
		const path = location['pathname'].slice(6);
		req({filename, path, token})
		.then(response=> {
			const data = response['data'];
			updateLocation();
			console.log(response);
			setFileCut(null);
			setFileCopy(null);
			handleClose();
		})
		.catch(error=>{
			console.log(error);
		});
	}

	const handleDelete = () => {
		setDeleteOpen(true);
	}

	const handleLink = () => {
		setShowLinkOpen(true);

	}

	return (
		<>
			<Menu
		        open={contextMenu !== null}
		        onClose={handleClose}
		        anchorReference="anchorPosition"
		        anchorPosition={
		          contextMenu !== null
		            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
		            : undefined
		        }>
		        <MenuItem onClick={createFolder}><ListItemIcon><CreateNewFolderIcon fontSize="small"/></ListItemIcon>Новая папка</MenuItem>
		        {contextMenu&&contextMenu.isFile&&<MenuItem onClick={downloadFile}><ListItemIcon><DownloadIcon fontSize="small"/></ListItemIcon>Скачать</MenuItem>}
		        {contextMenu&&(contextMenu.isFile||contextMenu.isFolder)&&<MenuItem onClick={handleRename}><ListItemIcon><DriveFileRenameOutlineIcon fontSize="small"/></ListItemIcon>Переименновать</MenuItem>}
		        {contextMenu&&(contextMenu.isFile||contextMenu.isFolder)&&<MenuItem onClick={handleCopy}><ListItemIcon><ContentCopyIcon fontSize="small"/></ListItemIcon>Копировать</MenuItem>}
		        {contextMenu&&(contextMenu.isFile||contextMenu.isFolder)&&<MenuItem onClick={handleCut}><ListItemIcon><ContentCutIcon fontSize="small"/></ListItemIcon>Вырезать</MenuItem>}
		        {contextMenu&&!(contextMenu.isFile||contextMenu.isFolder)&&<MenuItem onClick={handlePaste} disabled={!(fileCopy||fileCut)}><ListItemIcon><ContentPasteIcon fontSize="small"/></ListItemIcon>Вставить</MenuItem>}
		        {contextMenu&&(contextMenu.isFile||contextMenu.isFolder)&&<MenuItem onClick={handleDelete}><ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>Удалить</MenuItem>}
		        {contextMenu&&contextMenu.isFile&&<Divider />}
		        {contextMenu&&contextMenu.isFile&&<MenuItem onClick={handleLink}><ListItemIcon><LinkIcon fontSize="small"/></ListItemIcon>Копировать ссылку</MenuItem>}
		      </Menu>

		    <NewFolderFialog token={token} updater={updateLocation} setter={setNewFileOpen} close={handleClose} open={newFileOpen}/>
			<RenameDialog token={token} updater={updateLocation} setter={setRenameOpen} close={handleClose} open={renameOpen} contextmenu={contextMenu}/>
			<DeleteDialog token={token} updater={updateLocation} setter={setDeleteOpen} close={handleClose} open={deleteOpen} contextmenu={contextMenu}/>
			<ShowLinkDialog token={token} open={showLinkOpen} setter={setShowLinkOpen} close={handleClose} contextmenu={contextMenu}/>
		</>
	);
}