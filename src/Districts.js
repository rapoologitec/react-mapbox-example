import React, { useState, useEffect, useRef } from "react";
import mnDistricts from "./data/mn/mn-districts.geojson";
import melDistricts from "./data/mn/psma_melb_boundary_with_id.geojson";
import mapboxgl from 'mapbox-gl';
import geojsonfile from "./data/mn/psma_melb_boundary_with_id.geojson";


function Districts(props) {

    //Assign the Mapbox token from the environment variable set in .env
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

    const geojsonfile = require('./data/mn/psma_melb_boundary_with_id.geojson')

    const mapContainer = useRef(null);

    const [long, setLong] = useState(144.96229458671036);
    const [lat, setLat] = useState(-37.81231107895544);
    const [zoom, setZoom] = useState(7);

    const [hoveredDistrict, _setHoveredDistrict] = useState(null);
    const hoveredDistrictRef = useRef(hoveredDistrict);

    const setHoveredDistrict = data => {
        hoveredDistrictRef.current = data;
        _setHoveredDistrict(data)
    };

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
                    'fill-color': '#f08',
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

        });
    }, []);

    return (
        <div className="district-map-wrapper">

            <div className="info">
                Current hovered district: <strong>{hoveredDistrict ? hoveredDistrict : ""}</strong>
            </div>
            <div id="districtDetailMap" className="map">
                <div style={{ height: "100%" }} ref={mapContainer}>
                </div>
            </div>
        </div>
    );
}

export default Districts;