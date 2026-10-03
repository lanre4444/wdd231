const params = new URLSearchParams(window.location.search);

const fields = [
    ['First name', 'first'],
    ['Last name', 'last'],
    ['Email', 'email'],
    ['Mobile phone', 'phone'],
    ['Business or organization', 'business'],
    ['Submitted on', 'timestamp'],
];

const results = document.querySelector('#results');

fields.forEach(([label, key]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;

    const dd = document.createElement('dd');
    let value = params.get(key) || '';
    if (key === 'timestamp' && value) {
        value = new Date(value).toLocaleString();
    }
    dd.textContent = value; // textContent avoids injecting markup from the URL

    results.append(dt, dd);
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();