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
    const [dialogIndex, setDialogIndex] = useState(0);
    const [dialogueSet, setDialogueSet] = useState<string[]>([]);
    const [autoClickMenu, setAutoClickMenu] = useState(0);
    const [autoClickDialog, setAutoClickDialog] = useState(0);
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

    var aboutMeSet = 
    ["I am born from Penang, Malaysia.",
    "My greatest passion to help others no regardless of the challenge especially listen to their stories.",
    "Because I enjoyed the process of coming up with solutions and solving problems.",
    "I am obedient person, prioritize on to other's opinions.",
    "However, I am introverted. Hardly do the talking but rather listen and observe.\n",
    "And a hard-headed person, hardly give up when things getting started or when I believe things will work",
    "I only stop when I discovered the idea is impossible or it is succeeded."]

    var freetimeSet = "Playing games is how I spend my free time to."+
    "Because I like to explore new ideas and prefer interactive approach to do anything."+
    "So, I can learn the theory, mechanics, development lifecycles and even the politics.\n"

    var statusSet = "I started from Diploma, enrolled Diploma in Computer Studies in KDU Penang."+
    "I helped friends pass their subjects and exams in every semester."+
    "Until pandemic striked, I worked as Software Developer in an insurance firm that I started as an intern there for 2 years."+
    "After that, I enrolled Bachelor of Computer Science specialize in Software Engineering in MMU Cyberjaya, Malaysia."+
    "Starting a life at university for a few years."+
    "Made my way to rely on myself and live alone outside my hometown.\n"+
    "I am currently waiting for letter for completion and casually looking for job opportunities."


    async function fetchAboutMe(aboutMeType: string)
    {
        try{
            setLoading(true);
            var result: AxiosResponse| undefined;
            switch (aboutMeType){
                case "aboutme":
                    result = await axios.get("http://localhost:8080/api/aboutme/aboutme");
                    //setDialogueSet(aboutMeSet);
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
            result !== undefined?setDialogueSet(result.data):console.error("Invalid fetch operation");

        }catch(e){            
            setDialogueSet(["Sorry, there's nothing in there... :("]);
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
        setDialogueSet([]);
        setDialogIndex(0);    
        await fetchAboutMe(id);

        setAutoClickDialog(
            Typewriter.createAutoClick(document.getElementById("div-content-dialogue") as HTMLElement, 2000)
        );
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
                var typeWriter = new Typewriter(50, document.getElementById("div-content-dialogue") as HTMLElement)
                if(dialogIndex < dialogueSet.length){
                    typeWriter.insertString(dialogueSet[dialogIndex]).begin();
                    setDialogIndex(dialogIndex +1);
                }else{
                    clearInterval(autoClickDialog);
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
            <div id="div-content-dialogue" className="text-set" tabIndex={2} autoFocus={true} onClick={()=>nextDialogue("content")}>
            </div>
        </div>
    </>
}

export default AboutMe;