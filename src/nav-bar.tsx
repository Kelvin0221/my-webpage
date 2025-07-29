import { useNavigate, type NavigateFunction } from "react-router-dom";
import "./assets/style/nav-bar.css";

function NavBar({active, getMode}: {active:string, getMode: number}){
    let navigate = useNavigate();

    let menu = [];
    const pages = [
        ["/", "Home"],
        ["/aboutme", "About Me"],
        ["/skills",  "Skills"],
        //["/app", "App"]
    ]

    for(let i=0; i<pages.length; i++){
        switch (getMode){
            case 1:
                menu.push(getListItem(pages[i][0],pages[i][1],navigate,(active===pages[i][1])));
                break;
            default:
                menu.push(getAnchor(pages[i][0],pages[i][1],navigate,(active===pages[i][1])));

        }
    }

    return <>
        <div id="nav-bar" className="topnav">
            {menu}
        </div>
    </>
}

function getAnchor(navTo: string, name: string, navigate: NavigateFunction, active: boolean){
    return <a key={name} onClick={() => navigate(navTo)} className={active?"active":""}>{name}</a>
}

function getListItem(navTo: string, name: string, navigate: NavigateFunction, active: boolean){
    return <li key={name} onClick={() => navigate(navTo)} className={active?"active":""}>{name}</li>
}

export default NavBar;