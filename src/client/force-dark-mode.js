// Force dark mode immediately on page load
(function() {
  // Set dark mode in localStorage to override any existing preference
  localStorage.setItem('theme', 'dark');
  
  // Add data-theme attribute immediately
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Force the HTML element to have dark styling
  document.documentElement.style.background = '#000000';
  document.documentElement.style.color = '#ffffff';
  
  // Remove any light mode classes that might exist
  document.documentElement.classList.remove('theme-light');
  document.documentElement.classList.add('theme-dark');
  
  // Wait for DOM to be ready and apply dark mode again
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyDarkMode();
    });
  } else {
    applyDarkMode();
  }
  
  function applyDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.style.background = '#000000';
    document.body.style.color = '#ffffff';
    
    // Override any Docusaurus theme settings
    if (window.localStorage) {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('docusaurus.tab.docs', 'dark');
    }
  }
})();