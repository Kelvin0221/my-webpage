import { useEffect, useState } from "react";
import TitleBar from "./title-bar";
import "./assets/style/index.css"
import Typewriter from "./typewriter";
import NavBar from "./nav-bar";
import { useUserContext } from "./assets/context/usercontext";

//https://stackoverflow.com/questions/70714690/buffer-is-not-defined-in-react-vite
//Bug: ClassName=hidden and hidden attributes must appear concurrently

function HomePage(){
    const [index, setIndex] = useState(0);
    const [doneInput, setDoneInput] = useState(false);
    const [dispWelcome, setdispWelcome] = useState(true);

    //let autoClick: NodeJS.Timeout;
    const [autoClick, setAutoClick] = useState(0);
    const {username, setUsername} = useUserContext();

    var startDialogueSet = [
        "Greetings.\nWelcome to my page.\n\n",
        "But first things first.\n",
        "May I know your name?\n"
    ]

    var emptyNameDialogSet = [
        "Oh...I see, let's keep this a secret then.\n\n",
        "Let me address you as - User\n"
    ]

    useEffect(()=>{
        autoActivate();
    }, []);

    function autoActivate(){
        setAutoClick(
            Typewriter.createAutoClick(document.getElementById("div-main") as HTMLElement, 2000)
        );
    }

    function inputUsername(username: string){
        const form = document.getElementById("form-username");
        if(form!==null){
            form.hidden = true;
        }
        const divDialogue =document.getElementById("div-dialogue");
        (divDialogue!==null)?divDialogue.innerHTML ="":"";

        autoActivate();

        if(username === ""){
            setUsername("User");
            setIndex(0); 
            nextDialogue();
        }

        setDoneInput(true);
    }

    function nextDialogue(){
       var typeWriter = new Typewriter(50,document.getElementById("div-dialogue") as HTMLElement);

        if(!doneInput){
            if(index < startDialogueSet.length){
                typeWriter.insertString(startDialogueSet[index]).begin();

                setIndex(index+1);
            }else{
                document.getElementById("form-username")?.classList.remove("hidden");
                clearInterval(autoClick);
            }
        }
        else if(doneInput){
            (document.getElementById("form-username") as HTMLElement).hidden=true;

            if(index < emptyNameDialogSet.length){
                typeWriter.insertString(emptyNameDialogSet[index]).begin();
                setIndex(index+1);
            }else{
                if(dispWelcome){
                    var menuDialogue = username + ", please to see you. \nPlease feel free to look around."
                    typeWriter.insertString(menuDialogue).begin();
                    setdispWelcome(false);
                }

                document.getElementById("menu-list")?.classList.remove("hidden");

                clearInterval(autoClick);
            }
        }
    }

    return <>
        <div className="main-content">
            <TitleBar title="Welcome"></TitleBar>
            <div id="div-main" className="text-set" tabIndex={1} autoFocus={true}  onClick={()=>nextDialogue()}>
                <div id="div-dialogue"></div>
                <form id="form-username" className="hidden">
                    <div>
                        ► <input type="text" placeholder="Your name" onChange={(e) => setUsername(e.target.value)}></input>
                        <button type="button"  onClick={() => inputUsername(username)}>Enter ↵</button>
                        <a className="link-style" onClick={() => inputUsername("")}>I prefer not to say</a>
                    </div>                    
                </form>
                <div id="menu-list" className="hidden">
                    <NavBar active="" getMode={1}></NavBar>
                </div>
            </div>
        </div>

    </>
}

export default HomePage;