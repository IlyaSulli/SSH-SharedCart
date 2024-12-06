const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);
});

// On page load, apply the saved theme
const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
document.documentElement.setAttribute('data-theme', savedTheme);
