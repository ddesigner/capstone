import { toCamelCase } from '../../scripts/aem.js';

/* ----------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------- */
function createElement(tag, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
}

function generateId(name) {
    return toCamelCase(name);
}

/* ----------------------------------------------------------
 * Accessibility helpers
 * ---------------------------------------------------------- */
function buildLabel(text, id, required = false) {
    const label = createElement('label');
    label.textContent = text;
    label.setAttribute('for', id);
    if (required) label.dataset.required = 'true';
    return label;
}

function writeHelpText(text, inputId) {
    const help = createElement('p', 'field-help-text');
    help.textContent = text;
    help.id = `${inputId}-help`;
    return help;
}

/* ----------------------------------------------------------
 * Field builders
 * ---------------------------------------------------------- */
function buildHeading(field) {
    const heading = createElement('h2');
    heading.textContent = field.label;
    return heading;
}

function buildInput(field) {
    const { name, type, label, placeholder, value, options, required, style, fieldId, fieldset, default: defaultValue } = field

    const input = createElement('input');
    input.type = type;
    input.id = generateId(fieldId);
    input.name = name;
    input.required = required === 'true';

    if (placeholder) input.placeholder = placeholder;
    if (defaultValue) input.value = defaultValue;

    return input;
}

function buildTextArea(field) {
    const textarea = createElement('textarea');
    textarea.id = generateId(field.fieldId);
    textarea.name = textarea.id;
    textarea.rows = 5;
    textarea.required = field.required === 'true';
    return textarea;
}

function buildButton(field) {
    const button = createElement('button', 'button');
    button.type = 'submit';
    button.textContent = field.label || 'Submit';
    return button;
}

/* ----------------------------------------------------------
 * Field wrapper
 * ---------------------------------------------------------- */
function buildField(field) {
    const { name, type, label, help, placeholder, value, options, required, style, fieldId, fieldset } = field
    // Submit
    if (type === 'submit') {
        return buildButton(field);
    }

    const wrapper = createElement('div', `form-field ${type}-field`);
    const inputId = generateId(fieldId);

    wrapper.append(buildLabel(label, inputId, required === 'true'));

    let helpText;
    if (help) {
        helpText = writeHelpText(help, inputId);
        wrapper.append(helpText);
    }

    const input = type === 'textarea'
        ? buildTextArea(field)
        : buildInput(field);

    wrapper.append(input);

    if (helpText) {
        input.setAttribute('aria-describedby', helpText.id);
    }

    return wrapper;
}

/* ----------------------------------------------------------
 * Submission
 * ---------------------------------------------------------- */
function generatePayload(form) {
    const payload = {};
    [...form.elements].forEach((el) => {
        if (el.name && !el.disabled) {
            payload[el.name] = el.value;
        }
    });
    return payload;
}

async function handleSubmit(form) {
    try {
        const payload = generatePayload(form);

        const response = await fetch(form.dataset.action, {
            method: 'POST',
            body: JSON.stringify({ data: payload }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        if (form.dataset.confirmation) {
            window.location.href = form.dataset.confirmation;
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
}

function enableSubmission(form, submit) {
    if (!submit) return;

    form.dataset.action = submit;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (form.reportValidity()) {
            handleSubmit(form);
        } else {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.setAttribute('aria-invalid', 'true');
            }
        }
    });
}

/* ----------------------------------------------------------
 * Form builder
 * ---------------------------------------------------------- */
function buildForm(fields, submit) {
    const form = createElement('form');
    form.setAttribute('novalidate', '');

    fields.forEach((field) => {
        form.append(buildField(field));
    });

    enableSubmission(form, submit);
    return form;
}

/* ----------------------------------------------------------
 * Decorator
 * ---------------------------------------------------------- */
export default async function decorate(block) {
    block.style.visibility = 'hidden';

    const links = [...block.querySelectorAll('a[href]')];
    const source = links[0]?.href;
    const submit = links[1]?.href;

    if (!source) {
        // eslint-disable-next-line no-console
        console.error('Form source missing');
        return;
    }

    try {
        const resp = await fetch(source);
        const { data } = await resp.json();

        const form = buildForm(data, submit);
        block.replaceChildren(form);
        block.removeAttribute('style');
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Form build failed', e);
        block.parentElement.remove();
    }
}
