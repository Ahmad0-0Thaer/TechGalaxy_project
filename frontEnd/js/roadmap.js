'use strict';

// Function to add event listener on multiple elements
const addEventOnElements = (elements, eventType, callback) => {
  elements.forEach(el => el.addEventListener(eventType, callback));
};

// Navbar toggle functionality
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNav = () => {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
};
const closeNav = () => {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
};
navToggler.addEventListener("click", toggleNav);
addEventOnElements(navLinks, "click", closeNav);

// Header & Back-to-top button on scroll
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
const handleScroll = () => {
  const shouldShow = window.scrollY > 100;
  header.classList.toggle("active", shouldShow);
  backTopBtn.classList.toggle("active", shouldShow);
};
window.addEventListener("scroll", handleScroll);

// Button ripple effect
const buttons = document.querySelectorAll("[data-btn]");
addEventOnElements(buttons, "mousemove", function (event) {
  this.style.setProperty("--top", `${event.offsetY}px`);
  this.style.setProperty("--left", `${event.offsetX}px`);
});

// Scroll reveal effect
const revealElements = document.querySelectorAll("[data-reveal]");
const revealElementOnScroll = () => {
  revealElements.forEach(el => {
    const isVisible = el.getBoundingClientRect().top < window.innerHeight / 1.1;
    if (isVisible) el.classList.add("revealed");
  });
};
window.addEventListener("scroll", revealElementOnScroll);
window.addEventListener("load", revealElementOnScroll);

// Profile dropdown
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
profileBtn.addEventListener("click", e => {
  e.stopPropagation();
  profileDropdown.classList.toggle("active");
});
document.addEventListener("click", e => {
  if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("active");
  }
});
document.getElementById("logoutBtn")?.addEventListener("click", e => {
  e.preventDefault();
  window.location.href = "./index.html";
});

// Display user name from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem("userName") || "Guest";
  document.getElementById("user-name").textContent = userName;
});

// API URLs
const API_BASE = "https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/all";
const roadmapList = document.getElementById('roadmapList');


// Fetch and display roadmaps
function fetchAndDisplayRoadmaps() {
  fetch(`${API_BASE}/all`)
    .then(res => res.json())
    .then(data => {
      roadmapList.innerHTML = "";
      
      if (!Array.isArray(data) || data.length === 0) {
        roadmapList.innerHTML = "<p>No roadmaps found.</p>";
        return;
      }

      data.forEach(roadmap => {
        const card = document.createElement("div");
card.setAttribute("data-reveal", "bottom");
card.setAttribute("data-difficulty", (roadmap.difficultyLevel || "").toLowerCase());
card.setAttribute("data-category", (roadmap.category || "").toLowerCase());
card.classList.add("roadmap-card"); // Capital R to match your class

card.innerHTML = `
  <div class="preview-bar">${roadmap.category || "Uncategorized"}</div>
  <figure class="card-banner img-holder" style="--width: 600; --height: 400;">
    <a href="./roadmap.html?id=${roadmap.id}">
      <img src="${roadmap.coverImageUrl || './Images/default.avif'}" width="600" height="400" loading="lazy"
        alt="${roadmap.title}" class="img-cover">
    </a>
  </figure>

  <div class="card-content">
    <ul class="card-meta-list">
      <li class="card-meta-item">
        <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
        <time class="card-meta-text">${roadmap.createdAt || "Unknown"}</time>
      </li>
      <li class="card-meta-item">
        <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
        <p class="card-meta-text">${roadmap.expertName || "Anonymous"}</p>
      </li>
    </ul>

    <h3 class="h3">
      <a href="./roadmap.html?id=${roadmap.id}" class="card-title">${roadmap.title}</a>
    </h3>

    <a href="./roadmap.html?id=${roadmap.id}">
      <p class="card-text">${roadmap.description}</p>
    </a>

    <span class="badge ${(roadmap.difficultyLevel || "").toLowerCase()}">
      <i class="fas fa-signal"></i>
      ${roadmap.difficultyLevel}
    </span>

    <button class="like-btn" data-roadmap-id="${roadmap.id}">
    <ion-icon class="like-icon" name="heart-outline"></ion-icon>
    <span class="like-count">${roadmap.likesCount || 0}</span>
  </button>

  </div>
`;

roadmapList.appendChild(card);

      });

      addLikeButtonEvents();
      updateRoadmapStats(); // optional: based on loaded cards
      revealElementOnScroll();
    })
    .catch(err => {
      console.error("Failed to fetch roadmaps:", err);
      roadmapList.innerHTML = "<p>Failed to load roadmaps.</p>";
    });
}

// Like button functionality
function addLikeButtonEvents() {
  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();

      const roadmapId = this.getAttribute("data-roadmap-id");
      const likeCountEl = this.querySelector('.like-count');
      const likeIcon = this.querySelector('.like-icon');

      const isLiked = this.classList.contains("liked");
      const method = isLiked ? "DELETE" : "POST";

      fetch(`${API_BASE}/${roadmapId}/like`, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(data => {
        // إذا API رجع likeCount محدث:
        if (typeof data.likesCount === 'number') {
          likeCountEl.textContent = data.likesCount;
        } else {
          // احتياطي
          let count = parseInt(likesCountEl.textContent);
          likeCountEl.textContent = isLiked ? count - 1 : count + 1;
        }

        // تغيير الشكل
        this.classList.toggle("liked");
        likeIcon.setAttribute("name", isLiked ? "heart-outline" : "heart");
      })
      .catch(err => {
        console.error("Like/unlike failed", err);
        alert("حدث خطأ أثناء تحديث الإعجاب.");
      });
    });
  });
}


// Fetch roadmap stats
function updateRoadmapStats() {
  fetch(`${API_BASE}/stats`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("beginner-count").textContent = data.beginner;
      document.getElementById("intermediate-count").textContent = data.intermediate;
      document.getElementById("advanced-count").textContent = data.advanced;

      const total = data.beginner + data.intermediate + data.advanced;
      document.getElementById("total-count").textContent = total;
    })
    .catch(err => {
      console.error("Failed to fetch stats:", err);
      fallbackStats();
    });
}

// Fallback in case API fails
function fallbackStats() {
  const cards = document.querySelectorAll('.roadmap-card');

  let beginner = 0, intermediate = 0, advanced = 0;
  cards.forEach(card => {
    const level = card.dataset.difficulty;
    if (level === "beginner") beginner++;
    if (level === "intermediate") intermediate++;
    if (level === "advanced") advanced++;
  });

  document.getElementById("total-count").textContent = cards.length;
  document.getElementById("beginner-count").textContent = beginner;
  document.getElementById("intermediate-count").textContent = intermediate;
  document.getElementById("advanced-count").textContent = advanced;
}

// Filters: search, level, category
document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll('.roadmap-card').forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    card.style.display = title.includes(query) ? 'block' : 'none';
  });
});

document.getElementById('levelFilter').addEventListener('change', function () {
  const level = this.value;
  document.querySelectorAll('.roadmap-card').forEach(card => {
    const levelTag = card.getAttribute('data-difficulty');
    card.style.display = (level === 'all' || level === levelTag) ? 'block' : 'none';
  });
});

document.getElementById('categoryFilter').addEventListener('change', function () {
  const selectedCategory = this.value;
  document.querySelectorAll('.roadmap-card').forEach(card => {
    const category = card.getAttribute('data-category');
    card.style.display = (selectedCategory === 'all' || category === selectedCategory) ? 'block' : 'none';
  });
});

// Load data
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayRoadmaps();
  updateRoadmapStats();
});

 