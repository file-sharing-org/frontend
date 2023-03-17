import React from "react";
import {Container, Box, Tooltip} from '@mui/material';
import {ReactComponent as HomeImg} from '../../home.svg';
import {Link, Route, Routes, Navigate, Outlet } from "react-router-dom";
import './filePath.css';

function FileElement({src=false, text='', to='#'}) {
	console.log(to);
	const cssClass = src?'filepath_home':'filepath_normal';
	return (
		<>
		<Link className='filepath filepath_graytext' to={to}>
			{src&&<div className="filepath__svgdiv filepath_home"/>}
			{src? <HomeImg className='filepath__svg filepath_home'/>:<Tooltip title={text} enterDelay={400}>
			<div className="filepath__text filepath_normal">{text}</div></Tooltip>}
			<div className='filepath__corner'>
				<div className='corner__div corner_first'/>
				<div className={`corner__div corner_second ${cssClass}`}/>
			</div>
		</Link>
		<Outlet/>
		</>
	);
}

function RecRoute() {
	return (<Route path='aboba'/>);
}


function FilePath(props) {
	console.log(window.location.pathname);
	const folders = [{title: 'main222222222222222222222222222222222222222', folders:[
		{title: 'pictures', folders: [{title: 'f1', folders:[]}]},
		{title: 'bimba', folders: [{title: 'bmb', folders:[]}]}
	]}];
	

	const recF=(x, to='/file') => {
		return x.map((item)=>
				<Route path={item['title']} element={<FileElement text={item['title']} to={`${to}/${item['title']}`}/>}>
					{recF(item['folders'], `${to}/${item['title']}`)}
				</Route>
		);
	}


	return (
		<Box className="filebox filebox_gray filebox_50">
			<FileElement src={true} to='/file'/>
			<div/>
			<Routes>
				{recF(folders)}
			</Routes>
		</Box>
	);
}

export default FilePath;