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

const onViewportFitChange = (event) => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const selectedValue = event.target.value;

    // Get existing parts, or an empty array if the meta tag doesn't exist.
    let parts = viewportMeta ? viewportMeta.getAttribute('content').split(',').map(p => p.trim()) : [];

    // Filter out any existing viewport-fit properties.
    parts = parts.filter(p => !p.startsWith('viewport-fit=') && p.length > 0);

    // Add the new viewport-fit value if it's not 'auto'.
    if (selectedValue !== 'auto') {
        parts.push(`viewport-fit=${selectedValue}`);
    }

    if (parts.length > 0) {
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        viewportMeta.setAttribute('content', parts.join(', '));
    } else {
        // If there are no parts, remove the meta tag if it exists.
        if (viewportMeta) {
            viewportMeta.remove();
        }
    }
};

const updateHeadOutput = () => {
    const output = document.getElementById("output-head");
    let outputValues = [];
    document.head.querySelectorAll('*').forEach(el => outputValues.push('  ' + el.outerHTML));
    output.value = outputValues.join('\n');
};

document.addEventListener('DOMContentLoaded', updateHeadOutput);
const observer = new MutationObserver(updateHeadOutput);
observer.observe(document.head, {
    childList: true, subtree: true, attributes: true
});

const upsertStyleRule = (id, property, value) => {
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

const removeStyleRule = (id, property) => {
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
    upsertStyleRule(id, prop, value);
    if (applyPropertyClass) addPropertyClass(id, prop);
};

const removePositionStyles = (id, props) => {
    props.forEach(prop => {
        removeStyleRule(id, prop);
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
        upsertStyleRule(targetId, targetProperty, value);
    }

    // Always update the displayed value in the output element
    const output = document.querySelector(`output[name="output-${targetId}-${targetProperty}"]`);
    output.value = rangeInput.value;
};

const onBackgroundValueChange = (event) => {
    const colorInput = event.target;
    let id = ((colorInput.id).split("-"))[1];
    upsertStyleRule(id, "background", colorInput.value);
};

const handlePositionTypeChange = (event) => {
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

const onBackgroundToggle = (event) => {
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
        removeStyleRule(checkbox.dataset.targetId, checkbox.dataset.targetProperty);
    }
};

const onStickyToggle = (event) => {
    const checkbox = event.target;
    const stickyElement = document.getElementById('sticky');
    if (checkbox.checked) {
        stickyElement.classList.remove('hidden');
    } else {
        stickyElement.classList.add('hidden');
    }
};

const onCenterToggle = (event) => {
    const checkbox = event.target;
    const centerCheckboxes = ['checkbox-center-meta', 'checkbox-center-body', 'checkbox-center-header', 'checkbox-center-sticky', 'checkbox-center-footer'];

    const applyCentering = (category) => {
        category.style.position = 'fixed';
        category.style.top = '50%';
        category.style.left = '50%';
        category.style.transform = 'translate(-50%, -50%)';
        category.style.zIndex = '1000';
        category.style.backgroundColor = 'white';
        category.style.border = '1px solid black';
        category.style.padding = '10px';
        category.style.width = '80%';
    };

    const removeCentering = (category) => {
        category.style.position = '';
        category.style.top = '';
        category.style.left = '';
        category.style.transform = '';
        category.style.zIndex = '';
        category.style.backgroundColor = '';
        category.style.border = '';
        category.style.padding = '';
        category.style.width = '';
        if (category.style.cssText.trim() === '') {
            category.removeAttribute('style');
        }
    };

    if (checkbox.checked) {
        // Uncheck all others and remove their centering
        centerCheckboxes.forEach(id => {
            if (id !== checkbox.id) {
                const otherCheckbox = document.getElementById(id);
                if (otherCheckbox && otherCheckbox.checked) {
                    otherCheckbox.checked = false;
                    const otherCategoryId = id.replace('checkbox-center-', 'category-');
                    const otherCategory = document.getElementById(otherCategoryId);
                    removeCentering(otherCategory);
                }
            }
        });
        // Apply centering to current
        const categoryId = checkbox.id.replace('checkbox-center-', 'category-');
        const category = document.getElementById(categoryId);
        applyCentering(category);
    } else {
        // Remove centering
        const categoryId = checkbox.id.replace('checkbox-center-', 'category-');
        const category = document.getElementById(categoryId);
        removeCentering(category);
    }
};

const updateViewportSize = () => {
    const output = document.getElementById('output-viewport-size');
    if (output) {
        output.value = `${window.innerWidth} x ${window.innerHeight}`;
    }
};

// Wrap setup in an IIFE to avoid polluting the module scope
(() => {
    document.getElementById('select-viewport-fit')?.addEventListener('change', onViewportFitChange);

    ['range-header-top', 'range-footer-bottom'].forEach(id =>
        document.getElementById(id)?.addEventListener('input', onPositionOffsetChange));

    ['select-header-position', 'select-footer-position'].forEach(id =>
        document.getElementById(id)?.addEventListener('change', handlePositionTypeChange));

    ['checkbox-body-background', 'checkbox-header-background', 'checkbox-sticky-background', 'checkbox-footer-background'].forEach(id =>
        document.getElementById(id)?.addEventListener('change', onBackgroundToggle));

    document.getElementById('checkbox-sticky-visibility')?.addEventListener('change', onStickyToggle);

    // Set initial state for the sticky checkbox
    const stickyCheckbox = document.getElementById('checkbox-sticky-background');
    if (stickyCheckbox) {
        stickyCheckbox.checked = true;
        stickyCheckbox.dispatchEvent(new Event('change'));
    }

    const stickyVisibilityCheckbox = document.getElementById('checkbox-sticky-visibility');
    if (stickyVisibilityCheckbox) {
        stickyVisibilityCheckbox.checked = true;
        stickyVisibilityCheckbox.dispatchEvent(new Event('change'));
    }

    // Add event listeners for center checkboxes
    ['checkbox-center-meta', 'checkbox-center-body', 'checkbox-center-header', 'checkbox-center-sticky', 'checkbox-center-footer'].forEach(id =>
        document.getElementById(id)?.addEventListener('change', onCenterToggle));

    // Update viewport size on load and resize
    window.addEventListener('resize', updateViewportSize);
    updateViewportSize();
})();
