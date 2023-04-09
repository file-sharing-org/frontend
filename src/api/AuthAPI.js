import React from "react";
import api from './configAPI';

export default {
	login: ({name, password}) => {
		return api.post('login',
			{
				name: name,
				password: password
			},
			{headers:{
				'Content-Type': 'application/json'
			}});
	},
	register: ({email, name, password, password_confirmation}) => {
		return api.post('register', 
			{
				email: email,
				name: name,
				password: password,
				password_confirmation: password_confirmation,
			}, 
			{headers: {'Content-Type': 'application/json'}});
	},
	refresh: ({token}) => {
		return api.post('refresh', null,
			{headers: {'Authorization': `Bearer ${token}`}})
	}
}