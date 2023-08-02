import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';

import { createSession, getUserPool } from '../Services/UserPool';
import '../Styles/Authentication.css';
import '../Styles/Verification.css';
import { functionURL } from '../Constants';
import Loader from '../Components/Loader';

function Verification() {

    const navigate = useNavigate()

    const [question, setQuestion] = useState({
        type: "Q1",
        question: "What was the name of your first pet?"
    });
    const [questions,] = useState([
        {
            type: "Q1",
            question: "What was the name of your first pet?"
        },
        {
            type: "Q2",
            question: "In which city were you born?"
        },
        {
            type: "Q3",
            question: "What is your favorite book/movie/TV show? (Choose one)"
        }
    ]);
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [email, setEmail] = useState('');
    const [answer, setAnswer] = useState('');
    const [isAnswerValid, setIsAnswerValid] = useState(true);
    const [isAnswer1Valid, setIsAnswer1Valid] = useState(true);
    const [isAnswer2Valid, setIsAnswer2Valid] = useState(true);
    const [isAnswer3Valid, setIsAnswer3Valid] = useState(true);
    const [isUserVerified, setIsUserVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleNameChange = (value) => {
        setAnswer(value)
        if (value === '') {
            setIsAnswerValid(false)
            return;
        }
        setIsAnswerValid(true)
    }

    const handleAnswer1Change = (value) => {
        setAnswer1(value)
        if (value === '') {
            setIsAnswer1Valid(false)
            return;
        }
        setIsAnswer1Valid(true)
    }

    const handleAnswer2Change = (value) => {
        setAnswer2(value)
        if (value === '') {
            setIsAnswer2Valid(false)
            return;
        }
        setIsAnswer2Valid(true)
    }

    const handleAnswer3Change = (value) => {
        setAnswer3(value)
        if (value === '') {
            setIsAnswer3Valid(false)
            return;
        }
        setIsAnswer3Valid(true)
    }

    const onSubmit = async () => {
        if (isUserVerified) {
            if (answer === '') {
                setIsAnswerValid(false)
                return;
            }
            if (isAnswerValid) {
                // console.log(answer);
                // console.log(question.type);
                await setIsLoading(true);
                await fetch(functionURL + "VerifyQ&A", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "question": question.type,
                        "answer": answer
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            console.log(data);
                            localStorage.setItem('verified', 'true');
                            setIsLoading(false);
                            navigate('/home');
                        } else {
                            setIsLoading(false);
                            alert(data.message);
                        }
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error:', error);
                    });
            }
        } else {
            if (answer1 === '') {
                setIsAnswer1Valid(false)
                return;
            }
            if (answer2 === '') {
                setIsAnswer2Valid(false)
                return;
            }
            if (answer3 === '') {
                setIsAnswer3Valid(false)
                return;
            }
            if (isAnswer1Valid && isAnswer2Valid && isAnswer3Valid) {
                await setIsLoading(true);
                await fetch(functionURL + "createQ&A", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "Q1": {
                            "question": "What was the name of your first pet?",
                            "answer": answer1
                        },
                        "Q2": {
                            "question": "In which city were you born?",
                            "answer": answer2
                        },
                        "Q3": {
                            "question": "What is your favorite book/movie/TV show? (Choose one)",
                            "answer": answer3
                        }
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            console.log(data);
                            localStorage.setItem('verified', 'true');
                            setIsLoading(false);
                            navigate('/home');
                        } else {
                            setIsLoading(false);
                            alert(data.message);
                        }
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error:', error);
                    });
            }

        }
    }

    useEffect(() => {
        async function getSession() {
            await setIsLoading(true);
            await createSession(localStorage.getItem('token'), localStorage.getItem('idToken'));
            const userPool = await getUserPool();
            const currentUser = await userPool.getCurrentUser();
            await currentUser.getSession(async (err, session) => {
                if (err) {
                    console.log(err);
                } else {
                    const payload = await session.getIdToken().decodePayload();
                    // console.log(await session.getAccessToken().decodePayload());
                    const email = await payload.email;
                    await localStorage.setItem('user', JSON.stringify({
                        "email": email,
                        "name": payload.name,
                        "picture": payload.picture
                    }));
                    await localStorage.setItem('isAdmin', email === 'desaijaimin5@gmail.com' || email === 'vaidyasakshi434@gmail.com' ? 'true' : 'false');
                    await setEmail(email);
                    // console.log(payload);
                    await isUserRegistered(email);
                }
            })
        }
        getSession();
        // eslint-disable-next-line
    }, [])

    const isUserRegistered = async (email) => {
        await fetch(functionURL + "getUserStatus/" + email, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(async data => {
                if (data.status === "success") {
                    if (data.userRegistered) {
                        // console.log(questions[Math.floor(Math.random() * 3)]);
                        await setQuestion(questions[Math.floor(Math.random() * 3)])
                        await setIsUserVerified(true);
                        await setIsLoading(false);
                        // console.log(data);
                    } else {
                        await setIsUserVerified(false);
                        await setIsLoading(false);
                        // console.log(data);
                    }
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error:', error);
            });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: "#cccccc", height: '100vh' }}>
            <div className='page-card'>
                <p className="registration-header">Verification</p>
                <div className='registration-form-body'>
                    {
                        isUserVerified ?
                            <>
                                <p className="verification-question">{question.question}</p>
                                <Input status={isAnswerValid ? 'success' : 'error'} value={answer} onChange={(e) => handleNameChange(e.target.value)} size='large' placeholder="Answer" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isAnswerValid ? 'none' : 'block' }}>Answer can't be empty.</p>
                                <Button className='registration-submit' size='large' onClick={() => onSubmit()} >Submit</Button>
                            </>
                            :
                            <>
                                <p className="verification-question">{questions[0].question}</p>
                                <Input status={isAnswer1Valid ? 'success' : 'error'} value={answer1} onChange={(e) => handleAnswer1Change(e.target.value)} size='large' placeholder="Answer" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isAnswer1Valid ? 'none' : 'block' }}>Answer can't be empty.</p>
                                <p className="verification-question">{questions[1].question}</p>
                                <Input status={isAnswer2Valid ? 'success' : 'error'} value={answer2} onChange={(e) => handleAnswer2Change(e.target.value)} size='large' placeholder="Answer" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isAnswer2Valid ? 'none' : 'block' }}>Answer can't be empty.</p>
                                <p className="verification-question">{questions[2].question}</p>
                                <Input status={isAnswer3Valid ? 'success' : 'error'} value={answer3} onChange={(e) => handleAnswer3Change(e.target.value)} size='large' placeholder="Answer" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isAnswer3Valid ? 'none' : 'block' }}>Answer can't be empty.</p>
                                <Button className='registration-submit' size='large' onClick={() => onSubmit()} >Submit</Button>
                            </>
                    }
                </div>
            </div>
            <Loader isLoading={isLoading} />
        </div>
    );
}

export default Verification;
