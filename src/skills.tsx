import { useEffect, useState} from "react";
import NavBar from "./nav-bar";
import TitleBar from "./title-bar";
import Loading from "./loading";
import { useUserContext } from "./assets/context/usercontext";
import MenuBuilder from "./menu-builder";
import Typewriter from "./typewriter";
import InfoCard from "./information-card";
import PopUpCard from "./popup-card";
import axios, { type AxiosResponse } from "axios";
import type { SkillDisplayData, SkillDisplayDetail } from "./assets/types/types";

function Skills(){
    const [loading, setLoading] = useState(false);
    const [menuDialogIndex, setMenuDialogIndex] = useState(0);
    const [autoClickMenu, setAutoClickMenu] = useState(0);
    const [infoCards, setinfoCards] = useState<SkillDisplayData[]>([]);
    const [infoCardData, setInfoCardData] = useState<SkillDisplayDetail>({skillnameinitial: "id", skillname: "name", detail: "some desc", example: "", gallery: []});
    const [displayPopUp, setDisplayPopUp] = useState(false);

    const username = useUserContext().username;

    const startingSet = [
        "Oh hey " + username + ",",
        "Looking for what skills I have?\n",
        "Here they are, what do you like to see?"
    ]

    var menuList: [string, string][] = [
            ["lang","Language(s)"],
            ["exp","Work Experience(s)"],
            ["edu", "Education(s)"],
            ["proglang", "Programming Language(s)"],
            ["proj", "Project(s)"]

        ]
    var mb = new MenuBuilder(menuList);

    
    useEffect(()=>{
        setAutoClickMenu(
            Typewriter.createAutoClick(document.getElementById("div-menu-dialogue") as HTMLElement, 2000)
        );
    }, [])

    async function menuClick(id: string) {
        setinfoCards([]);
        var refCard: SkillDisplayData[] = [];
        try{
            var result: AxiosResponse| undefined;            
            setLoading(true);
            result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/skills/${id}`);

            result?.data.forEach((lang: SkillDisplayData) => {
                refCard.push(lang);
            });
        }
        catch(e){
            console.log(e);
        }
        finally{
            setinfoCards(refCard);
            setLoading(false)
        }
    }

    const selectCard = async (dataId: string) => {
        //Fetch data
        try{
            setLoading(true);
            var result = await axios.get(`${import.meta.env.VITE_ORIGIN}/api/skills/detail/${encodeURIComponent(dataId)}`);

            if(result.data){
                var galleryLinks: string[] = [];
                if(result.data[0].gallery){
                    galleryLinks = (result.data[0].gallery as string).split(",");
                }
                setInfoCardData({skillnameinitial: result.data[0].skillnameinitial, skillname: result.data[0].skillname, detail:result.data[0].detail, example: result.data[0].example, gallery: galleryLinks})
            }

        }catch(e){
            setLoading(false);
            togglePopUp();
        }
        finally{
            setLoading(false);
        }
        togglePopUp();
    }

    const togglePopUp = () => {
        setDisplayPopUp(!displayPopUp);
        document.body.style.overflow=(displayPopUp?"auto":"hidden");
    }
    
    function nextDialogue(displayOn: string){
        switch (displayOn){
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
                break;
        }
    }
    return <>
        <Loading state={loading}></Loading>
        <NavBar active="Skills" getMode={0}></NavBar>
        <PopUpCard data={infoCardData} display={togglePopUp} show={displayPopUp}></PopUpCard>
        <div className="main-content">
            <TitleBar title="Skills"></TitleBar>
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

export default Skills;
