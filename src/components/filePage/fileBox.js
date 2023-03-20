import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import React from "react";
import {useEffect, useState} from "react";
import {Container, Box} from '@mui/material';
import FilePath from './filePath';
import Folder from './elements/folder';
import File from './elements/file';
import Cookies from 'universal-cookie';
import axios from 'axios'

function Titles({names}) {
	const outlet = useOutlet();
	console.log(outlet);
	if(outlet) return null;

	return names.map((item)=><Folder to={item['title']} name={item['title']} />);
}

function FileTitles({names}) {
	const outlet = useOutlet();
	console.log(outlet);
	if(outlet) return null;

	return names.map((item)=><File name={item} />);
}

function FileBox(props) {
	const cookies = new Cookies();

	const location = useLocation();
	const token = cookies.get('token');
	const [folderRoutes, setFolderRoutes] = useState({title:"/", directories:[], files:[]});

	function findOrCreate(x, value) {
		let flag=true;
		for(var i=0; i<x['directories'].length; i++) {
			if(x['directories'][i]['title']===value) {
				return x['directories'][i];
			}
		}
		x['directories'].push({title:value, directories:[], files:[]});
		return x['directories'][x['directories'].length-1];
	}

	function getRecursiveDict(x, values) {
		if(values.length==0 || values[0].length==0) return x;
		let ref = findOrCreate(x, values[0]);
		return getRecursiveDict(ref, values.slice(1));
	}

	useEffect(()=>{
		console.log(location);
		const path = location['pathname'].slice(6);
		axios.post('http://127.0.0.1:8000/api/open-folder',null,
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
	}, [location]);




	const recF=(x) => {
		return x.map((item)=>
				<Route exact path={item['title']} element={<><Titles names={item['directories']} /><Outlet/></>}>
					{recF(item['directories'])}
				</Route>
		);
	}

	const recFL=(x) => {
		return x.map((item)=>
				<Route exact path={item['title']} element={<><FileTitles names={item['files']} /><Outlet/></>}>
					{recFL(item['directories'])}
				</Route>
		);
	}



	return (
		<Box sx={{display: 'flex', flexFlow:'column', mt:'20px', bgcolor: '#ffffff', height:1}}>
			<FilePath location={location}/>
			<div style={{display: 'flex', padding: 10}}>
				<Routes>
					<Route exact path="/" element={<><Titles names={folderRoutes['directories']}/><Outlet/></>}>
						{recF(folderRoutes['directories'])}
					</Route>
				</Routes>
				
			</div>
			<div style={{display: 'flex', padding: 10}}>
				<Routes>
					<Route exact path="/" element={<><FileTitles names={folderRoutes['files']} /><Outlet/></>}>
						{recFL(folderRoutes['directories'])}
					</Route>
				</Routes>
			</div>
		</Box>
	);
}
export default FileBox;