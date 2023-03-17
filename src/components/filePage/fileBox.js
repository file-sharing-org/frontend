import {Link, Navigate,Route,Routes,Outlet, useMatch, useOutlet, useLocation} from "react-router-dom";
import React from "react";
import {useEffect} from "react";
import {Container, Box} from '@mui/material';
import FilePath from './filePath';
import Folder from './elements/folder';

function Titles({names}) {
	const outlet = useOutlet();
	console.log(outlet);
	if(outlet) return null;

	return names.map((item)=><Folder to={item['title']} name={item['title']} />);
}

function FileBox(props) {

	const location = useLocation();

	useEffect(()=>{
		console.log(location);
	}, [location]);

	const folders = [{title: 'main222222222222222222222222222222222222222', folders:[
		{title: 'pictures', folders: [{title: 'f1', folders:[]}]},
		{title: 'bimba', folders: [{title: 'bmb', folders:[]}]}
	]}];



	const recF=(x,y='file/') => {
		return x.map((item)=>
				<Route exact path={item['title']} element={<><Titles names={item['folders']} /><Outlet/></>}>
					{recF(item['folders'])}
				</Route>
		);
	}


	return (
		<Box sx={{display: 'flex', flexFlow:'column', mt:'20px', bgcolor: '#ffffff', height:1}}>
			<FilePath />
			<div style={{display: 'flex', padding: 10}}>
				<Routes>
					<Route path='/' element={<><Titles names={folders} /><Outlet/></>}>
						{recF(folders)}
					</Route>
				</Routes>
			</div>
		</Box>
	);
}
export default FileBox;