document.addEventListener('DOMContentLoaded', function() {
    const dueDateInput = document.getElementById('due-date-input');
    
    // Add event listener to show date picker icon
    dueDateInput.addEventListener('focus', function() {
        this.type = 'date';
    });

    dueDateInput.addEventListener('blur', function() {
        if (!this.value) {
            this.type = 'text'; // Switch back to text if no date is selected
        }
    });
});


