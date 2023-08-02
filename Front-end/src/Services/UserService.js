// import React from 'react';
import { functionURL, getUsersURL } from '../Constants';

export const getAllUsers = async () => {
    const response = await fetch(getUsersURL, {
        method: 'GET',
    })
        .then(async response => await response.json())
        .then(async data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return {
                users: []
            };
        });
    return response;
}

export const getStats = async () => {
    const response = await fetch(functionURL + "getUserStats", {
        method: 'GET',
    })
        .then(async response => await response.json())
        .then(async data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return {
                stats: []
            };
        });
    return response;
}

export const getUserTeams = async (email) => {
    const response = await fetch(functionURL + "getUserTeams/" + email, {
        method: 'GET',
    })
        .then(async response => await response.json())
        .then(async data => {
            return data;
        })
        .catch(async error => {
            console.error(error);
            return {
                teams: []
            };
        });
    return response;
}

export const leaveTeam = async (team, email) => {
    const response = await fetch(functionURL + "leaveTeam/" + team + "/" + email, {
        method: 'POST',
    })
        .then(async response => await response.json())
        .then(async data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            return {
                status: 'failed'
            };
        });
    return response;
}

export const updateLastActivity = async (email) => {
    const response = await fetch(functionURL + "updateLastActivity/" + email, {
        method: 'PUT',
    })
        .then(async response => await response.json())
        .then(async data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            return {
                status: 'failed'
            };
        });
    return response;
}