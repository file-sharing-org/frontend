import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as FileTxt} from '../../../svg/txt.svg';
import {ReactComponent as FileZip} from '../../../svg/zip.svg';
import './file.css';
import {Tooltip } from '@mui/material';

function File({name=''}) {
	const format = name.slice(name.lastIndexOf('.')+1);
	const svg = {
		txt: FileTxt,
		zip: FileZip
	};
	const SVG = svg[format];
	return (
		
		<div className='file'>
			<SVG className='file__svg'/>
			<Tooltip title={name} enterDelay={500}>
			<p className='file__text'>{name}</p>
			</Tooltip>
		</div>
		
	);
}

export default File;