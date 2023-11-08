"use strict";
exports.__esModule = true;
exports.SectionController = exports.DirectorySetup = void 0;
/**Stores the data needed to setup up directories. */
var DirectorySetup = /** @class */ (function () {
    function DirectorySetup() {
        this.fields = new Map();
        this.directories = new Array(4);
        this.current = 0;
        this.base = "";
        this.directories[0] = this.fields;
        var a = document.createElement("iframe");
    }
    /**
     * Adds to the latest directory.
     * If new directory changes it to latest.
     * @param name the string used for url and button.
     * @param addition A url for an iframe.  leave empty if new directory.
     */
    DirectorySetup.prototype.addToCurrentDirectory = function (name, addition) {
        if (addition == undefined) {
            var a = new Map();
            this.directories[this.current].set(name, a);
            this.current++;
            if (this.current == this.directories.length) {
                this.directories.length *= 2;
            }
            this.directories[this.current] = a;
        }
        else {
            this.directories[this.current].set(name, addition);
        }
    };
    /**Goes back to the previous directory. */
    DirectorySetup.prototype.goBack = function () {
        this.current--;
    };
    /**
     * This is for the default page.
     * @param base The value set in when nothing else is there.
     */
    DirectorySetup.prototype.setDefault = function (base) {
        this.base = base;
    };
    DirectorySetup.prototype.getDefault = function () {
        return this.base;
    };
    /**
     * Returns a map for all the stuff.
     * @returns The map.
     */
    DirectorySetup.prototype.getMap = function () {
        return this.fields;
    };
    return DirectorySetup;
}());
exports.DirectorySetup = DirectorySetup;
/**How sections are generated from url fragments. */
var SectionController = /** @class */ (function () {
    /**
     * @param setup All the directory contents.  please don't edit contents while stored here.
     * @param listHead The link for the back button of the navigation list.
     * @param navList An unordered list element for navbar.
     * @param frame The frame for an html page.
     */
    function SectionController(setup, listHead, navList, frame) {
        this.url = "";
        this.children = new Array(0);
        this.fields = setup.getMap();
        this.lockIn = setup.getDefault();
        this.listHead = listHead;
        this.navList = navList;
        this.frame = frame;
    }
    /**WARNING: this is not garbage collected.
     * sets the event listener for when fragment changes.
    */
    SectionController.prototype.setEventListener = function () {
        try {
            window.addEventListener("hashchange", this.onLockIn);
        }
        catch (e) {
            //Nothing for now.
        }
    };
    SectionController.prototype.removeEventListener = function () {
        window.removeEventListener("hashchange", this.onLockIn);
    };
    /**
     * Method for modifying HTML and locking in the page.
     * @throws {Error} if nothing matches the fragment.
     */
    SectionController.prototype.onLockIn = function () {
        //This checks if there is a fragment at all.
        if (window.location.hash.length > 1) {
            var fragment = window.location.hash.substring(1);
            var fragments = fragment.split('/');
            var current = this.fields;
            var i = void 0;
            var check = void 0;
            //Checks that everything is fine with the fragments.
            for (i = 0; i < fragments.length; i++) {
                check = current.get(fragments[i]);
                if (check != undefined) {
                    if (check instanceof Map) {
                        current = check;
                    }
                    else if (i + 1 != fragments.length) {
                        throw new Error();
                    }
                    else {
                        break;
                    }
                }
                else {
                    throw new Error();
                }
            }
            //Sees if the list thing was a directory or an end result.
            if (typeof check === "string") {
                this.changeLockIn(check);
            }
            //Sets the current url.
            this.url = '#' + fragment.substring(0, fragment.length - fragments[i - 1].length);
            var previousUrl = //For storing where to go back.
             void 0; //For storing where to go back.
            if (fragments.length > 1) { //Removes latest field and /.
                previousUrl = this.url.substring(0, this.url.length
                    - fragments[i - 2].length - 1);
            }
            else { //This means there is no where to go back.
                previousUrl = this.url;
            }
            var names = this.getNames(current.keys(), current.size);
            this.setNavBar(previousUrl, names);
        }
        else {
            var names = this.getNames(this.fields.keys(), this.fields.size);
            this.url = "#";
            this.setNavBar(this.url, names);
        }
    };
    /**Sets up the current section. */
    SectionController.prototype.runLockIn = function () {
        this.frame.src = this.lockIn;
    };
    SectionController.prototype.changeLockIn = function (lockIn) {
        if (this.lockIn != lockIn) {
            this.lockIn == lockIn;
            this.runLockIn();
        }
    };
    /**
     * Sets up the navbar in the html.
     * @param names
     */
    SectionController.prototype.setNavBar = function (headUrl, names) {
        //Removes the former fields.
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.navList.removeChild(child);
        }
        this.listHead.href = headUrl;
        //Adds the new children.
        this.children = new Array(names.length);
        var link;
        var little;
        for (var i = 0; i < names.length; i++) {
            //Creates the link to another page.
            link = document.createElement("a");
            link.href = this.url + names[i];
            link.textContent = names[i];
            //Creates and appends the list field element.
            little = document.createElement("li");
            little.appendChild(link);
            this.navList.appendChild(little);
        }
    };
    SectionController.prototype.getNames = function (names, size) {
        var result = new Array(size);
        var i = 0;
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            result[i] = name_1;
            i++;
        }
        return result;
    };
    return SectionController;
}());
exports.SectionController = SectionController;
