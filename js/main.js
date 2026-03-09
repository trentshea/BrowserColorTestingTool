"use strict";

const onThemeColorChange = (event) => {
    const input = event.target;
    const color = input.value;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
    }
    meta.content = color;
};

const onThemeColorToggle = (event) => {
    if (event.target.checked) {
        const color = document.getElementById('color-theme-color');
        color.addEventListener('change', onThemeColorChange);
        color.dispatchEvent(new Event('change'));
    }
    else {
        document.getElementById('color-theme-color').removeEventListener('change', onThemeColorChange);
        let meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.remove();
    }
}
document.getElementById('checkbox-theme-color').addEventListener('change', onThemeColorToggle);

const onHeadChange = () => {
    const output = document.getElementById("output-head");
    let outputValues = [];
    document.head.querySelectorAll('*').forEach(el => outputValues.push('  ' + el.outerHTML));
    output.value = outputValues.join('\n');
};

document.addEventListener('DOMContentLoaded', onHeadChange);
const observer = new MutationObserver(onHeadChange);
observer.observe(document.head, {
    childList: true, subtree: true, attributes: true
});

const injectInternalCSS = (id, property, value) => {
    const className = id + "-" + property;
    const classSelector = "." + className;
    const declarationBlock = " { " + property + ": " + value + "; }";
    const ruleset = classSelector + declarationBlock;
    const styleElement = document.createElement('style');
    styleElement.id = className;
    styleElement.innerHTML = ruleset;
    document.head.appendChild(styleElement);
};

const removeInjectedInternalCSS = (id, property) => {
    const styleElement = document.getElementById(`${id}-${property}`);
    if (styleElement) {
        styleElement.remove();
    }
};

const addClass = (id, property) => {
    const element = document.getElementById(id);
    const className = id + "-" + property;
    if (element) {
        element.classList.add(className);
    }
};

const removeClass = (id, property) => {
    const element = document.getElementById(id);
    const className = id + "-" + property;
    if (element) {
        element.classList.remove(className);
        if (document.getElementById(id).classList.length === 0) {
            element.removeAttribute("class");
        }
    }
};


const onHeaderTopChange = (event) => {
    const rangeInput = event.target;
    const value = rangeInput.value + "px";

    if (document.getElementById('select-header-position').value === 'fixed') {
        removeInjectedInternalCSS('header', 'top');
        injectInternalCSS('header', 'top', value);
    }

    const output = document.querySelector('output[name="output-header-top"]');
    output.value = rangeInput.value;
};
document.getElementById('range-header-top').addEventListener('input', onHeaderTopChange);

const onFooterBottomChange = (event) => {
    const rangeInput = event.target;
    const value = rangeInput.value + "px";
    if (document.getElementById('select-footer-position').value === 'fixed') {
        removeInjectedInternalCSS('footer', 'bottom');
        injectInternalCSS('footer', 'bottom', value);
    }

    const output = document.querySelector('output[name="output-footer-bottom"]');
    output.value = rangeInput.value;
};
document.getElementById('range-footer-bottom').addEventListener('input', onFooterBottomChange);

const onBackgroundValueChange = (event) => {
    const colorInput = event.target;
    let id = ((colorInput.id).split("-"))[1];
    removeInjectedInternalCSS(id, "background");
    injectInternalCSS(id, "background", colorInput.value);
};

const onPositionChange = (event) => {
    const select = event.target;
    const id = select.dataset.targetId;//header or footer
    const property = select.dataset.targetProperty;//position
    const value = select.value;//fixed or static
    let rangeInput;

    switch (value) {
        case "fixed":
            switch (id) {
                case "header":
                    rangeInput = document.getElementById('range-header-top');
                    const topValue = rangeInput.value + "px";
                    injectInternalCSS("body", "padding-top", '50px');
                    addClass('body', 'padding-top');
                    injectInternalCSS(id, 'position', value);
                    addClass(id, 'position');
                    injectInternalCSS(id, "top", topValue);
                    addClass(id, 'top');
                    break;
                case "footer":
                    rangeInput = document.getElementById('range-footer-bottom');
                    const bottomValue = rangeInput.value + "px";
                    injectInternalCSS("body", "padding-bottom", '50px');
                    addClass('body', 'padding-bottom');
                    injectInternalCSS(id, 'position', value);
                    addClass(id, 'position');
                    injectInternalCSS(id, "bottom", bottomValue);
                    addClass(id, 'bottom');
                    break;
                default:
            }
            break;
        case "static":
            switch (id) {
                case "header":
                    removeInjectedInternalCSS('body', 'padding-top');
                    removeClass('body', 'padding-top');
                    removeInjectedInternalCSS(id, 'position');
                    removeClass(id, 'position');
                    removeInjectedInternalCSS(id, 'top');
                    removeClass(id, 'top');
                    break;
                case "footer":
                    removeInjectedInternalCSS('body', 'padding-bottom');
                    removeClass('body', 'padding-bottom');
                    removeInjectedInternalCSS(id, 'position');
                    removeClass(id, 'position');
                    removeInjectedInternalCSS(id, 'bottom');
                    removeClass(id, 'bottom');
                    break;
                default:
                    break;
            }
            break;
        default:
    }
};
document.getElementById('select-header-position').addEventListener('change', onPositionChange);
document.getElementById('select-footer-position').addEventListener('change', onPositionChange);

const onBackgroundModification = (event) => {
    const checkbox = event.target;
    const colorInput = document.getElementById(checkbox.dataset.targetValueId);

    if (checkbox.checked) {
        addClass(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
        colorInput.addEventListener('input', onBackgroundValueChange);
        colorInput.dispatchEvent(new Event('input'));
    }
    else {
        removeClass(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
        colorInput.removeEventListener('change', onBackgroundValueChange);
        removeInjectedInternalCSS(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
    }
};
document.getElementById('checkbox-body-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-header-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-sticky-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-footer-background').addEventListener('change', onBackgroundModification);

document.getElementById('checkbox-sticky-background').checked = true;
document.getElementById('checkbox-sticky-background').dispatchEvent(new Event('change'));
