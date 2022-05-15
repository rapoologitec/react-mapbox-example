import React from "react";
import Districts from "./Districts";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home(){
    return(
        <div>
            <header className="app-header">
                <h1>Are We Happy?</h1>
                <h3>Happy Map of Greater Melbourne Area</h3>
            </header>
            <div className="body">
                <Districts />
            </div>
        </div>
    )
}

export default Home;