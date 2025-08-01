import { useState } from "react";
import "./assets/style/loading.css"

function Loading({state}: {state: boolean}){

    const initLoading = "SetLoading() =>\nPage is loading...";
    const otLoading = "StillLoading() =>\nPlease wait a lil more longer...";

if(state){
    const [loadingText, setLoadingText] = useState(initLoading);    
    
    function switchText(){
        setLoadingText(otLoading);
    }

    setTimeout(switchText, 30000);

    return<>
        <div id="div-loading" className="Loading">
            <h1>
                {loadingText}
            </h1>
        </div>
        </>        
    }
    else{
        return <></>
    }
}

export default Loading;