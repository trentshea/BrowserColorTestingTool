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
        color.addEventListener('input', onThemeColorChange);
        color.dispatchEvent(new Event('input'));
    }
    else {
        document.getElementById('color-theme-color').removeEventListener('input', onThemeColorChange);
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

const setInternalCSS = (id, property, value) => {
    const className = id + "-" + property;
    const classSelector = "." + className;
    const declarationBlock = " { " + property + ": " + value + "; }";
    const ruleset = classSelector + declarationBlock;
    const existingElement = document.getElementById(className);
    if (existingElement) {
        existingElement.textContent = ruleset;
    } else {
        const styleElement = document.createElement('style');
        styleElement.id = className;
        styleElement.textContent = ruleset;
        document.head.appendChild(styleElement);
    }
};

const removeInternalCSS = (id, property) => {
    const styleElement = document.getElementById(`${id}-${property}`);
    if (styleElement) {
        styleElement.remove();
    }
};

const addPropertyClass = (id, property) => {
    const element = document.getElementById(id);
    const className = id + "-" + property;
    if (element) {
        element.classList.add(className);
    }
};

const removePropertyClass = (id, property) => {
    const element = document.getElementById(id);
    const className = id + "-" + property;
    if (element) {
        element.classList.remove(className);
        if (document.getElementById(id).classList.length === 0) {
            element.removeAttribute("class");
        }
    }
};

const applyPositionStyles = (id, prop, value, applyPropertyClass) => {
    setInternalCSS(id, prop, value);
    if (applyPropertyClass) addPropertyClass(id, prop);
};

const removePositionStyles = (id, props) => {
    props.forEach(prop => {
        removeInternalCSS(id, prop);
        removePropertyClass(id, prop);
    });
};

/**
 * Handles changes to position offset range inputs.
 * Updates the CSS property value and syncs the display output.
 * 
 * Expected data attributes on the range input:
 * - data-target-id: ID of the element to apply styles to
 * - data-target-property: CSS property to modify (e.g., "top", "bottom")
 * - data-select-id: ID of the position type select element
 * 
 * Expected data attributes on the select element:
 * - data-offset-unit: CSS unit to append to the value (e.g., "px", "%")
 */
const onPositionOffsetChange = (event) => {
    const rangeInput = event.target;
    const targetId = rangeInput.dataset.targetId;
    const targetProperty = rangeInput.dataset.targetProperty;
    const selectId = rangeInput.dataset.selectId;
    const select = document.getElementById(selectId);
    const offsetUnit = select.dataset.offsetUnit;

    // Only apply CSS when position is set to "fixed"
    // (relative/static positioning doesn't need offset values)
    if (select.value === 'fixed') {
        const value = rangeInput.value + offsetUnit;
        setInternalCSS(targetId, targetProperty, value);
    }

    // Always update the displayed value in the output element
    const output = document.querySelector(`output[name="output-${targetId}-${targetProperty}"]`);
    output.value = rangeInput.value;
};
document.getElementById('range-header-top').addEventListener('input', onPositionOffsetChange);
document.getElementById('range-footer-bottom').addEventListener('input', onPositionOffsetChange);

const onBackgroundValueChange = (event) => {
    const colorInput = event.target;
    let id = ((colorInput.id).split("-"))[1];
    setInternalCSS(id, "background", colorInput.value);
};

const onPositionChange = (event) => {
    const select = event.target;
    const id = select.dataset.targetId;
    const value = select.value;

    // Read configuration from the select element's data attributes
    const rangeId = select.dataset.rangeId;
    const bodyPaddingProp = select.dataset.bodyPaddingProp;
    const offsetProp = select.dataset.offsetProp;
    const offsetUnit = select.dataset.offsetUnit;
    const bodyPadding = select.dataset.bodyPadding;

    // Validate that all required attributes exist
    if (!rangeId || !bodyPaddingProp || !offsetProp || !offsetUnit) {
        console.warn('Missing required data attributes on select element');
        return;
    }

    switch (value) {
        case 'fixed': {
            const rangeInput = document.getElementById(rangeId);
            const offsetValue = rangeInput.value + offsetUnit;

            applyPositionStyles('body', bodyPaddingProp, bodyPadding, true);
            applyPositionStyles(id, 'position', value, true);
            applyPositionStyles(id, offsetProp, offsetValue, true);
            break;
        }
        case 'static':
            removePositionStyles('body', [bodyPaddingProp]);
            removePositionStyles(id, ['position', offsetProp]);
            break;
    }
};
document.getElementById('select-header-position').addEventListener('change', onPositionChange);
document.getElementById('select-footer-position').addEventListener('change', onPositionChange);

const onBackgroundModification = (event) => {
    const checkbox = event.target;
    const colorInput = document.getElementById(checkbox.dataset.targetValueId);

    if (checkbox.checked) {
        addPropertyClass(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
        colorInput.addEventListener('input', onBackgroundValueChange);
        colorInput.dispatchEvent(new Event('input'));
    }
    else {
        removePropertyClass(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
        colorInput.removeEventListener('input', onBackgroundValueChange);
        removeInternalCSS(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
    }
};
document.getElementById('checkbox-body-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-header-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-sticky-background').addEventListener('change', onBackgroundModification);
document.getElementById('checkbox-footer-background').addEventListener('change', onBackgroundModification);

document.getElementById('checkbox-sticky-background').checked = true;
document.getElementById('checkbox-sticky-background').dispatchEvent(new Event('change'));
