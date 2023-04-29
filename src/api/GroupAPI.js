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
		return api.post('create-group',
			{
				name: groupName,
				u: users
			},
			{headers: {'Authorization': `Bearer ${token}`}});
	},
	renameGroup: ({token, oldGroupName, newGroupName})=> {
		return api.post('rename-group',
			{
				old: oldGroupName,
				new: newGroupName
			},
			{
				headers: {'Authorization': `Bearer ${token}`}
			});
	},
	deleteGroup: ({token, groupName})=>{
		return api.post('delete-group', null,
			{params:{
				name: groupName
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	addUsersToGroup: ({token, groupName, users})=>{
		return api.post('group-add-users',
			{
				name: groupName,
				u: users
			},
			{
				headers: {'Authorization': `Bearer ${token}`}
			});
	},
	deleteUsersFromGroup: ({token, groupName, users})=>{
		return api.post('group-delete-users',
			{
				name: groupName,
				u: users
			},
			{
				headers: {'Authorization': `Bearer ${token}`}
			});
	},
	createModerator: ({token, name, email, password})=> {
		return api.post('create-moderator',
			{
				name: name,
				email: email,
				password: password
			},
			{
				headers: {'Authorization': `Bearer ${token}`}
			});
	}

}