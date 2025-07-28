import { useEffect, useState } from "react";
import NavBar from "./nav-bar";
import axios, { type AxiosResponse } from "axios";
import TitleBar from "./title-bar";
import Typewriter from "./typewriter";
import MenuBuilder from "./menu-builder";
import "./assets/style/index.css";
import "./assets/style/menu-builder.css";
import { useUserContext } from "./assets/context/usercontext";
import Loading from "./loading";

//https://stackoverflow.com/questions/70714690/buffer-is-not-defined-in-react-vite


function AboutMe(){
    const [menuDialogIndex, setMenuDialogIndex] = useState(0);
    const [dialogueSet, setDialogueSet] = useState<string>("");
    const [autoClickMenu, setAutoClickMenu] = useState(0);
    const [loading, setLoading] = useState(false);

    const username = useUserContext().username;

    var menuList: [string, string][] = [
        ["aboutme","About Me"],
        ["freetime","Activity During Free Time"],
        ["currentstatus", "Current Status"]
    ]
    var mb = new MenuBuilder(menuList);

    var startingSet = [
        "Hello " + username + ",",
        "I see you want to know about me.\n",
        "Now, let's get started.\n\n",
        "Please choose what you like to read:"
    ]

    async function fetchAboutMe(aboutMeType: string)
    {
        try{
            setLoading(true);
            var result: AxiosResponse| undefined;
            switch (aboutMeType){
                case "aboutme":
                    result = await axios.get("http://localhost:8080/api/aboutme/aboutme");
                break;
                case "freetime":
                    result = await axios.get("http://localhost:8080/api/aboutme/freetime");   
                break;
                case "currentstatus":
                    result = await axios.get("http://localhost:8080/api/aboutme/status");   
                break;
                default:
                    result = undefined;
            }
            (result !== undefined)?setDialogueSet(result.data[0].summary):console.error("Invalid fetch operation");

        }catch(e){            
            setDialogueSet("Sorry, there's nothing in there... :(");
        }finally{
            setLoading(false);
        }
    }
    
        
    useEffect(()=>{
        setAutoClickMenu(
            Typewriter.createAutoClick(document.getElementById("div-menu-dialogue") as HTMLElement, 2000)
        );
    }, [])

    const menuClick = async (id: string) => {
        const divContentDialog = document.getElementById("div-content-dialogue");
        if(divContentDialog !== null){
            divContentDialog.innerHTML="";
        }

        //get info
        setDialogueSet("");
        await fetchAboutMe(id);
    }

    function nextDialogue(displayMode: string){
        switch (displayMode){
            case "menu":
                const divMenuDialog = document.getElementById("div-menu-dialogue") as HTMLElement;

                if(menuDialogIndex < startingSet.length){
                    var typeWriter = new Typewriter(50, divMenuDialog);
                    typeWriter.insertString(startingSet[menuDialogIndex]).begin();
                    setMenuDialogIndex(menuDialogIndex+1);
                }else{
                    if(document.getElementById("div-menu")?.innerHTML === ""){
                        mb.getULMenuList(menuClick, document.getElementById("div-menu") as HTMLElement);
                    }
                    clearInterval(autoClickMenu);
                }
                break;
            case "content":
                if(dialogueSet !== ""){
                    
                }
                break;
            default:
        }
    }

    return <>
        <NavBar active="About Me" getMode={0}></NavBar>
        <Loading state={loading}></Loading>
        <div className="main-content">
            <TitleBar title="About Me"></TitleBar>
            <div id="div-selection-menu">
                <div id="div-menu-dialogue" className="text-set" tabIndex={2} autoFocus={true} onClick={()=>nextDialogue("menu")}></div>
                <div id="div-menu" className="menu-item"></div>
            </div>
            <div style={{height:50}}></div>
            <div id="div-content-dialogue" className="text-set" tabIndex={2} autoFocus={true} onClick={()=>nextDialogue("content")}>
                {dialogueSet}
            </div>
        </div>
    </>
}

export default AboutMe;