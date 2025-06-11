

/**
 * add event on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * MOBILE NAVBAR
 * navbar will show after clicking menu button
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
}

navToggler.addEventListener("click", toggleNav);

const navClose = () => {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElements(navLinks, "click", navClose);



/**
 * HEADER and BACK TOP BTN
 * header and back top btn will be active after scrolled down to 100px of screen
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeEl = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeEl);



/**
 * Button hover ripple effect
 */

const buttons = document.querySelectorAll("[data-btn]");

const buttonHoverRipple = function (event) {
  this.style.setProperty("--top", `${event.offsetY}px`);
  this.style.setProperty("--left", `${event.offsetX}px`);
}

addEventOnElements(buttons, "mousemove", buttonHoverRipple);



/**
 * Scroll reveal
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    const isElementInsideWindow = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.1;

    if (isElementInsideWindow) {
      revealElements[i].classList.add("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);

window.addEventListener("load", revealElementOnScroll);



/**
 * Custom cursor
 */

const cursor = document.querySelector("[data-cursor]");
const hoverElements = [...document.querySelectorAll("a"), ...document.querySelectorAll("button")];

const cursorMove = function (event) {
  cursor.style.top = `${event.clientY}px`;
  cursor.style.left = `${event.clientX}px`;
}

window.addEventListener("mousemove", cursorMove);

addEventOnElements(hoverElements, "mouseover", function () {
  cursor.classList.add("hovered");
});

addEventOnElements(hoverElements, "mouseout", function () {
  cursor.classList.remove("hovered");
});

/**
 * Profile Dropdown
 */

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

// Toggle dropdown
profileBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  profileDropdown.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("active");
  }
});

// Handle logout
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // Add your logout logic here
  window.location.href = "./index.html"; // Redirect to home page or login page
});

// Include all the existing utility functions from your original JS file
// (addEventOnElements, toggleNav, activeEl, buttonHoverRipple, etc.)

// Profile Data Fetching and Display
document.addEventListener('DOMContentLoaded', function() {
  // Fetch profile data from API
  fetchProfileData();
  
  // Set up event listeners for profile dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  profileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
  });

  document.addEventListener('click', function(e) {
    if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('active');
    }
  });

  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Add any logout logic here (clearing session, etc.)
    window.location.href = './index.html';
  });
});

async function fetchProfileData() {
  try {
    const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const profileData = await response.json();
    displayProfileData(profileData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    // Display error messages to user
    document.getElementById('profile-name').textContent = 'Error loading profile';
    document.getElementById('profile-email').textContent = 'Please try again later';
  }
}

function displayProfileData(data) {
  // Basic Info
  document.getElementById('profile-name').textContent = data.name || 'Not provided';
  document.getElementById('profile-email').textContent = data.email || 'Not provided';
  document.getElementById('profile-role').textContent = data.role || 'Not provided';
  document.getElementById('profile-specialty').textContent = data.specialty || 'Not provided';
  
  // Certificate (if exists)
  if (data.certificatePath) {
    document.getElementById('certificate-item').style.display = 'flex';
    document.getElementById('certificate-link').href = data.certificatePath;
  }
  
  // Created Roadmaps
  const createdRoadmapsList = document.getElementById('created-roadmaps-list');
  if (data.createdRoadmaps && data.createdRoadmaps.length > 0) {
    createdRoadmapsList.innerHTML = '';
    data.createdRoadmaps.forEach(roadmap => {
      const roadmapItem = document.createElement('div');
      roadmapItem.className = 'roadmap-item';
      roadmapItem.innerHTML = `
        <div class="roadmap-title">${roadmap.title}</div>
        <div class="roadmap-meta">
          <span><i class="fas fa-tag"></i> ${roadmap.category}</span>
          <span><i class="fas fa-chart-line"></i> ${roadmap.difficultyLevel}</span>
          <span><i class="far fa-calendar-alt"></i> ${new Date(roadmap.createdAt).toLocaleDateString()}</span>
        </div>
      `;
      createdRoadmapsList.appendChild(roadmapItem);
    });
  } else {
    createdRoadmapsList.innerHTML = '<div class="empty-state">You haven\'t created any roadmaps yet</div>';
  }
  
  // Followed Roadmaps
  const followedRoadmapsList = document.getElementById('followed-roadmaps-list');
  if (data.followedRoadmap && data.followedRoadmap.length > 0) {
    followedRoadmapsList.innerHTML = '';
    data.followedRoadmap.forEach(roadmap => {
      const roadmapItem = document.createElement('div');
      roadmapItem.className = 'roadmap-item';
      roadmapItem.innerHTML = `
        <div class="roadmap-title">${roadmap.title}</div>
        <div class="roadmap-meta">
          <span><i class="fas fa-tag"></i> ${roadmap.category}</span>
        </div>
      `;
      followedRoadmapsList.appendChild(roadmapItem);
    });
  } else {
    followedRoadmapsList.innerHTML = '<div class="empty-state">You\'re not following any roadmaps yet</div>';
  }
  
  // Update header user info
  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = data.name || 'User';
  }
  
  const userTypeElement = document.getElementById('userType');
  if (userTypeElement && data.role) {
    userTypeElement.textContent = data.role;
  }
}

// Include all the other existing functions from your original JS file
// (cursor movement, scroll reveal, etc.)