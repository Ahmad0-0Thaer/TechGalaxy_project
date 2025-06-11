/**
 * Profile Page Script
 */

document.addEventListener('DOMContentLoaded', function() {
  // Fetch user profile data
  fetchProfileData();
  
  // Initialize other components
  initProfileDropdown();
});

// Fetch profile data from API
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
    // Display error message to user
  }
}

// Display profile data in the UI
function displayProfileData(data) {
  // Basic profile info
  document.getElementById('profileName').textContent = data.name || 'No Name';
  document.getElementById('profileEmail').textContent = data.email || 'No Email';
  document.getElementById('profileRole').textContent = data.role || 'No Role';
  document.getElementById('profileSpecialty').textContent = data.specialty || 'No Specialty';
  
  // Certificate
  const certificateImage = document.getElementById('certificateImage');
  if (data.certificatePath) {
    certificateImage.src = data.certificatePath;
    certificateImage.style.display = 'block';
  } else {
    certificateImage.style.display = 'none';
    document.querySelector('.upload-certificate-btn').textContent = 'Add Certificate';
  }
  
  // Created Roadmaps
  const createdRoadmapsGrid = document.getElementById('createdRoadmapsGrid');
  if (data.createdRoadmaps && data.createdRoadmaps.length > 0) {
    createdRoadmapsGrid.innerHTML = data.createdRoadmaps.map(roadmap => `
      <div class="roadmap-card">
        <h3 class="roadmap-title">${roadmap.title || 'Untitled Roadmap'}</h3>
        <div class="roadmap-meta">
          <span class="roadmap-category">${roadmap.category || 'Uncategorized'}</span>
          <span class="roadmap-date">${formatDate(roadmap.createdAt)}</span>
        </div>
        <div class="roadmap-difficulty ${roadmap.difficultyLevel?.toLowerCase() || 'beginner'}">
          ${roadmap.difficultyLevel || 'Beginner'}
        </div>
        <a href="roadmap-details.html?id=${roadmap.id}" class="btn" style="margin-top: 15px; padding: 8px 15px; font-size: 1.4rem;">View Roadmap</a>
      </div>
    `).join('');
  } else {
    createdRoadmapsGrid.innerHTML = '<p>No roadmaps created yet.</p>';
  }
  
  // Followed Roadmaps
  const followedRoadmapsGrid = document.getElementById('followedRoadmapsGrid');
  if (data.followedRoadmap && data.followedRoadmap.length > 0) {
    followedRoadmapsGrid.innerHTML = data.followedRoadmap.map(roadmap => `
      <div class="roadmap-card">
        <h3 class="roadmap-title">${roadmap.title || 'Untitled Roadmap'}</h3>
        <div class="roadmap-meta">
          <span class="roadmap-category">${roadmap.category || 'Uncategorized'}</span>
        </div>
        <a href="roadmap-details.html?id=${roadmap.id}" class="btn" style="margin-top: 15px; padding: 8px 15px; font-size: 1.4rem;">View Roadmap</a>
      </div>
    `).join('');
  } else {
    followedRoadmapsGrid.innerHTML = '<p>No roadmaps followed yet.</p>';
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'No date';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize profile dropdown
function initProfileDropdown() {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  // Toggle dropdown
  profileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('active');
    }
  });

  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Add logout logic here (clear tokens, etc.)
    window.location.href = './index.html';
  });
}

// Add event listeners for edit buttons
document.querySelector('.edit-profile-btn').addEventListener('click', function() {
  // Implement edit profile functionality
  alert('Edit profile functionality will be implemented here');
});

document.querySelector('.upload-certificate-btn').addEventListener('click', function() {
  // Implement certificate upload functionality
  alert('Certificate upload functionality will be implemented here');
});

/**
 * The rest of your existing JavaScript code...
 * (All the code you provided in your original profile.JS file)
 */

// ... (keep all your existing utility functions and other code)