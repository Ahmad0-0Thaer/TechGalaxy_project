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

// userName display
window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    document.getElementById("user-name").textContent = userName;
  } else {
    document.getElementById("user-name").textContent = "Guest";
  }
});


const roadmapList = document.getElementById("roadmapList");

// Add search functionality
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const difficultyFilter = document.getElementById("difficultyFilter");

let allRoadmaps = []; // Store all roadmaps for filtering

// Function to filter roadmaps
function filterRoadmaps() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedDifficulty = difficultyFilter.value;

  const filteredRoadmaps = allRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm) ||
      roadmap.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || roadmap.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || roadmap.difficultyLevel === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  displayRoadmaps(filteredRoadmaps);
}

// Function to display roadmaps
function displayRoadmaps(roadmaps) {
  roadmapList.innerHTML = '';
  roadmaps.forEach(roadmap => {
    const li = document.createElement("li");
    const card = document.createElement("div");
    card.classList.add("roadmap-card");

    card.innerHTML = `
      <figure class="card-banner img-holder" style="--width: 600; --height: 400; position: relative;">
        <a href="./showRoadmapUser.html?id=${roadmap.id}">
          <img src="${roadmap.coverImageUrl}" width="600" height="400" loading="lazy"
            alt="${roadmap.title}" class="img-cover">
          <span class="preview-bar">${roadmap.category || "Uncategorized"}</span>
        </a>
      </figure>

      <div class="card-content">
        <ul class="card-meta-list">
          <li class="card-meta-item">
            <ion-icon name="calendar-outline"></ion-icon>
            <time class="card-meta-text">${roadmap.createdAt}</time>
          </li>
          <li class="card-meta-item">
            <ion-icon name="person-outline"></ion-icon>
            <p class="card-meta-text">${roadmap.expertName}</p>
          </li>
        </ul>

        <h3 class="h3">
          <a href="./showRoadmapUser.html?id=${roadmap.id}" class="card-title">${roadmap.title}</a>
        </h3>

        <a href="./showRoadmapUser.html?id=${roadmap.id}">
          <p class="card-text">${roadmap.description}</p>
        </a>

        <span class="badge ${roadmap.difficultyLevel.toLowerCase()}">
          <i class="fas fa-signal"></i>
          ${roadmap.difficultyLevel}
        </span>

        <button class="like-btn" data-id="${roadmap.id}" data-liked="${roadmap.likedByCurrentUser}">
          <ion-icon name="${roadmap.likedByCurrentUser ? 'heart' : 'heart-outline'}" class="like-icon"></ion-icon>
          <span class="like-count">${roadmap.likesCount || 0}</span>
        </button>
      </div>
    `;

    li.appendChild(card);
    roadmapList.appendChild(li);
    if (roadmap.likedByCurrentUser) {
      li.querySelector(".like-btn").classList.add("liked");
    }
  });
}

// Add event listeners for search and filters
searchInput.addEventListener("input", filterRoadmaps);
categoryFilter.addEventListener("change", filterRoadmaps);
difficultyFilter.addEventListener("change", filterRoadmaps);

// Modify the fetch call to store all roadmaps
async function fetchRoadmaps() {
  try {
    const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roadmaps');
    }

    const roadmaps = await response.json();

    // Fetch like status for each roadmap
    const roadmapsWithLikeStatus = await Promise.all(roadmaps.map(async (roadmap) => {
      try {
        const likeResponse = await fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/like-status/${roadmap.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (likeResponse.ok) {
          const likeData = await likeResponse.json();
          return {
            ...roadmap,
            likedByCurrentUser: likeData.isLiked,
            likesCount: likeData.likesCount
          };
        }
        return roadmap;
      } catch (error) {
        console.error(`Failed to fetch like status for roadmap ${roadmap.id}:`, error);
        return roadmap;
      }
    }));

    displayRoadmaps(roadmapsWithLikeStatus);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
  }
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".like-btn")) {
    const btn = e.target.closest(".like-btn");
    const liked = btn.getAttribute("data-liked") === "true";
    const roadmapId = btn.getAttribute("data-id");
    const likeCountSpan = btn.querySelector(".like-count");
    const likeIcon = btn.querySelector(".like-icon");
    let likesCount = parseInt(likeCountSpan.textContent);

    // إرسال الطلب إلى السيرفر
    fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/like/${roadmapId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update like status");
        }
        return response.json();
      })
      .then(data => {
        if (data.liked) {
          btn.setAttribute("data-liked", "true");
          btn.classList.add("liked");
          likeIcon.setAttribute("name", "heart");
        } else {
          btn.setAttribute("data-liked", "false");
          btn.classList.remove("liked");
          likeIcon.setAttribute("name", "heart-outline");
        }

        likeCountSpan.textContent = data.likesCount;
      })
      .catch(error => {
        console.error("Failed to update like status:", error);
      });
  }
});

