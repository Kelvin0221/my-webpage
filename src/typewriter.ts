type QueueItem = () => Promise<void>;

export default class Typewriter{
    #element: HTMLElement;
    #typeSpeed: number;

    #queue: QueueItem[] = [];

    constructor(typeSpeed: number, parent: HTMLElement){
        this.#element= document.createElement("div");
        parent.append(this.#element);
        this.#typeSpeed = typeSpeed;
    }

    setParentElement(parent: HTMLElement){
        parent.append(this.#element);

        return this;
    }

    insertString(str: string){
        this.#addToQueue(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                this.#element.append(str[i]);
                i++;

                if(i >= str.length){
                    clearInterval(interval);
                    resolve();
                }                    
            }, this.#typeSpeed);
        })

        return this;
    }

    async begin(){
        for(let cb of this.#queue){
            await cb();
        }
        return this;
    }

    clearAll(){
        this.#addToQueue((resolve) =>{
            this.#element.innerText = "";
            resolve();
        });

        return this;
    }

    #addToQueue(cb: (resolve: () => void) => void){
        this.#queue.push(() => {
            return new Promise(cb);
        });
    }

    static createAutoClick(element: HTMLElement, duration: number): number{
        const interval = window.setInterval(() =>{
            console.log("click");
            element?.click();
        }, duration);

        return interval;
    }
}