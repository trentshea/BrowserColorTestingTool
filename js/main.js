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

const numberHeaderTopCallback = (event) => {
    const numberInput = event.target;
    const value = numberInput.value + "px";
    removeClass('header', 'top');
    addClass('header', 'top', value);
}
document.getElementById('number-header-top').addEventListener('change', numberHeaderTopCallback);

const numberFooterBottomCallback = (event) => {
    const numberInput = event.target;
    const value = numberInput.value + "px";
    removeClass('footer', 'bottom');
    addClass('footer', 'bottom', value);
}
document.getElementById('number-footer-bottom').addEventListener('change', numberFooterBottomCallback);

const selectPositionCallback = (event) => {
    const select = event.target;
    const value = select.value;
    const id = ((select.id).split("-"))[1];

    //TODO: is there a way to
    switch (value) {
        case "fixed":
            addClasses();
            break;
        case "static":
            removeClasses();
            break;
        default:
    }

    function addClasses() {
        let numberInput;
        switch (id) {
            case "header":
                numberInput = document.getElementById('number-header-top');
                const topValue = numberInput.value + "px";
                numberInput.disabled = false;
                addClass("main", "margin-top", '50px');
                addClass(id, 'position', value);
                addClass(id, "top", topValue);
                break;
            case "footer":
                numberInput = document.getElementById('number-footer-bottom');
                const bottomValue = numberInput.value + "px";
                numberInput.disabled = false;
                addClass("main", "margin-bottom", '50px');
                addClass(id, 'position', value);
                addClass(id, "bottom", bottomValue);
                break;
            default:
        }
    }

    function removeClasses() {
        switch (id) {
            case "header":
                const numberInput = document.getElementById('number-header-top');
                numberInput.disabled = true;
                removeClass('main', 'margin-top');
                removeClass(id, 'position');
                removeClass(id, 'top');
                break;
            case "footer":
                removeClass('main', 'margin-bottom');
                removeClass(id, 'position');
                removeClass(id, 'bottom');
                break;
            default:
                break;
        }
    }
}
document.getElementById('select-header-position').addEventListener('change', selectPositionCallback);
document.getElementById('select-footer-position').addEventListener('change', selectPositionCallback);




//TODO: do i want to modify this to checkboxCallBack and switch against
// the event.target name or something to determine what property to change? would be more efficient than adding an event listener for each checkbox, but also more complex and less readable. maybe not worth it for this project, but could be a good learning experience.
const checkboxBackgroundCallback = (event) => {
    const checkbox = event.target;
    const colorId = checkbox.value;
    const id = checkbox.name;
    const color = document.getElementById(colorId).value;
    const colorInput = document.getElementById(colorId);

    if (checkbox.checked) {
        colorInput.disabled = false;
        colorInput.addEventListener('change', colorCallback);
        addClass(id, "background", color);
    }
    else {
        colorInput.disabled = true;
        colorInput.removeEventListener('change', colorCallback);
        removeClass(id, "background");
    }
}
document.getElementById('checkbox-body-background').addEventListener('change', checkboxBackgroundCallback);
document.getElementById('checkbox-header-background').addEventListener('change', checkboxBackgroundCallback);
document.getElementById('checkbox-footer-background').addEventListener('change', checkboxBackgroundCallback);

/**
 * Callback function for handling color input changes.
 * @param {Event} event The change event triggered by the color input.
 */
const colorCallback = (event) => {
    colorInput = event.target;
    let id = ((colorInput.id).split("-"))[1];
    removeClass(id, "background");
    addClass(id, "background", colorInput.value);
}

/**
 * Adds a CSS class to an element with the specified ID, where the class sets a specific CSS property to a given value.
 * The class is dynamically created and added to the document's head, and then applied to the element.
 * The class is named using the element ID and the CSS property to ensure uniqueness.
 * Example usage: addClass("header", "background-color", "red") will create a class that sets the background color to red and apply it to the element with ID "header".
 * Note: This function does not check for existing classes or styles, so it may override previous styles if called multiple times with the same element and property.
 * @param {string} id ID of the element to which the class will be added
 * @param {string} property CSS property to set (e.g. "background-color")
 * @param {string} value CSS value for the property
 */
function addClass(id, property, value) {
    const className = id + "-" + property;
    const classSelector = "." + className;
    const declarationBlock = " { " + property + ": " + value + "; }";
    const styleElement = document.createElement('style');
    styleElement.id = className;
    styleElement.innerHTML = classSelector + declarationBlock;
    document.head.appendChild(styleElement);
    document.getElementById(id).classList.add(className);
}

/**
 * Removes a CSS class from an element with the specified ID.
 * @param {string} id ID of the element from which the class will be removed
 * @param {string} property CSS property to remove (e.g. "background-color")
 */
function removeClass(id, property) {
    const styleId = id + "-" + property;
    const stylesheet = document.getElementById(styleId);
    if (stylesheet)
        stylesheet.remove();

    const element = document.getElementById(id);
    if (element) {
        element.classList.remove(styleId);
        if (document.getElementById(id).classList.length === 0) {
            element.removeAttribute("class");
        }
    }
}
