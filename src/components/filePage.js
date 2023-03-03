import {Link, Navigate} from "react-router-dom";
import React from "react";
import "./filePage.css";

function FilePage() {
	return (
		<div>
		<Navigate to="/login" />
		<Link to="/login">34343</Link>
			Filepage
		</div>
		);
}

export default FilePage;