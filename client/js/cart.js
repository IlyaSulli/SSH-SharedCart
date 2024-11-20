document.querySelectorAll('.personalCartSummary').forEach(summary => {
    summary.addEventListener('click', function () {
        const personalCart = this.closest('.personalCart');
        const dropdown = personalCart.querySelector('.personalCartDropdown');

        if (personalCart.classList.contains('expanded')) {
            // Collapse
            dropdown.style.maxHeight = '0';
            dropdown.style.padding = '0 20px';
            dropdown.style.width = '';
        } else {
            // Expand
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
            dropdown.style.padding = '20px 20px';
            dropdown.style.width = 'auto';
        }

        personalCart.classList.toggle('expanded');
    });
});

// Select all Confirm buttons
document.querySelectorAll('.cartConfirmButton').forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevents the event from bubbling up
        // Add any additional functionality for the Confirm button here
    });
});
