import { useEffect, useState, useRef } from 'react';
import {Button, Modal, DropdownButton, Dropdown} from 'react-bootstrap';
import {ToTitleCase} from '../../context/Globals';
import Counter from '../common/Counter';
import {Axios, SALES_ITEMS, PLACE_NEW_ORDER} from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const mockData = {
    "data": [
        {
            "id": 1,
            "itemName": "Soap",
            "itemsPerCost": 150
        },
        {
            "id": 2,
            "itemName": "Tooth Paste",
            "itemsPerCost": 150
        },
        {
            "id": 3,
            "itemName": "Tooth Brush",
            "itemsPerCost": 200
        },
        {
            "id": 4,
            "itemName": "Butter 400g",
            "itemsPerCost": 750
        }
    ],
    "result": {
        "resultCode": "100",
        "resultDescription": "Success"
    }
}


function NewOrder(props) {
    const errRef = useRef();
    const { auth } = useAuth();
    
    const [errMsg, setErrMsg] = useState('');
    const [itemsData, setItemsData] = useState();
    const [currentItem, setCurrentItem] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setErrMsg('');
    }, [quantity, currentItem])

    useEffect(async ()=>{
        try{
            const response = await Axios.get(SALES_ITEMS);
            // const response = mockData
            console.log(response?.data)
            setItemsData(response?.data?.data);
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
    },[])

    const onItemSelected = (e) =>{
        setCurrentItem(e)
    }

    const onQuantityChange = (num) => {
        setQuantity(num);
    }

    const onPlaceOrder = async (e) => {
        try{
            await Axios.post(PLACE_NEW_ORDER,
                JSON.stringify({ 
                            "customerId": auth.userId, 
                            "itemName":currentItem.itemName,
                            "quantity":quantity, 
                            "totalCost":(currentItem.itemsPerCost * quantity), 

                        }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                        });
            props.onHide();
            
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

    const onClose = (e) =>{
        setErrMsg('');
        props.onHide();
    }

    return (
        <div>         
            <Modal
            {...props}
            size="md-down"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Place New Order Here
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                <div className="filters">
                    <DropdownButton 
                        className="filter-status" 
                        id="item-dropdown" 
                        title="Item Name" 
                        variant="outline-dark" 
                        size="sm">
                            {itemsData?.map((obj, _)=>(
                                <Dropdown.Item key={obj.id} onClick={()=>onItemSelected(obj)}>{obj.itemName}</Dropdown.Item>
                            ))}
                    </DropdownButton>

                    <label className='filter-label item'>{currentItem? ToTitleCase(currentItem.itemName) : "" }</label>
                </div>

                <Counter onQuantityChange={onQuantityChange}/>

                <div className="filters">
                    <div className='w-50 fw-bold'>Total Amount</div>

                    <label className='filter-label item'>{currentItem? (currentItem.itemsPerCost * quantity) : "" }</label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={onPlaceOrder}>Place Order</Button>
            </Modal.Footer>
            </Modal>
        </div>
    );
}

export default NewOrder;