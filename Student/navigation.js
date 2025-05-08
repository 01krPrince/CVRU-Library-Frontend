function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
  }
  
  // Make the function available globally
  window.toggleMenu = toggleMenu;