// Toggle dark mode by adding/removing 'dark-mode' class on body
const btn = document.getElementById('toggleMode');
btn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Optional: Persist mode in localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}
btn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
