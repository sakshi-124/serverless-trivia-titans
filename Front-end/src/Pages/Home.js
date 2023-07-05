
import { useEffect } from 'react';
import Header from '../Components/Header';
import '../Styles/Home.css';
import { createSession } from '../Services/UserPool';

function Home() {

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.hash.substring(1));
        const idTokenParam = queryParameters.get("id_token");
        const accessTokenParam = queryParameters.get("access_token");
        const verified = localStorage.getItem('verified');
        if (idTokenParam && accessTokenParam) {
            localStorage.setItem('token', accessTokenParam);
            localStorage.setItem('idToken', idTokenParam);
        }
        const token = localStorage.getItem('token');
        const idToken = localStorage.getItem('idToken');
        if (token && idToken && verified !== 'true') {
            window.location.href = 'http://localhost:3000/verify';
        }
    }, [])

    return (
        <>
            {/* <Header /> */}
            Home
        </>
    )
}

export default Home;