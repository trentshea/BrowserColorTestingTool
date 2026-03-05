function consoleLog(inputString) {
    if (typeof inputString === 'string') {
        console.log(inputString);
    } else {
        console.error("Error: Input is not a string.");
    }
}

function addClassAttribute(divID, classAttribute) {
    (document.getElementById(divID)).classList.add(classAttribute);
}

function removeClassAttribute(divID, classAttribute) {
    (document.getElementById(divID)).classList.remove(classAttribute);
}

function toggleDiv(divId) {
    var x = document.getElementById(divId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


/*from google search ai result.*/
/**
 * Checks if a string is a valid CSS color in a browser environment.
 * @param {string} strColor The string to validate.
 * @returns {boolean} True if the string is a valid CSS color, false otherwise.
 */
const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    // In most browsers, an invalid color results in an empty string.
    // Note: this function also returns true for the global keywords (unset, initial, inherit).
    return s.color !== '';
};

function addThemeColor() {
    const inputElement = document.getElementById('color');
    const color = inputElement.value;


    if (!isColor(color)) {
        inputElement.value = 'try again';
        return;
    }
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = color;
}
function toggleViewportFitCover() {
    var viewport = document.querySelector('meta[name="viewport"]');
    var content = viewport.getAttribute('content');


    if (!content.includes('viewport-fit=cover')) {
        var newContent = content + ', viewport-fit=cover';
        viewport.setAttribute('content', newContent);

    }
    else {
        var newContent = content.replace(', viewport-fit=cover', '');
        viewport.setAttribute('content', newContent);
    }
}