import React from "react";
import {useRef} from 'react';
import {Link} from "react-router-dom";
import {ReactComponent as FolderSvg} from '../../../svg/folder.svg';
import {ReactComponent as FolderLockSvg} from '../../../svg/folderLock.svg';
import './folder.css';
import {Tooltip } from '@mui/material';

function Folder({onmenu, name='', lock=false, to='#'}) {

	const folderRef = useRef(null);

	const handleMenu = (e) => {
		e.target=folderRef.current;
		e.fileName = name;
		e.isFolder = true;
		onmenu(e);
	}

	return (
		
		<div ref={folderRef} className='folder' onContextMenu={handleMenu}>
			<Link to={to} className='folder__link'>
				
					{lock?	<FolderLockSvg className='folder__svg'/>:
							<FolderSvg className='folder__svg'/>}
					<Tooltip title={name} enterDelay={500}>
					<p className='folder__text'>{name}</p>
					</Tooltip>
				
			</Link>
		</div>
		
	);
}

export default Folder;