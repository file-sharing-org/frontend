import React from "react";
import {useRef, useState} from "react";
import {Link} from "react-router-dom";
import {ReactComponent as FileAvi} from '../../../svg/avi.svg';
import {ReactComponent as FileDoc} from '../../../svg/doc.svg';
import {ReactComponent as FileDocx} from '../../../svg/docx.svg';
import {ReactComponent as FileExe} from '../../../svg/exe.svg';
import {ReactComponent as FileFolder} from '../../../svg/folder.svg';
import {ReactComponent as FileFolderLock} from '../../../svg/folderLock.svg';
import {ReactComponent as FileLogo} from '../../../svg/logo.svg';
import {ReactComponent as FileMov} from '../../../svg/mov.svg';
import {ReactComponent as FileMp3} from '../../../svg/mp3.svg';
import {ReactComponent as FileMp4} from '../../../svg/mp4.svg';
import {ReactComponent as FileNewFile} from '../../../svg/newFile.svg';
import {ReactComponent as FilePdf} from '../../../svg/pdf.svg';
import {ReactComponent as FilePpt} from '../../../svg/ppt.svg';
import {ReactComponent as FileRar} from '../../../svg/rar.svg';
import {ReactComponent as FileRtf} from '../../../svg/rtf.svg';
import {ReactComponent as FileTxt} from '../../../svg/txt.svg';
import {ReactComponent as FileXls} from '../../../svg/xls.svg';
import {ReactComponent as FileXlsx} from '../../../svg/xlsx.svg';
import {ReactComponent as FileZip} from '../../../svg/zip.svg';
import {ReactComponent as FileDefault} from '../../../svg/file.svg';
import './file.css';
import {Tooltip } from '@mui/material';

function File({name='', onmenu}) {
	const fileRef = useRef(null);
	const format = name.slice(name.lastIndexOf('.')+1);
	const svg = {
		avi:FileAvi,
		doc:FileDoc,
		docx:FileDocx,
		exe:FileExe,
		folder:FileFolder,
		folderLock:FileFolderLock,
		logo:FileLogo,
		mov:FileMov,
		mp3:FileMp3,
		mp4:FileMp4,
		pdf:FilePdf,
		ppt:FilePpt,
		rar:FileRar,
		rtf:FileRtf,
		txt:FileTxt,
		xls:FileXls,
		xlsx:FileXlsx,
		zip:FileZip
	};

	const SVG = (format in svg)?svg[format]:FileDefault;

	const handleMenu = (e) => {
		e.target=fileRef.current;
		e.fileName = name;
		onmenu(e);
	}

	return (
		<div className='file' ref={fileRef} onContextMenu={handleMenu}>
			<SVG className='file__svg'/>
			<Tooltip title={name} enterDelay={500}>
			<p className='file__text'>{name}</p>
			</Tooltip>
		</div>
		
	);
}

function NewFile({onFile}) {
	const fileInput = useRef(null);
	const clickHandle = () => {
		fileInput.current.click();
	}

	const handleFile = (e) => {
		const selFile = Array.from(e.target.files);
		if(selFile!=null)
			onFile(selFile);
	}

	return (
		
		<div className='file' onClick={clickHandle}>
			<FileNewFile className='file__svg'/>
			<input ref={fileInput} type='file' name='file' style={{display: 'none'}} onChange={handleFile}/>
		</div>
	);
}

export {File, NewFile};