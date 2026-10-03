// Timestamp: when the form was loaded.
// (Footer year/last-modified are already handled by common.js's
// setFooterInfo() — no need to duplicate that here.)
document.querySelector('#timestamp').value = new Date().toISOString();

// Open a modal when its card link is clicked
document.querySelectorAll('.level-card a[data-modal]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById(link.dataset.modal).showModal();
    });
});

document.querySelectorAll('dialog').forEach((dialog) => {
    // Close button
    dialog.querySelector('.close-modal').addEventListener('click', () => dialog.close());

    // Click on the backdrop (outside the box) closes it
    dialog.addEventListener('click', (e) => {
        const box = dialog.getBoundingClientRect();
        const outside =
            e.clientX < box.left || e.clientX > box.right ||
            e.clientY < box.top || e.clientY > box.bottom;
        if (outside) dialog.close();
    });
});