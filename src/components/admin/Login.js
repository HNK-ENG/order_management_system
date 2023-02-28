import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import {GetRolesByIDs} from '../../context/Globals'
import {Axios, SetAuthToken, USER_AUTHENTICATE} from '../../api/axios';
import jwt from 'jwt-decode'
import axios from 'axios';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const response = await Axios.post(USER_AUTHENTICATE,
            //     JSON.stringify({ 
            //         "userName": user, 
            //         "password":pwd 
            //     }),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         withCredentials: true
            //     }
            // );
            
            const response = await axios.post("http://localhost:7001/authenticate",
                JSON.stringify({ 
                    "userName": user, 
                    "password":pwd 
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(response);

            // const response = {
            //     "data": {
            //         "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyIxIl0sInVzZXJJZCI6MTExLCJzdWIiOiJoYXNAMTk5OCIsImlhdCI6MTY3NzQxNTMwNiwiZXhwIjoxNjc3NDE4OTA2fQ.zJrYo7Tvls7y3ZVtGRXEcuEqRs2c-_ueoZFr7svuCkE"
            //     },
            //     "result": {
            //         "resultCode": "100",
            //         "resultDescription": "Success"
            //     }
            // }

            const token = response?.data?.data?.token;
            SetAuthToken(token);
            const decodedToken = jwt(token);
            const roles = GetRolesByIDs(decodedToken?.roles);
            const userId = decodedToken?.userId;

            setAuth({ userId, roles, token });
            setUser('');
            setPwd('');
            navigate("/admin", { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
            <section  className='sign'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                
                <div className='sign-image'><img src="shopme2.png" width="150" height="150"/></div>
                <h1>Sign In</h1>
                
                <form>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <Button className='mt-3' variant='outline-danger' onClick={handleSubmit}>Sign In</Button>
                </form>
            </section>

    )
}

export default Login