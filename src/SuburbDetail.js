import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {EndPointContext} from "./App";
import * as PropTypes from "prop-types";
import {ResponsivePie} from "@nivo/pie";
import {height} from "plotly.js/src/plots/layout_attributes";
import {ResponsiveScatterPlot} from "@nivo/scatterplot";
import {Alert, Button} from "react-bootstrap";

function ScatterChart(props) {
    return null;
}

ScatterChart.propTypes = {
    margin: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        bottom: PropTypes.number,
        right: PropTypes.number
    }),
    height: PropTypes.number,
    width: PropTypes.number,
    children: PropTypes.node
};

function SuburbDetail (props) {
    const {id} = useParams()
    const URLEndContext = useContext(EndPointContext)
    const [suburb, setSuburb] = useState("")
    const [dataJson, setDataJson] = useState(null)
    const getNameUrl = URLEndContext + '/get_name/' + id.toString()
    const getDetailUrl = URLEndContext + '/detail_data/' + id.toString()
    let noRenderList = []

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
            if (dataJson.hasOwnProperty('error')){
                return (
                    <div>
                        <h2>
                            Sorry, No data for this suburb.
                        </h2>
                    </div>
                )
            }
            return (
                <div>
                    {drawPieChart()}
                    {presentData()}
                    {drawBirthrate()}
                    {drawSalary()}
                    {drawUnemployment()}
                    {getMessage()}
                </div>
            )
        }
    }

    function presentData(){
        // todo
        return (
            <div>

                {fetchOne("this_happy")}
                {fetchOne("avg_happy")}
                {fetchOne("old_happy")}
            </div>
        )
    }

    function fetchOne(property){
        if (dataJson.hasOwnProperty(property)){
            return(<h3>
                this_happy is {dataJson[property]}
            </h3>)
    }


    function getMessage(){
        if (noRenderList.length > 0){
            return(
                <div>
                    <Alert>
                        The graph(s) {noRenderList.toString()} can't be drawn due to lack of data.
                    </Alert>
                </div>
            )
        }
    }

    function drawPieChart(){
        if (!dataJson['pie_chart'].hasOwnProperty('error')){
            let pieData = dataJson['pie_chart'];
            let pieDataCache = []
            let colorDataCache = []
            for (const key in pieData){
                if(pieData.hasOwnProperty(key)){
                    pieDataCache.push({
                        id: key,
                        label: key,
                        value: pieData[key],
                        color: getColor(key)
                    })
                    colorDataCache.push(getColor(key))
                }
                console.log(pieDataCache)
            }
            return(
                <div style={{ height: "500px", width: "600px" }}>
                    <ResponsivePie
                        data={pieDataCache}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.2
                                ]
                            ]
                        }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    2
                                ]
                            ]
                        }}


                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 18,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000'
                                        }
                                    }
                                ]
                            }
                        ]}
                        colors={colorDataCache}
                    />

                </div>
            )
        }
    }

    function drawBirthrate(){
        if (!dataJson['birth_happy'].hasOwnProperty('error')){
            console.log("haha")
            let fullData = []
            let decileJson = dataJson['birth_happy']["decile"]
            let decileData = []
            for(const key in decileJson){
                decileData.push({
                    x: decileJson[key]["birth"],
                    y: decileJson[key]["happy"]
                })
            }
            fullData.push({
                id: "Other Suburb",
                data: decileData
            })
            let thisData = []
            thisData.push({
                x: dataJson["birth_happy"]["this_suburb"]["birth"],
                y: dataJson["birth_happy"]["this_suburb"]["happy"]
            })
            fullData.push(
                {
                    id: "This Suburb",
                    data: thisData
                }
            )

            return(
                <div style={{ height: "500px",width: "800px", textAlign:"center"}}>
                    <ResponsiveScatterPlot
                        data={fullData}
                        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                        xScale={{ type: 'linear', min: 0, max: 'auto' }}
                        xFormat=">-.2f"
                        yScale={{ type: 'linear', min: 0, max: 'auto' }}
                        yFormat=">-.2f"
                        blendMode="multiply"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Birth Rate',
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Positive Tweet Ratio',
                            legendPosition: 'middle',
                            legendOffset: -60
                        }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        colors={["hsl(0,100%,76%)", "hsl(0,100%,29%)"]}
                    />
                </div>
            )

        }
        else{
            noRenderList.push("Birthrate")
        }
    }

    function drawSalary(){
        if (!dataJson['salary_happy'].hasOwnProperty('error')){
            let fullData = []
            let decileJson = dataJson['salary_happy']["decile"]
            let decileData = []
            for(const key in decileJson){
                decileData.push({
                    x: decileJson[key]["salary"],
                    y: decileJson[key]["happy"]
                })
            }
            fullData.push({
                id: "Other Suburb",
                data: decileData
            })
            let thisData = []
            thisData.push({
                x: dataJson["salary_happy"]["this_suburb"]["salary"],
                y: dataJson["salary_happy"]["this_suburb"]["happy"]
            })
            fullData.push(
                {
                    id: "This Suburb",
                    data: thisData
                }
            )

            return(
                <div style={{ height: "500px", width: "800px"}}>
                    <ResponsiveScatterPlot
                        data={fullData}
                        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                        xScale={{ type: 'linear', min: 0, max: 'auto' }}
                        xFormat=">-.2f"
                        yScale={{ type: 'linear', min: 0, max: 'auto' }}
                        yFormat=">-.2f"
                        blendMode="multiply"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Salary',
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Positive Tweet Ratio',
                            legendPosition: 'middle',
                            legendOffset: -60
                        }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        colors={["hsl(0,100%,76%)", "hsl(0,100%,29%)"]}
                    />
                </div>
            )

        }
        else{
            noRenderList.push("Salary")
        }
    }

    function drawUnemployment(){
        if (!dataJson['unemployment_happy'].hasOwnProperty('error')){
            let fullData = []
            let decileJson = dataJson['unemployment_happy']["decile"]
            let decileData = []
            for(const key in decileJson){
                decileData.push({
                    x: decileJson[key]["unemployment"],
                    y: decileJson[key]["happy"]
                })
            }
            fullData.push({
                id: "Other Suburb",
                data: decileData
            })
            let thisData = []
            thisData.push({
                x: dataJson["unemployment_happy"]["this_suburb"]["unemployment"],
                y: dataJson["unemployment_happy"]["this_suburb"]["happy"]
            })
            fullData.push(
                {
                    id: "This Suburb",
                    data: thisData
                }
            )

            return(
                <div style={{ height: "500px", width: "800px"}}>
                    <ResponsiveScatterPlot
                        data={fullData}
                        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                        xScale={{ type: 'linear', min: 0, max: 'auto' }}
                        xFormat=">-.2f"
                        yScale={{ type: 'linear', min: 0, max: 'auto' }}
                        yFormat=">-.2f"
                        blendMode="multiply"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Unemployment",
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Positive Tweet Ratio',
                            legendPosition: 'middle',
                            legendOffset: -60
                        }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        colors={["hsl(0,100%,76%)", "hsl(0,100%,29%)"]}
                    />
                </div>
            )

        }
        else{
            noRenderList.push("Unemployment")
        }
    }


    function getColor(mood){
        if (mood === "Positive"){
            return("hsl(0, 92%, 68%)")
        } else if (mood === "Negative"){
            return ("hsl(234, 89%, 69%)")
        }
        else return ("hsl(12, 13%, 46%)")
    }



    return(
        <div>
            <h1>{suburb}</h1>
            <Link to="/">
                <Button variant={"warning"}>Go Back to Map</Button>
            </Link>

            {drawPlots()}
        </div>
    )

}

export default SuburbDetail