//remove the "enable JavaScript" message in the html file
document.getElementById("output").innerHTML = "";

//this function loads all json data into the info variable
var info = (function () {
    let json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'http://www.tyreepini.com/Orvis/json/masonry-data.json',
        'dataType': 'json',
        'success': function (data) {
            info = data;
        }
    });
    return info;
})();

//run this function onload
function onload() {
    let el = document.getElementById("tilesContainer");
    //initShow indicates the amount of tiles you want shown onload
    const initShow = 5;

    for (let x = 0; x < info.tiles.length; x++) {
        let newEl = document.createElement("div");

        //for every object in the json file, create a container with class 'masonry'
        if (x < initShow) { newEl.setAttribute("class", "masonry show"); } else {
            newEl.setAttribute("class", "masonry hide");
        }

        //for every 'masonry' container, we add 4 fields, 3 for text and 1 for image
        for (let y = 0; y < Object.keys(info.tiles[x]).length; y++) {
            let newPart;
            let newContent;

            //if the object key is image, then the createElement needs to be img, and if the image value is blank, then we will add class 'noImage' to the image element
            if (Object.keys(info.tiles[x])[y] === "image") {
                newPart = document.createElement("img");
                newPart.setAttribute("id", x + "_" + y);

                if (info.tiles[x][Object.keys(info.tiles[x])[y]].length === 0) {
                    newPart.setAttribute("class", "noImage");
                } else {
                    newPart.setAttribute("class", "image");
                    newPart.setAttribute("src", "." + info.tiles[x][Object.keys(info.tiles[x])[y]]);
                }
                //because we want the image to be the first item shown in the tile, prepend
                newEl.prepend(newPart);
            } else {
                newPart = document.createElement("div");
                newPart.setAttribute("id", x + "_" + y);
                newPart.setAttribute("class", Object.keys(info.tiles[x])[y]);
                newContent = document.createTextNode(info.tiles[x][Object.keys(info.tiles[x])[y]]);
                newPart.append(newContent);
                newEl.appendChild(newPart);
            }

        }
        //add the masonry tile to tileContainer
        el.appendChild(newEl);
    }
}

//upon click of the 'loadMore' button
function loadMore(){
    $('.hide').removeClass('hide');
    document.getElementById("loadMore").setAttribute("style", "display: none;");
    resize();
}

//function used within resize to get values of styles of elements
function getStyleValue(element, style) {
    return parseInt(window.getComputedStyle(element).getPropertyValue(style));
}

//resizes the tiles based on loads and resizes
function resize() {
    //create grid element
    const grid = document.querySelector(".tilesContainer");
    //get height of grid-auto-rows and grid-row-gap as set in the css file
    const rowHeight = getStyleValue(grid, "grid-auto-rows");
    const rowGap = getStyleValue(grid, "grid-row-gap");
    //momentarily set the style of gridAutoRows to auto and alignItems to self-start
    grid.style.gridAutoRows = "auto";
    grid.style.alignItems = "self-start";
    //for each tile in the masonry grid...
    grid.querySelectorAll(".masonry").forEach(tile => {
        //set the value of 'grid-row-end' of each tile to the height it needs
        const marginHeight = getStyleValue(tile, "margin-top") + getStyleValue(tile, "margin-bottom");
        tile.setAttribute("style", "grid-row-end: span " + Math.ceil((tile.clientHeight + rowGap + marginHeight) / (rowHeight + rowGap)));
    });
    //momentary addition of 2 styles above are removed... results in reading styles from the css sheet
    grid.removeAttribute("style");
}

window.addEventListener("load", resize);
window.addEventListener("resize", resize);
onload();
