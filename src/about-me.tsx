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
import type { SkillDisplayData, SkillDisplayDetail } from "./assets/types/types";
import InfoCard from "./information-card";
import PopUpCard from "./popup-card";

//https://stackoverflow.com/questions/70714690/buffer-is-not-defined-in-react-vite


function AboutMe(){
    const [menuDialogIndex, setMenuDialogIndex] = useState(0);
    const [autoClickMenu, setAutoClickMenu] = useState(0);
    const [loading, setLoading] = useState(false);
    const [infoCards, setInfoCards] = useState<SkillDisplayData[]>([]);
    const [infoCardData, setInfoCardData] = useState<SkillDisplayDetail>({skillnameinitial: "id", skillname: "name", detail: "some desc", example: "", gallery: []});
    const [displayPopUp, setDisplayPopUp] = useState(false);

    const username = useUserContext().username;

    var menuList: [string, string][] = [
        ["aboutme","About Me"],
        ["freetime","Activity During Free Time"],
        ["currentstatus", "Current Status"],
        ["sitereason", "Why am I here?"]
    ]

    var startingSet = [
        "Hello " + username + ",",
        "I see you want to know about me.\n",
        "Now, let's get started.\n\n",
        "Please choose what you like to read:"
    ]

    const selectCard = async (dataId: string) => {
        //Fetch data
        try{
            setLoading(true);
            var result: AxiosResponse| undefined;
            switch (dataId){
                case "aboutme":
                    result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/aboutme/aboutme`);
                break;
                case "freetime":
                    result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/aboutme/freetime`);   
                break;
                case "currentstatus":
                    result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/aboutme/status`);   
                break;
                case "sitereason":
                    result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/aboutme/reason`);  
                break;
                default:
                    result = undefined;
            }

            if(result?.data){
                setInfoCardData({skillnameinitial: result.data[0].id, skillname: result.data[0].title, detail:result.data[0].summary, example: "", gallery: []})
            }

        }
        catch(e){
            setLoading(false);
            togglePopUp();
        }
        finally{
            setLoading(false);
            togglePopUp();
        }
    }
        
    useEffect(()=>{
        setAutoClickMenu(
            Typewriter.createAutoClick(document.getElementById("div-menu-dialogue") as HTMLElement, 2000)
        );
    }, [])

    function populateStaticInfoCards(){
        //Populate cards
        var tempCards: SkillDisplayData[] = [];
        for(var i = 0; i< menuList.length; i++){
            tempCards.push({skillnameinitial: menuList[i][0], skillname: menuList[i][1], description: ""});
        }    
        
        setInfoCards(tempCards);
    }

    const togglePopUp = () => {
        setDisplayPopUp(!displayPopUp);
        document.body.style.overflow=(displayPopUp?"auto":"hidden");
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
                        populateStaticInfoCards();
                    }
                    clearInterval(autoClickMenu);
                }
                break;
            default:
        }
    }

    return <>
        <NavBar active="About Me" getMode={0}></NavBar>
        <Loading state={loading}></Loading>
        <PopUpCard data={infoCardData} display={togglePopUp} show={displayPopUp}></PopUpCard>
        <div className="main-content">
            <TitleBar title="About Me"></TitleBar>
            <div id="div-selection-menu">
                <div id="div-menu-dialogue" className="text-set" tabIndex={2} autoFocus={true} onClick={()=>nextDialogue("menu")}></div>
                <div id="div-menu" className="menu-item"></div>
            </div>
            <div id="info-container" className="infoview-container">
                {
                    infoCards?.map((card) => {
                        return <span key={card.skillnameinitial}>
                            <InfoCard id={card.skillnameinitial} name={card.skillname} desc={card.description} callback={selectCard}></InfoCard>
                        </span>
                    })
                }
            </div>
        </div>
    </>
}

export default AboutMe;