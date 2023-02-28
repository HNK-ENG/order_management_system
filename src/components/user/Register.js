import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Form, Row, Col, FloatingLabel, Button} from 'react-bootstrap'
import {Axios, USER_REGISTER, DISTRICTS, CITIES} from '../../api/axios';
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const mockDistricts = {
    "data": [
        {
            "id": 1,
            "districtName": "Galle"
        },
        {
            "id": 2,
            "districtName": "Matar"
        },
        {
            "id": 3,
            "districtName": "Hambanthota"
        }
    ],
    "result": {
        "resultCode": "100",
        "resultDescription": "Success"
    }
}

const mockCities = {
    "data": [
        {
            "id": 1,
            "cityName": "Ahangama"
        },
        {
            "id": 2,
            "cityName": "Habaraduwa"
        },
        {
            "id": 3,
            "cityName": "Gonapinuwala"
        }
    ],
    "result": {
        "resultCode": "100",
        "resultDescription": "Success"
    }
}


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nic, setNIC] = useState('');
    const [username, setUsername] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [pwd, setPwd] = useState('');
    const [confPwd, setConfPwd] = useState('');

    const [districtList, setDistrictList] = useState();
    const [districtMap, setDistrictMap] = useState();
    const [cityList, setCityList] = useState();

    const [validName, setValidName] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const [userFocus, setUserFocus] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(async () => {
        try{
            const response = await Axios.get(DISTRICTS);
            // const response = mockDistricts
            console.log(response)
            // setDistrictList(response?.data)
            setDistrictList(response?.data?.data)


            const districtMap = new Map();
            response?.data?.data?.map((obj,_) =>(
                districtMap.set(obj.id, obj.districtName)
            ))
            setDistrictMap(districtMap);
            console.log(districtMap);
            userRef.current.focus();
        }catch (err) {
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
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === confPwd);
    }, [pwd, confPwd])

    useEffect(() => {
        setErrMsg('');
    }, [username, pwd, confPwd])


    const onDistrictSelected = async (e) => {
        try{
            const distId = parseInt(e.target.value, 10);
            console.log("qq"+distId);
            setDistrict(districtMap.get(distId));
            // console.log(district);

            const response = await Axios.get(CITIES,
                { params: { districtId: distId}});

            // const response = mockCities
            // console.log(response)
            setCityList(response?.data?.data);

        }catch (err) {
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

    const onCitySelected = async (e) => {
        console.log(e.target.value);
        setCity(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("button cliked")
        
        // if button enabled with JS hack
        // const v1 = USER_REGEX.test(username);
        // const v2 = PWD_REGEX.test(pwd);
        // if (!v1 || !v2) {
        //     setUsername('');
        //     setPwd('');
        //     setConfPwd('');
        //     setErrMsg("Invalid Entry");
        //     return;
        // }
        try {
            console.log('register')
            const response = await Axios.post(USER_REGISTER,
                JSON.stringify({ 
                    "firstName": firstName,
                    "lastName": lastName,
                    "identityNumber": nic,
                    "userName": username,
                    "district": district,
                    "city": city,
                    "street1": street1,
                    "street2": street2,
                    "houseNo": houseNo,
                    "password": pwd
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            setSuccess(true);

            //clear state and controlled inputs
            setFirstName('');
            setLastName('');
            setNIC('');
            setUsername('');
            setStreet1('');
            setStreet2('');
            setHouseNo('');
            setPwd('');
            setConfPwd('');

        } catch (err) {
            if (!err?.response) {
                // setErrMsg('No Server Response');
                setSuccess(false);

                //clear state and controlled inputs
                setFirstName('');
                setLastName('');
                setNIC('');
                setUsername('');
                setStreet1('');
                setStreet2('');
                setHouseNo('');
                setPwd('');
                setConfPwd('');

            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to="/">Sign in</Link>
                    </p>
                </section>
            ) : (
                <section className='sign sign-up'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                
                <div className='sign-image'><img src="shopme2.png" width="150" height="150"/></div>
                <h1>Sign Up</h1>

                <Row className="g-2 mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingFirstName" label="First Name">
                        <Form.Control type="input" placeholder="first name" ref={userRef} onChange={(e) => setFirstName(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingLastName" label="Last Name">
                        <Form.Control type="input" placeholder="last name" onChange={(e) => setLastName(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Form.Floating className="mb-3">
                    <Form.Control
                    id="floatingNIC"
                    type="input"
                    placeholder="nic"
                    onChange={(e) => setNIC(e.target.value)}
                    />
                    <label htmlFor="floatingNIC">NIC</label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                    <Form.Control
                    id="floatingUsername"
                    type="input"
                    placeholder="nic"
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="floatingUsername">User Name</label>
                </Form.Floating>

                <Row className="g-2 mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingDistrictSelect" label="Choose District">
                            <Form.Select aria-label="Floating label select example" onChange={onDistrictSelected}>
                                {districtList?.map((obj,_) => (
                                    <option value={obj.id}>{obj.districtName}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingCitySelect" label="Choose City">
                            <Form.Select aria-label="Floating label select example" onChange={onCitySelected}>
                                {cityList?.map((obj,_) => (
                                    <option value={obj.cityName}>{obj.cityName}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row className="g-2 mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingStreet1" label="Street 1">
                        <Form.Control type="input" placeholder="street 1" onChange={(e) => setStreet1(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingStreet2" label="Street 2">
                        <Form.Control type="input" placeholder="street 2" onChange={(e) => setStreet2(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingHouse" label="House Number">
                        <Form.Control type="input" placeholder="house number" onChange={(e) => setHouseNo(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row className="g-2 mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                        <Form.Control type="password" placeholder="password" ref={userRef} onChange={(e) => setPwd(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingConfirmPass" label="Confirm Password">
                        <Form.Control type="password" placeholder="confirm password" onChange={(e) => setConfPwd(e.target.value)}/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Button className='mt-3' variant='outline-danger' onClick={handleSubmit}>Register</Button>
                
                <p>
                    Already have an Account?<br />
                    <span className="line">
                        <Link to="/login">Sign In</Link>
                    </span>
                </p>
            </section>
            )}
        </>
    )
}

export default Register
