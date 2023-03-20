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
		</>
	);
}


function FilePath({location}) {
	

	const recF=(x) => {
		console.log('PATHFILE');
		console.log(x);
		let index = 6;
		let items = [];
		while(x.indexOf('/',index)>=0) {
			index = x.indexOf('/', index);
			items.push(x.slice(0, index));
			index+=1;
		}
		if(x.length>5) {
			items.push(x);
		}
		console.log(items);
		return items.map((item)=>
			<FileElement text={item.slice(item.lastIndexOf('/')+1)} to={item}/>);
	}


	return (
		<Box className="filebox filebox_gray filebox_50">
			<FileElement src={true} to='/file'/>
			<div/>
			{recF(location.pathname)}
		</Box>
	);
}

export default FilePath;