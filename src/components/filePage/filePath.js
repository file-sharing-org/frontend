import {Link, Navigate} from "react-router-dom";
import React from "react";
import {Container, Box} from '@mui/material';
import {ReactComponent as HomeImg} from '../../home.svg';
import './filePath.css';

function FileElement({src=false, text=''}) {
	const cssClass = src?'filepath_home':'filepath_normal';
	return (
		<Link className='filepath filepath_graytext'>
			{src&&<div className="filepath__svgdiv filepath_home"/>}
			{src? <HomeImg className='filepath__svg filepath_home'/>:
			<div className="filepath__text filepath_normal">{text}</div>}
			<div className='filepath__corner'>
				<div className='corner__div corner_first'/>
				<div className={`corner__div corner_second ${cssClass}`}/>
			</div>
		</Link>
	);
}

function FilePath(props) {
	return (
		<Box className="filebox filebox_gray filebox_50">
			<FileElement src={true}/>
			<FileElement text='aboba'/>
			<FileElement text='biba'/>
			<FileElement text='sib'/>
			<FileElement text='guti'/>
		</Box>
	);
}

export default FilePath;