import React, { useState, useEffect, useRef } from "react";
import mnDistricts from "./data/mn/mn-districts.geojson";
import melDistricts from "./data/mn/psma_melb_boundary_with_id.geojson";
import mapboxgl from 'mapbox-gl';
import geojsonfile from "./data/mn/psma_melb_boundary_with_id.geojson";
import {Navigate} from "react-router-dom";
import {Alert, Button} from "react-bootstrap";


function Districts(props) {

    //Assign the Mapbox token from the environment variable set in .env
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

    const geojsonfile = require('./data/mn/psma_melb_boundary_with_id.geojson')

    const mapContainer = useRef(null);

    const [long, setLong] = useState(144.96229458671036);
    const [lat, setLat] = useState(-37.81231107895544);
    const [zoom, setZoom] = useState(7);
    const [idJson, setIdJson] = useState(null);

    const [hoveredDistrict, _setHoveredDistrict] = useState(null);
    const hoveredDistrictRef = useRef(hoveredDistrict);
    const [jump, setJump] = useState(null)
    const [colorArr, setColorArr] = useState(null)
    const refmap = useRef(null)

    let setHoveredDistrict = data => {
        hoveredDistrictRef.current = data;
        if (idJson){
            _setHoveredDistrict(idJson[data])
        }

    };

    useEffect(() => {
        fetch('http://localhost:5000/suburb_id').then(
            response => response.json()
        ).then( (data)=>{
                setIdJson(data);
            }
        )
        fetch("http://localhost:5000/get_colour").then(
            response => response.json()).then(
                (data) => {
                    let colorArray = [];
                    colorArray.push("match");
                    colorArray.push(["get", "id"])
                    for (const key in data){
                        if(data.hasOwnProperty(key)){
                            colorArray.push(key.toString())
                            let ColorString = "#"
                            let rstr = data[key]["red"].toString(16);
                            let gstr = data[key]["green"].toString(16);
                            let bstr = data[key]["blue"].toString(16);
                            if (rstr.length === 1){
                                rstr = "0" + rstr
                            }
                            if (gstr.length === 1){
                                gstr = "0" + gstr
                            }
                            if (bstr.length === 1){
                                bstr = "0" + bstr
                            }
                            ColorString = ColorString + rstr + gstr + bstr
                            colorArray.push(ColorString)
                        }
                    }
                    colorArray.push("#808080")
                    setColorArr(colorArray)
                    console.log(colorArray)
                }
        )
    }, [])

    useEffect(() => {
        if (refmap.current && colorArr) {
            refmap.current.setPaintProperty('district-layer', 'fill-color', colorArr)
            refmap.current.setPaintProperty('district-layer', 'fill-opacity', 0.8)
        }
    }, [refmap, colorArr])

    useEffect(() => {
        let map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [long, lat],
            zoom: zoom
        });


        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        map.once("load", function () {

            map.addSource('district-source', {
                'type': 'geojson',
                'data': melDistricts
            });

            map.addLayer({
                'id': 'district-layer',
                'type': 'fill',
                'source': 'district-source',
                'layout': {},
                'paint': {
                    'fill-color': "#808080",
                    'fill-opacity': 0.4
                }
            });

            map.on('mousemove', 'district-layer', function (e) {
                if (e.features.length > 0) {
                    if (hoveredDistrictRef.current && hoveredDistrictRef.current > -1) {
                        map.setFeatureState(
                            { source: 'district-source', id: hoveredDistrictRef.current },
                            { hover: false }
                        );
                    }

                    let _hoveredDistrict = e.features[0].id;

                    map.setFeatureState(
                        { source: 'district-source', id: _hoveredDistrict },
                        { hover: true }
                    );

                    setHoveredDistrict(_hoveredDistrict);
                }

            });

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on('mouseleave', 'district-layer', function () {
                if (hoveredDistrictRef.current) {
                    map.setFeatureState(
                        { source: 'district-source', id: hoveredDistrictRef.current },
                        { hover: false }
                    );
                }
                setHoveredDistrict(null);
            });

            map.on('move', () => {
                const { lng, lat } = map.getCenter();

                setLong(lng.toFixed(4));
                setLat(lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });

            map.on('click', 'district-layer', (e)=> {
                    console.log(hoveredDistrictRef.current)
                    setJump(hoveredDistrictRef.current)

                }

            )

        refmap.current = map
        });
    }, [idJson]);

    function navigator(){
        if (jump){
            return(
                <div>
                    <Navigate to={"/suburb/" + jump}/>
                </div>
            )
        }
    }




    return (
        <div className="district-map-wrapper">
            {navigator()}

            <div className="info">
                Current hovered district: <strong>{hoveredDistrict ? hoveredDistrict : ""}</strong>
                <Alert key={"primary"} variant={"primary"}>
                    Click on map to view suburb detail!
                </Alert>
            </div>

            <div id="districtDetailMap" className="map">
                <div style={{ height: "100%" }} ref={mapContainer}>
                </div>
            </div>


        </div>
    );
}

export default Districts;