import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import React from "react";
import {useEffect, useState} from "react";
import {Container, Box, Menu, MenuItem, CircularProgress} from '@mui/material';
import FilePath from './filePath';
import Folder from './elements/folder';
import {File, NewFile} from './elements/file';
import Cookies from 'universal-cookie';
import axios from 'axios'
import FileContextMenu from './contextmenu';
import FileAPI from '../../api/FileAPI';


function Titles({names, menu, setter}) {
	const outlet = useOutlet();
	
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

function FileBox({token}) {

	const location = useLocation();
	const [folderRoutes, setFolderRoutes] = useState({title:"/", directories:[false], files:[false]});
	const [contextMenu, setContextMenu] = useState(null);
	
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
		FileAPI.openFolder({path, token})
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
					ref['directories'] = ref['directories'].filter((x)=>{
						for(var i=0; i<data['directories'].length; i++) {
							let dname = data['directories'][i];
							if(dname.lastIndexOf('/')>=0) {
								dname = dname.slice(dname.lastIndexOf('/')+1);
							}
							if(dname===x['title']) {
								return true;
							}
						}
						return false;
					});

					
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
	            isFile: event.isFile!=null&&event.isFile,
	            isFolder: event.isFolder!=null&&event.isFolder,
	            filename: event.fileName
	          }
	        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
	          // Other native context menus might behave different.
	          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
	          null,
	    );
  	};

  	


	const recF=(x) => {
		if(x!=null && x.length==1 && x[0]==false) return null;
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

	const createFile = (file) => {
		console.log(file);
		const path = location['pathname'].slice(6);
		FileAPI.uploadFile({file: file[0], path, token})
		.then(response=> {
			const data = response['data'];
			updateLocation();
		})
		.catch((error)=> {
			console.log(error);
		})
	}



	return (
		<>
		<Box sx={{display: 'flex', flexFlow: 'column', mt:'20px', bgcolor: '#ffffff', height:'100%'}}>
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
					{!loadingState && <NewFile onFile={createFile} />}
				</div>
			</div>
			
			<FileContextMenu token={token} updateLocation={updateLocation} contextMenu={contextMenu} setContextMenu={setContextMenu} />
		</Box>
		
		</>

	);
}
export default FileBox;