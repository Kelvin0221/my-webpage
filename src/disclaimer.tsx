import { useEffect, useState } from "react";
import NavBar from "./nav-bar"
import TitleBar from "./title-bar"
import axios from "axios";

function Disclaimer(){    
    const [disclaimer, setDisclaimer] = useState("");

    async function fetchDisclaimer(){
        var result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/disclaimer`);

        if(result?.data && result?.data){
            setDisclaimer(result.data[0].summary);
        }
    }
  
    useEffect(()=>{
        fetchDisclaimer();          
    }, []);

    return <>
        <NavBar active="Disclaimer" getMode={0}></NavBar>
        <div className="main-content">
            <TitleBar title="Disclaimer"></TitleBar>
            <div id="div-selection-menu">
                <div id="div-menu-dialogue" className="text-set">
                    {disclaimer}
                </div>
            </div>
        </div>
    </>
}

export default Disclaimer;