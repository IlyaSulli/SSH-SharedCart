// Get the theme toggle button
const themeToggle = document.getElementById('themeToggle');

// Apply color theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Check the stored theme on page load and apply it
document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if no theme is stored
    applyTheme(storedTheme);
});

// Toggle the theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// Notification system
const notificationsContainer = document.createElement('div');
notificationsContainer.className = 'notifications-container';
document.body.appendChild(notificationsContainer);

function showNotification(type, content) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Create the icon element
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-icons notification-icon';

    // Set the icon based on the type
    let iconName = '';
    switch(type) {
        case 'info':
            iconName = 'info';
            break;
        case 'warning':
            iconName = 'warning';
            break;
        case 'error':
            iconName = 'error';
            break;
        case 'success':
            iconName = 'check_circle';
            break;
        default:
            iconName = 'notifications';
    }
    iconSpan.innerText = iconName;

    // Create the content element
    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';
    contentDiv.textContent = content;

    // Append the icon and content to the notification
    notification.appendChild(iconSpan);
    notification.appendChild(contentDiv);
    notificationsContainer.appendChild(notification);

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}