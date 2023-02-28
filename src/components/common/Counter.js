import {useEffect, useState} from "react";


const Counter = ({onQuantityChange}) =>{
    let [num, setNum]= useState(0);


    useEffect(()=>{
        onQuantityChange(num);
    },[num])

    let incNum =()=>{
        setNum(Number(num)+1);
    };

    let decNum = () => {
        if(num>0){
            setNum(num - 1);
        }
    }

    let handleChange = (e)=>{
        setNum(e.target.value);
    }

   return(
    <>
        <div className="counter">
            <div className="input-group-prepend">
                <button className="btn btn-outline-primary" type="button" onClick={decNum}>-</button>
            </div>
            <input type="text" className="counter-input" value={num} onChange={handleChange}/>
            <div className="input-group-prepend">
                <button className="btn btn-outline-primary" type="button" onClick={incNum}>+</button>
            </div>
        </div>
   </>
  );
}
export default Counter;