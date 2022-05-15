import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function SuburbDetail (props) {
    const {id} = useParams()

    useEffect(()=>{

        console.log(id)
    },[])
    return(
        <h1>
            {id}
        </h1>
    )

}

export default SuburbDetail