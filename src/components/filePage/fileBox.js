import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import React from "react";
import {useEffect, useState} from "react";
import {Container, Box, Menu, MenuItem, CircularProgress} from '@mui/material';
import FilePath from './filePath';
import Folder from './elements/folder';
import {File, NewFile} from './elements/file';
import Cookies from 'universal-cookie';
import axios from 'axios'
import NewFolderFialog from './dialogs/newfolder';

function Titles({names, menu, setter}) {
	const outlet = useOutlet();
	console.log(outlet);
	
	useEffect(()=>{
		if(names.length==1 && names[0]==false) {
			if(!outlet) {
				setter(true);
			}
		} else {
			setter(false);
		}
	},[names]);

	if(outlet) return null;
	return (
		<>
		{!(names.length==1 && names[0]==false)&&names.map((item)=><Folder onmenu={menu} to={item['title']} name={item['title']} />) }
		</>
	);
}

function FileTitles({names, menu, setter}) {
	const outlet = useOutlet();
	console.log(outlet);
	useEffect(()=>{
		if(names.length==1 && names[0]==false) {
			if(!outlet) {
				setter(true);
			}
		} else {
			setter(false);
		}
	},[names]);

	if(outlet) return null;
	return (<>
		{!(names.length==1 && names[0]==false)&&names.map((item)=><File onmenu={menu} name={item} />)}
		</>
		);
}

