import "./assets/style/loading.css"

function Loading({state}: {state: boolean}){
    if(state){
    return<>
        <div id="div-loading" className="Loading">
            <h1>
                {"SetLoading() =>\n {\nPage is loading...\n}"}
            </h1>
        </div>
        </>        
    }
    else{
        return <></>
    }
}

export default Loading;