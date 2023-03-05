import {Link, Navigate} from "react-router-dom";
import React from "react";
import {Container, Box} from '@mui/material';
import {ReactComponent as HomeImg} from '../../home.svg';
import './filePath.css';

function FileElement({color='#cccccc', src=false, text=''}) {
	if(src) {
		console.log("ava");
	}
	return (
		<Link className='filepath filepath_cyan'>
			{src&&<div className="filepath__svgdiv" style={{backgroundColor: color}}/>}
			{src? <HomeImg className='filepath__svg' style={{backgroundColor: color}}/>:
			<div className="filepath__text" style={{backgroundColor: color}}>{text}</div>}
			<div className='filepath__corner'>
				<div className='corner__div corner_first'/>
				<div className='corner__div corner_second' style={{borderLeft: `30px solid ${color}`}}/>
			</div>
		</Link>
	);
}

function FilePath(props) {
	return (
		<Box className="filebox filebox_white">
			<FileElement color='#00bdd3' src={true}/>
			<FileElement text='aboba'/>
			<FileElement text='biba'/>
			<FileElement text='sib'/>
			<FileElement text='guti'/>
		</Box>
	);
}

export default FilePath;