import {useState, useEffect, useRef} from 'react';
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {Table, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {Axios, SALES_ORDER_HISTORY, SALES_ORDER_CANCEL, SALES_ORDER_CONFIRM} from '../../api/axios';
import {USER_TABLE_HEADS, USER_ACTION_ENABLED_STATUS, ToTitleCase, GetUserActionByStatus} from '../../context/Globals';
import NewOrder from './NewOrder';

const mockData = {
    "data": {
        "pageNumber": 1,
        "itemsPerPage": 2,
        "totalRecords": 3,
        "data": [
            {
                "totalRecord": 3,
                "orderId": "7",
                "status": "NEW",
                "customerId": "12",
                "itemName": "Tooth Paste",
                "quantity": "1",
                "totalCost": "150",
                "createdDatetime": "2023-02-25 15:33:10.317"
            },
            {
                "totalRecord": 3,
                "orderId": "2",
                "status": "NEW",
                "customerId": "12",
                "itemName": "Tooth Paste",
                "quantity": "1",
                "totalCost": "150",
                "createdDatetime": "2023-02-23 09:07:33.889"
            },
            {
                "totalRecord": 3,
                "orderId": "3",
                "status": "DISPATCHED",
                "customerId": "15",
                "itemName": "Slippers",
                "quantity": "3",
                "totalCost": "460",
                "createdDatetime": "2023-02-23 09:07:33.889"
            },
            {
                "totalRecord": 3,
                "orderId": "4",
                "status": "CANCELLED",
                "customerId": "40",
                "itemName": "Bottle",
                "quantity": "3",
                "totalCost": "2070",
                "createdDatetime": "2023-02-23 09:07:33.889"
            },
            {
                "totalRecord": 3,
                "orderId": "4",
                "status": "SUCCESS",
                "customerId": "46",
                "itemName": "Laptop",
                "quantity": "1",
                "totalCost": "20700090",
                "createdDatetime": "2023-02-23 09:07:33.889"
            },
        ]
    },
    "result": {
        "resultCode": "100",
        "resultDescription": "Success"
    }
}

const Home = () => {
    const errRef = useRef();
    const { auth ,setAuth } = useAuth();
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [status, setStatus] = useState('ALL');
    const [data, setData] = useState();
    const [modalShow, setModalShow] = useState(false);

    useEffect(async ()=>{
        setErrMsg('')
        getSalesOrderHistory(status)
    },[status, modalShow])

    const getSalesOrderHistory = async (status) => {
        try{
            const customerId = auth?.userId;
            console.log(customerId);
            const response = await Axios.get(SALES_ORDER_HISTORY,
            { params: { pageNumber: 1, itemsPerPage:1000, customerId, status } });
            // const response = mockData
            setData(response?.data?.data?.data);
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

    const logout = async () => {
        setAuth({});
        navigate('/login');
    }

    const onActionClicked = async (obj) => {
        try{
            setErrMsg('')
            switch(obj.status){
                case "NEW":
                    await Axios.get(SALES_ORDER_CANCEL + "/" + obj.orderId);
                    break;
                case "DISPATCHED":
                    await Axios.get(SALES_ORDER_CONFIRM + "/" + obj.orderId);
                    break;
            }
            getSalesOrderHistory(status);
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

    const onStatusSelected = (e) =>{
        setStatus(e)
    }

    return (
        <div className="home">
            <div className='navbar'>
                <div className='sign-image'><img src="shopme.png" width="150" height="50"/></div>

                <div>
                    <Button className='button-new-order' variant='danger' size='sm' onClick={() => setModalShow(true)}> + Place New Order</Button>
                    <Button variant='outline-dark' size='sm' onClick={logout}>Sign Out</Button>
                </div>
            </div>

            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <div className="filters">
                        <div>Filters</div>

                        <DropdownButton 
                            className="filter-status" 
                            id="status-dropdown" 
                            title="status" 
                            variant="outline-dark" 
                            size="sm" onSelect={onStatusSelected}>
                                <Dropdown.Item eventKey="ALL">All</Dropdown.Item>
                                <Dropdown.Item eventKey="NEW">New</Dropdown.Item>
                                <Dropdown.Item eventKey="DISPATCHED">Dispatched</Dropdown.Item>
                                <Dropdown.Item eventKey="SUCCESS">Success</Dropdown.Item>
                                <Dropdown.Item eventKey="CANCELLED">Cancelled</Dropdown.Item>
                        </DropdownButton>

                        <label className='filter-label'>{status? ToTitleCase(status) : "All" }</label>
            </div>

            <section>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        {USER_TABLE_HEADS.map((head, index) => <th key={index}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                        {data?.map((obj, _) => (
                            <tr>
                                <td>{obj.orderId}</td>
                                <td><label className={obj.status==="NEW"?'new':
                                                        obj.status==="DISPATCHED"?'Dispatched':
                                                        obj.status==="SUCCESS"?'success':
                                                        obj.status==="CANCELLED"?'cancel': null}>{obj.status}</label></td>
                                <td>{ToTitleCase(obj.itemName)}</td>
                                <td>{obj.quantity}</td>
                                <td>{obj.totalCost}</td>
                                <td>{obj.status.toUpperCase() in USER_ACTION_ENABLED_STATUS && GetUserActionByStatus(obj.status.toUpperCase()) ?
                                    <Button
                                        size="sm"
                                        variant={obj.status.toUpperCase()=== "NEW"? "outline-danger": 
                                            (obj.status.toUpperCase()=== "DISPATCHED"?"outline-success":null)}
                                        onClick={()=>onActionClicked(obj)}>{GetUserActionByStatus(obj.status.toUpperCase())}
                                    </Button> : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>

            <NewOrder
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>  
    )
}

export default Home
