import React from "react";
import api from './configAPI';

export default {
	getGroups: ()=>{
		return api.get('get-groups');
	},
	getUsersOfGroup: ({groupName}) => {
		return api.get('users-group',
			{
				params:
				{
					group: groupName
				}
			});
	},
	createGroup: ({token, groupName, users})=>{
		return api.post('create-group', null,
			{params:{
				name: groupName,
				u: users
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	renameGroup: ({token, oldGroupName, newGroupName})=> {
		return api.post('rename-group', null,
			{params:{
				old: oldGroupName,
				new: newGroupName
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	deleteGroup: ({token, groupName})=>{
		return api.post('delete-group', null,
			{params:{
				name: groupName
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	addUsersToGroup: ({token, groupName, users})=>{
		return api.post('group-add-users', null,
			{params:{
				name: groupName,
				u: users
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	deleteUsersFromGroup: ({token, groupName, users})=>{
		return api.post('group-delete-users', null,
			{params:{
				name: groupName,
				u: users
			},
			headers: {'Authorization': `Bearer ${token}`}});
	}

}