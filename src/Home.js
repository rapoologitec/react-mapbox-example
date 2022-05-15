import React from "react";
import Districts from "./Districts";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home(){
    return(
        <div>
            <header className="app-header">
                <h1>Minnesota Congressional Districts</h1>
                <h3>Data as of 2019</h3>
            </header>
            <div className="body">
                <Districts />
            </div>
        </div>
    )
}

export default Home;