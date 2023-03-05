import {Link, Navigate} from "react-router-dom";
import React from "react";
import {Container, Box} from '@mui/material';
import {ReactComponent as HomeImg} from '../../home.svg';

function FileElement({color='#cccccc', src=false, text=''}) {
	if(src) {
		console.log("ava");
	}
	return (
		<Link style={{display:'flex', marginRight: '5px', textDecoration: 'none',color:'#2C3E50', fontSize:'25px'}}>
			{src&&<div style={{width:'10px', lineHeight: '50px',backgroundColor: color}}/>}
			{src? <HomeImg style={{backgroundColor: color, height: '100%'}}/>:
			<div style={{lineHeight: '50px',backgroundColor: color}}>{text}</div>}
			<div style={{position: 'relative', overflow: 'hidden', 'paddingRight': '5px'}}>
				<div style={{position:'relative', top:-4, left:'2px', width: '0', height: '0', borderTop: '29px solid transparent', borderLeft: `30px solid black`, borderBottom: '29px solid transparent'}}/>
				<div style={{position:'absolute', top:-4, width: '0', height: '0', borderTop: '29px solid transparent', borderLeft: `30px solid ${color}`, borderBottom: '29px solid transparent'}}/>
			</div>
		</Link>
	);
}

function FilePath(props) {
	return (
		<Box sx={{bgcolor: '#cccccc', height:'50px', display: 'flex'}}>
			<FileElement color='#00bdd3' src={true}/>
			<FileElement text='aboba'/>
			<FileElement text='biba'/>
			<FileElement text='sib'/>
			<FileElement text='guti'/>
		</Box>
	);
}

export default FilePath;