function FileBox(props) {
	const cookies = new Cookies();

	const location = useLocation();
	const token = cookies.get('token');
	const [folderRoutes, setFolderRoutes] = useState({title:"/", directories:[false], files:[false]});
	const [contextMenu, setContextMenu] = useState(null);
	const [newFileOpen, setNewFileOpen] = useState(false);
	const [loadingState, setLoadingState] = useState(false);

	function findOrCreate(x, value) {
		if(x['directories'].length==1 && x['directories'][0]==false) {
			x['directories']=[];
		}
		for(var i=0; i<x['directories'].length; i++) {
			if(x['directories'][i]['title']===value) {
				return x['directories'][i];
			}
		}
		x['directories'].push({title:value, directories:[false], files:[false]});
		return x['directories'][x['directories'].length-1];
	}

	function getRecursiveDict(x, values) {
		if(values.length==0 || values[0].length==0) return x;
		let ref = findOrCreate(x, values[0]);
		return getRecursiveDict(ref, values.slice(1));
	}

	const updateLocation = () => {
		console.log(location);
		const path = location['pathname'].slice(6);
		axios.get('http://127.0.0.1:8000/api/open-folder',
			{params:{
				folder:path
			},
			headers: {'Authorization': `Bearer ${token}`}})
		.then(response=> {
			const data = response['data'];
			if(data['status']==='success') {
				setFolderRoutes((value)=>{
					console.log("SETTER");
					let index=0;
					const ppp = path;
					let glist = [];
					console.log(value);
					console.log(ppp);
					while(ppp.indexOf('/', index)>=0) {
						glist.push(ppp.slice(index, ppp.indexOf('/', index)));
						index = ppp.indexOf('/', index)+1;
					}
					glist.push(ppp.slice(index));
					console.log(value);
					console.log(glist);
					let ref = getRecursiveDict(value, glist);
					console.log(ref);
					ref['files']=data['files'].map(x=>{
						if(x.lastIndexOf('/')>=0) {
							x = x.slice(x.lastIndexOf('/')+1);
						}
						return x;
					});
					
					for(var i=0; i<data['directories'].length; i++) {
						let title = data['directories'][i];
						if(title.lastIndexOf('/')>=0) {
							title = title.slice(title.lastIndexOf('/')+1);
						}
						findOrCreate(ref, title);
						//ref['directories'].push({title:title, directories:[], files:[]});
					}
					console.log(value);
					return {...value};
				});
			}
		})
		.catch(error=> {
			console.log(error);
		});
	}

	useEffect(()=>{
		updateLocation();
	}, [location]);


	const handleContextMenu = (event) => {
	    event.preventDefault();
	    console.log('menu');
	    console.log(event);
	    console.log(event.fileName);
	    setContextMenu(
	      contextMenu === null
	        ? {
	            mouseX: event.clientX + 2,
	            mouseY: event.clientY - 6,
	            isFile: event.target.className==='file',
	            filename: event.fileName
	          }
	        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
	          // Other native context menus might behave different.
	          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
	          null,
	    );
  	};

  	const handleClose = () => {
		setContextMenu(null);
	};

	const createFolder = () => {
		setNewFileOpen(true);
		console.log("new filedialog");
		setContextMenu(null);
	}

	const downloadFile = () => {
		handleClose();
		const filename = contextMenu.filename;
		const path = location['pathname'].slice(6);

		const name = path + (path.length>0?'/'+filename:filename);
		const config = {
		    	headers: {Authorization: `Bearer ${token}`}
		    }
		axios({
		    url: 'http://127.0.0.1:8000/api/files?path='+name, //your url
		    method: 'GET',
		    responseType: 'blob', // important
		    headers: {Authorization: `Bearer ${token}`},
		})
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

	const createFile = (file) => {
		console.log(file);
		const path = location['pathname'].slice(6);
		let formData = new FormData();
		formData.append('file', file[0]);
		formData.append('folder', path);
		axios.post('http://127.0.0.1:8000/api/upload-file', formData,
			{headers: {'Authorization': `Bearer ${token}`}})
		.then(response=> {
			const data = response['data'];
			updateLocation();
		})
		.catch((error)=> {
			console.log(error);
		})
	}


	const recF=(x) => {
		if(x!=null && x.length==1 && x[0]==false) return null;
		console.log(x);
		return x.map((item)=>
				<Route exact path={item['title']} element={<><Titles menu={handleContextMenu} setter={setLoadingState} names={item['directories']} /><Outlet/></>}>
					{recF(item['directories'])}
				</Route>
		);
	}

	const recFL=(x) => {
		if(x!=null && x.length==1 && x[0]==false) return null;
		return x.map((item)=>
				<Route exact path={item['title']} element={<><FileTitles menu={handleContextMenu} setter={setLoadingState} names={item['files']} /><Outlet/></>}>
					{recFL(item['directories'])}
				</Route>
		);
	}



	return (
		<>
		<Box sx={{display: 'flex', flexFlow:'column', mt:'20px', bgcolor: '#ffffff', height:1}}>
			<FilePath location={location}/>
			
			<div style={{height: '100%'}} onContextMenu={handleContextMenu}>
				{loadingState&&<div style={{width: '100%', height:'100%', display:'flex', 'alignItems':'center', 'justifyContent': 'center'}}><CircularProgress /></div>}
				<div style={{display: 'flex', padding: 10, flexWrap: 'wrap'}}>
					<Routes>
						<Route exact path="/" element={<><Titles setter={setLoadingState} names={folderRoutes['directories']}/><Outlet/></>}>
							{recF(folderRoutes['directories'])}
						</Route>
					</Routes>
					
				</div>
				<div style={{display: 'flex', padding: 10, flexWrap: 'wrap'}}>
					<Routes>
						<Route exact path="/" element={<><FileTitles setter={setLoadingState} names={folderRoutes['files']} /><Outlet/></>}>
							{recFL(folderRoutes['directories'])}
						</Route>
					</Routes>
					<NewFile onFile={createFile}/>
				</div>
			</div>
			<Menu
		        open={contextMenu !== null}
		        onClose={handleClose}
		        anchorReference="anchorPosition"
		        anchorPosition={
		          contextMenu !== null
		            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
		            : undefined
		        }>
		        <MenuItem onClick={createFolder}>Новая папка</MenuItem>
		        {contextMenu&&contextMenu.isFile&&<MenuItem onClick={downloadFile}>Скачать</MenuItem>}
		      </Menu>

		</Box>
		<NewFolderFialog token={token} updater={updateLocation} setter={setNewFileOpen} open={newFileOpen}/>
		</>

	);
}
export default FileBox;