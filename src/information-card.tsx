import "./assets/style/infocard.css"

export default function InfoCard({id,name,desc, callback}:{id: string, name: string, desc: string, callback: (id: string)=>void}){

    return <>
    <a onClick={() => callback(id)} className="infocard">
        <div id={id}>
            <span>
                <h2>{name}</h2>
                <p>{desc}</p>
            </span>
        </div>    
    </a>
    </>
}

