import React from "react";
import api from './configAPI';

export default {
	openFolder: ({path, token}) => {
		return api.get('open-folder',
			{params:{
				folder:path
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	uploadFile: ({file, path, token}) => {
		let formData = new FormData();
		formData.append('file', file);
		formData.append('folder', path);
		return api.post('upload-file', formData,
			{headers: {'Authorization': `Bearer ${token}`}})
	},
	downloadFile: ({name, token}) => {
		return api({
		    url: 'files?path='+name, //your url
		    method: 'GET',
		    responseType: 'blob', // important
		    headers: {Authorization: `Bearer ${token}`},
		});
	},
	copyFile: ({filename, path, token}) => {
		return api.post('copy-file', null,
			{params:{
				file: filename,
				path: path
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	copyFolder: ({filename, path, token}) => {
		return api.post('copy-folder', null,
			{params:{
				folder: filename,
				path: path
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	rebaseFile: ({filename, path, token}) => {
		return api.post('rebase-file', null,
			{params:{
				file: filename,
				path: path
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	rebaseFolder: ({filename, path, token}) => {
		return api.post('rebase-folder', null,
			{params:{
				folder: filename,
				path: path
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	renameFile: ({name, newName, token}) => {
		return api.post('rename-file', null,
			{params:{
				file: name,
				name: newName
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	renameFolder: ({name, newName, token}) => {
		return api.post('rename-folder', null,
			{params:{
				folder: name,
				name: newName
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	deleteFile: ({name, token}) => {
		return api.post('delete-file', null,
			{params:{
				file: name
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	deleteFolder: ({name, token}) => {
		return api.post('delete-folder', null,
			{params:{
				folder: name
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	addGroups: ({token, groups, filepath, permission})=>{
		return api.post('permission-add-groups',
		{
			path: filepath,
			g: groups,
			permission: permission
		},
		{
			headers: {'Authorization': `Bearer ${token}`}
		})
	},
	addUsers: ({token, users, filepath, permission})=>{
		return api.post('permission-add-users', 
		{
			path: filepath,
			u: users,
			permission: permission
		},
		{
			headers: {'Authorization': `Bearer ${token}`}
		})
	},
	deleteGroups: ({token, groups, filepath, permission})=>{
		return api.post('permission-delete-groups',
		{
			path: filepath,
			g: groups,
			permission: permission
		},
		{
			headers: {'Authorization': `Bearer ${token}`}
		})
	},
	deleteUsers: ({token, users, filepath, permission})=>{
		return api.post('permission-delete-users',
		{
				path: filepath,
				u: users,
				permission: permission
		},
		{
			headers: {'Authorization': `Bearer ${token}`}
		})
	},
	createFolder: ({name, token}) => {
		return api.post('create-folder', null,
			{params:{
				folder:name
			},
			headers: {'Authorization': `Bearer ${token}`}});
	},
	createLink: ({token, filename})=> {
		return api.post('create-link', null,
			{params:{
				path: filename
			},
			headers: {'Authorization': `Bearer ${token}`}});
	}
}