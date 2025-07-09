export default class MenuBuilder{
    #element: HTMLElement;
    #menuItems: [string, string][];

    constructor(menuItems: [string, string][]){
        this.#element = document.createElement("div");
        this.#menuItems = menuItems;
    }

    addMenuItems(item: [string, string], index?: number){
        if(index !== undefined){
            this.#menuItems =  [...this.#menuItems.slice(0, index), item, ...this.#menuItems.slice(index)];

        }else{
            this.#menuItems.push(item);
        }
    }

    getULMenuList(callBack:(id:string) => void,parentElement?: HTMLElement, cssClass?:string[]){

        for(let i = 0; i< this.#menuItems.length; i++){
            let listItem = document.createElement("li");
            cssClass?.forEach((clss) => {
                listItem.classList.add(clss);
            });
            listItem.id=this.#menuItems[i][0];
            listItem.innerText = this.#menuItems[i][1];
            listItem.addEventListener("click", () => callBack(listItem.id));

            this.#element.appendChild(listItem);
        }

        if(parentElement !== undefined){
            parentElement.appendChild(this.#element);
        }

        return this;
    }

    getMenuListElement(){
        return this.#element;
    }
}

