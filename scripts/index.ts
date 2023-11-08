import { DirectorySetup, SectionController} from "./classes";

const navbar=document.getElementById("navbar");
const container=document.getElementById("frame-container");

if (navbar && container){
    let setup = getSetup();
    let listHead = document.createElement("a");
    let navList = document.createElement("ul");
    let frame = document.createElement("iframe");

    navbar.appendChild(listHead);
    navbar.appendChild(navList);
    container.appendChild(frame);

    const controller = new SectionController(
        setup,
        listHead,
        navList,
        frame
    );

    //Needs to be done at start.
    controller.runLockIn();
}

const myElement = document.getElementById("my-element");

function getSetup(): DirectorySetup{
    let result = new DirectorySetup();
    result.addToCurrentDirectory("AboutMe");
    result.addToCurrentDirectory("BasicInfo", "pages/basic-info.html");
    result.addToCurrentDirectory("SpecificInfo", "pages/specific-info.html");
    result.setDefault("pages/basic-info.html");
    return result;
}