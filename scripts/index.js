"use strict";
exports.__esModule = true;
var classes_1 = require("./classes");
var navbar = document.getElementById("navbar");
var container = document.getElementById("frame-container");
if (navbar && container) {
    var setup = getSetup();
    var listHead = document.createElement("a");
    var navList = document.createElement("ul");
    var frame = document.createElement("iframe");
    navbar.appendChild(listHead);
    navbar.appendChild(navList);
    container.appendChild(frame);
    var controller = new classes_1.SectionController(setup, listHead, navList, frame);
    //Needs to be done at start.
    controller.runLockIn();
}
var myElement = document.getElementById("my-element");
function getSetup() {
    var result = new classes_1.DirectorySetup();
    result.addToCurrentDirectory("AboutMe");
    result.addToCurrentDirectory("BasicInfo", "pages/basic-info.html");
    result.addToCurrentDirectory("SpecificInfo", "pages/specific-info.html");
    result.setDefault("pages/basic-info.html");
    return result;
}
