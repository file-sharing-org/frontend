import React from "react";
import {Avatar} from '@mui/material';

function AccountInfo(props) {
	return (
		<div style={{'display':'flex', height:props.height}}>
			<div style={{marginLeft:'10px', height: props.height, 'lineHeight': props.height, 'textAlign':'center', fontWeight: 800, fontSize: `calc(${props.height}/2)`}}>{props.text}</div>
		</div>
	);
}

export default AccountInfo;
