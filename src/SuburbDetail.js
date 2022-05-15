import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {EndPointContext} from "./App";

function SuburbDetail (props) {
    const {id} = useParams()
    const URLEndContext = useContext(EndPointContext)
    const [suburb, setSuburb] = useState("")
    const [dataJson, setDataJson] = useState(null)
    const getNameUrl = URLEndContext + '/get_name/' + id.toString()
    const getDetailUrl = URLEndContext + '/detail_data/' + id.toString()

    useEffect(()=>{
        fetch(getNameUrl).then(
            res => res.text()
        ).then(
                data => setSuburb(data)
        )

        fetch(getDetailUrl).then(
            response => response.json()
        ).then(
            (jdata) => {
                setDataJson(jdata);
                console.log(jdata)
            }
        )
    },[])

    function drawPlots(){
        if(!dataJson){
            return(
                <div>
                    <h2>
                        Data Loading...
                    </h2>
                </div>
            )
        }
        else{
            return (
                <div>
                    {drawPieChart()}
                </div>
            )
        }
    }

    function drawPieChart(){
        console.log(dataJson)
        if (!dataJson['pie_chart'].hasOwnProperty('error')){
            let pieData = dataJson['pie_chart'];
            let pieValue = []
            let pieLabel = []
            for (const key in pieData){
                if(pieData.hasOwnProperty(key)){
                    pieValue.push(pieData[key])
                    pieLabel.push(key)
                }
            }
            return(
                <div>
                    {/*<PieChart width = {500} height={500}>*/}
                    {/*    <Pie data*/}
                    {/*</PieChart>*/}
                </div>
            )
        }
    }



    return(
        <div>
            <h1>{suburb}</h1>
            {drawPlots()}
        </div>
    )

}

export default SuburbDetail