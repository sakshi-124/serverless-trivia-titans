import { Button, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import Header from '../Components/Header';
import '../Styles/Profile.css';
import { updateUserAttributes } from '../Services/UserPool';

import { imageUploadURL } from '../Constants';

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

    const onFileUpload = (e) => {
        hiddenFileInput.current.click();
    }

    const onFileChange = async (e) => {
        setFile(e.target.files[0]);
    }

    return (
        <>
            <Header />
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
        </>
    );
}

export default Profile;