import { Button, Input, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import Header from '../Components/Header';
import '../Styles/Profile.css';
import { updateUserAttributes } from '../Services/UserPool';

import { imageUploadURL } from '../Constants';
import { getStats, getUserTeams, leaveTeam } from '../Services/UserService';

function Profile() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [prevName, setPrevName] = useState('');
    const [isNameValid, setIsNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const hiddenFileInput = useRef(null);
    const [file, setFile] = useState('');
    const [prevFile, setPrevFile] = useState('');
    const [teams, setTeams] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [userStats, setUserStats] = useState({
        TotalMatches: 0,
        TotalPoints: 0,
        TotalWins: 0
    });
    const [selectedUserStats, setSelectedUserStats] = useState(null);

    const emailRe = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        setName(user.name);
        setPrevName(user.name);
        setEmail(user.email);
        if (user.picture) {
            setPrevFile(user.picture);
            setFile(user.picture);
        } else {
            setFile('');
            setPrevFile('');
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        async function initialData() {
            const stats = await getStats();
            const teams = await getUserTeams(JSON.parse(localStorage.getItem('user')).email);
            console.log(stats);
            console.log(teams);
            setTeams(teams.teams);
            const currentUserStats = stats.stats.find(stat => stat.email === JSON.parse(localStorage.getItem('user')).email);
            console.log(currentUserStats);
            if (currentUserStats) {
                setUserStats(currentUserStats.stats);
            }
            setAllUsers(stats.stats);
            const otherUsers = await stats.stats.filter(stat => stat.email !== JSON.parse(localStorage.getItem('user')).email);
            const options = await otherUsers.map(user => {
                return {
                    value: user.email,
                    label: user.email
                }
            })
            setDropdownOptions(options);
        }

        initialData();
        // eslint-disable-next-line
    }, [])

    const handleEmailChange = (value) => {
        setEmail(value)
        if (!emailRe.test(value)) {
            setIsEmailValid(false)
            return;
        }
        setIsEmailValid(true)
    }

    const handleNameChange = (value) => {
        setName(value)
        if (value === '') {
            setIsNameValid(false)
            return;
        }
        setIsNameValid(true)
    }

    const handleUpdate = async () => {
        if (name === '') {
            setIsNameValid(false)
            return;
        }
        if (!emailRe.test(email)) {
            setIsEmailValid(false)
            return;
        }
        let nameToUpdate = null;
        let fileToUpdate = null;
        if (name !== prevName) {
            nameToUpdate = name;
        }
        if (file !== prevFile) {
            fileToUpdate = file;
        }
        if (fileToUpdate) {
            await uploadProfilePictureToS3();
            fileToUpdate = await JSON.parse(localStorage.getItem('user')).picture;
            console.log(fileToUpdate);
        }
        await updateUserAttributes(nameToUpdate, fileToUpdate);
    }

    const uploadProfilePictureToS3 = async () => {
        const formData = new FormData();
        await formData.append('image', file);
        for (const [name, value] of formData.entries()) {
            console.log(name, value);
        }
        await fetch(imageUploadURL, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.imageUrl) {
                    const newData = { ...JSON.parse(localStorage.getItem('user')), picture: data.imageUrl }
                    console.log(newData);
                    localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), picture: data.imageUrl }));
                    return data.imageUrl;
                } else {
                    return null;
                }
            })
            .catch(error => {
                console.error(error);
                return null;
            });
    }

    const renderTeams = () => {
        if (teams.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    You are not a member of any team.
                </div>
            )
        }
        return teams.map(team => {
            return (
                <div key={team.id} className='profile-team-div'>
                    <div className='profile-team-name'>
                        {team.name}
                    </div>
                    <div className='profile-leave-btn' onClick={() => leave(team.id)}>
                        Leave
                    </div>
                </div>
            )
        })
    }

    const leave = async (team) => {
        const response = await leaveTeam(team, JSON.parse(localStorage.getItem('user')).email);
        if(response.status === 'success') {
            const newTeams = await teams.filter(team => team.id !== team);
            setTeams(newTeams);
        }
    }

    const onFileUpload = (e) => {
        hiddenFileInput.current.click();
    }

    const onFileChange = async (e) => {
        setFile(e.target.files[0]);
    }

    const onSelectUser = async (value) => {
        console.log(value);
        const selectedUser = await allUsers.find(user => user.email === value);
        console.log(selectedUser);
        if (selectedUser) {
            setSelectedUserStats(selectedUser.stats);
        }
    }

    return (
        <>
            <div className="profile-details-div">
                <input
                    key={file}
                    type="file"
                    ref={hiddenFileInput}
                    style={{ display: 'none' }}
                    onChange={e => onFileChange(e)}
                />
                <div className="profile-image-div" onClick={() => onFileUpload()} >
                    {
                        file ?
                            <img src={file === prevFile ? file : URL.createObjectURL(file)} alt="profile" style={{ height: '100%', width: '100%', borderRadius: '50%' }} />
                            :
                            <UserOutlined style={{ fontSize: '50px' }} />
                    }
                </div>
                <div>
                    <Input value={name} status={isNameValid ? 'success' : 'error'} onChange={(e) => handleNameChange(e.target.value)} size='large' type='text' placeholder="name" className='mb-10' />
                    <p className='registration-error-message' style={{ display: isNameValid ? 'none' : 'block' }}>Name can not be empty.</p>
                    <Input disabled={true} value={email} status={isEmailValid ? 'success' : 'error'} onChange={(e) => handleEmailChange(e.target.value)} size='large' type='email' placeholder="Email" className='mb-10' />
                    <p className='registration-error-message' style={{ display: isEmailValid ? 'none' : 'block' }}>Email is not valid.</p>
                    <Button className='registration-submit' size='large' onClick={() => handleUpdate()}>Update</Button>
                </div>
            </div>
            <div className="profile-stats-card">
                <div className="profile-stats-title">
                    Your Statistics
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
                    <div>
                        <div>
                            Games Played
                        </div>
                        <div>
                            {userStats.totalMatches}
                        </div>
                    </div>
                    <div>
                        <div>
                            Games Won
                        </div>
                        <div>
                            {userStats.totalWins}
                        </div>
                    </div>
                    <div>
                        <div>
                            Total Points
                        </div>
                        <div>
                            {userStats.totalPoints}
                        </div>
                    </div>
                    <div>
                        <div>
                            Win/Loss Ratio
                        </div>
                        <div>
                            {userStats.totalMatches === 0 ? 0 : ((userStats.totalWins / userStats.totalMatches).toFixed(2) * 100) + "% / " + (100 - (userStats.totalWins / userStats.totalMatches).toFixed(2) * 100) + "%"}
                        </div>
                    </div>
                </div>
            </div>
            <div className='profile-teams-card' >
                <div style={{ width: '50%', borderRight: '1px solid grey' }}>
                    <div className='profile-teams-title'>
                        Your Teams
                    </div>
                    {renderTeams()}
                </div>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='profile-compare-title'>
                        See Others' Stats
                    </div>
                    <Select
                        placeholder="Select a user"
                        style={{ width: 320, marginTop: '20px' }}
                        onChange={onSelectUser}
                        options={dropdownOptions}
                    />
                    {
                        selectedUserStats ?
                            <div className="profile-stats-card" style={{ width: '80%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
                                    <div>
                                        <div>
                                            Games Played
                                        </div>
                                        <div>
                                            {selectedUserStats.totalMatches}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            Games Won
                                        </div>
                                        <div>
                                            {selectedUserStats.totalWins}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            Total Points
                                        </div>
                                        <div>
                                            {selectedUserStats.totalPoints}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            Win/Loss Ratio
                                        </div>
                                        <div>
                                            {selectedUserStats.totalMatches === 0 ? 0 : ((selectedUserStats.totalWins / selectedUserStats.totalMatches).toFixed(2) * 100) + "% / " + (100 - (selectedUserStats.totalWins / selectedUserStats.totalMatches).toFixed(2) * 100) + "%"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        </>
    );
}

export default Profile;