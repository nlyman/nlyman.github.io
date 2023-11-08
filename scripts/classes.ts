
// @ts-ignore
export type Directory = string | Map<string, Directory>;

/**Stores the data needed to setup up directories. */
export class DirectorySetup{

    private fields = new Map<string, Directory>();
    private directories: Map<string, Directory>[] = new Array(4);
    private current: number = 0;
    private base: string="";

    constructor(){
        this.directories[0] = this.fields;
        let a=document.createElement("iframe");
    }

    /**
     * Adds to the latest directory.
     * If new directory changes it to latest.
     * @param name the string used for url and button.
     * @param addition A url for an iframe.  leave empty if new directory.
     */
    public addToCurrentDirectory(name: string, addition?: string){
        if (addition == undefined){
            let a = new Map<string, Directory>();
            this.directories[this.current].set(name, a);
            this.current++;
            if (this.current==this.directories.length){
                this.directories.length*=2;
            }
            this.directories[this.current]=a;
        }
        else{
            this.directories[this.current].set(name, addition);
        }
    }
    
    /**Goes back to the previous directory. */
    public goBack(){
        this.current--;
    }

    /**
     * This is for the default page.
     * @param base The value set in when nothing else is there.
     */
    public setDefault(base: string){
        this.base=base;
    }

    public getDefault(){
        return this.base;
    }

    /**
     * Returns a map for all the stuff.
     * @returns The map.
     */
    public getMap(): Map<string, Directory>{
        return this.fields;
    }
}

/**How sections are generated from url fragments. */
export class SectionController{
    private fields: Map<string, Directory>;
    private lockIn: string;
    private listHead: HTMLAnchorElement;
    private navList: HTMLUListElement;
    private url: string="";
    private children: HTMLLIElement[] = new Array(0);
    private frame: HTMLIFrameElement;

    /**
     * @param setup All the directory contents.  please don't edit contents while stored here.
     * @param listHead The link for the back button of the navigation list.
     * @param navList An unordered list element for navbar.
     * @param frame The frame for an html page.
     */
    constructor(setup: DirectorySetup, listHead: HTMLAnchorElement, navList: HTMLUListElement, frame: HTMLIFrameElement){
        this.fields = setup.getMap();
        this.lockIn = setup.getDefault();
        this.listHead=listHead;
        this.navList = navList;
        this.frame = frame;
    }

    /**WARNING: this is not garbage collected.
     * sets the event listener for when fragment changes.
    */
    public setEventListener(){
        try{
            window.addEventListener("hashchange", this.onLockIn);
        }
        catch (e){
            //Nothing for now.
        }
    }

    public removeEventListener(){
        window.removeEventListener("hashchange", this.onLockIn);
    }

    /**
     * Method for modifying HTML and locking in the page.
     * @throws {Error} if nothing matches the fragment.
     */
    public onLockIn(){
        //This checks if there is a fragment at all.
        if (window.location.hash.length>1){
            const fragment = window.location.hash.substring(1);
            const fragments: string[] = fragment.split('/');
            let current = this.fields;
            let i: number;
            let check: Directory | undefined;
            
            //Checks that everything is fine with the fragments.
            for(i=0; i<fragments.length; i++){
                check=current.get(fragments[i]);
                if (check!=undefined){
                    if(check instanceof Map){
                        current = check;
                    }
                    else if(i+1!=fragments.length){
                        throw new Error();
                    }
                    else{
                        break;
                    }
                }
                else{
                    throw new Error();
                }
            }
            //Sees if the list thing was a directory or an end result.
            if (typeof check === "string"){
                this.changeLockIn(check);
            }

            //Sets the current url.
            this.url ='#'+fragment.substring(0, 
                    fragment.length-fragments[i-1].length
                );

            let previousUrl: string;//For storing where to go back.
            if (fragments.length>1){//Removes latest field and /.
                previousUrl = this.url.substring(0,
                    this.url.length
                    -fragments[i-2].length-1);
            }
            else{//This means there is no where to go back.
                previousUrl = this.url;
            }

            let names =  this.getNames(current.keys(), current.size);
            this.setNavBar(previousUrl, names);
        }
        else{
            let names = this.getNames(this.fields.keys(), this.fields.size);
            this.url = "#";
            this.setNavBar(this.url, names);
        }
    }

    /**Sets up the current section. */
    public runLockIn(){
        this.frame.src=this.lockIn;
    }

    private changeLockIn(lockIn: string){
        if (this.lockIn!=lockIn){
            this.lockIn==lockIn;
            this.runLockIn();
        }
    }

    /**
     * Sets up the navbar in the html.
     * @param names 
     */
    public setNavBar(headUrl: string, names: string[]){
        //Removes the former fields.
        for (const child of this.children){
            this.navList.removeChild(child);
        }

        this.listHead.href=headUrl;

        //Adds the new children.
        this.children=new Array(names.length);
        let link: HTMLAnchorElement;
        let little: HTMLLIElement;
        for(let i=0; i<names.length; i++){
            //Creates the link to another page.
            link = document.createElement("a");
            link.href = this.url+names[i];
            link.textContent = names[i];

            //Creates and appends the list field element.
            little = document.createElement("li");
            little.appendChild(link);
            this.navList.appendChild(little);
        }
    }

    private getNames(names: IterableIterator<string>, size: number): string[]{
        let result: string[] = new Array(size);
        let i=0;
        for(const name of names){
            result[i]=name;
            i++;
        }
        return result;
    }
}