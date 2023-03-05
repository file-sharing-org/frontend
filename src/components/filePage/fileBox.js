import {Link, Navigate} from "react-router-dom";
import React from "react";
import {Container, Box} from '@mui/material';
import FilePath from './filePath';


function FileBox(props) {
	return (
		<Box sx={{mt:'20px', bgcolor: '#ffffff', height:1}}>
			<FilePath />
		</Box>
	);
}
export default FileBox;