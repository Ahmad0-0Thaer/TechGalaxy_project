'use strict';



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

const toggleNav = () => {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
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

/**
 * Like Button Functionality
 */

const likeButtons = document.querySelectorAll('.like-btn');

likeButtons.forEach(button => {
  button.addEventListener('click', function () {
    const likeCount = this.querySelector('.like-count');
    const likeIcon = this.querySelector('.like-icon');

    if (this.classList.contains('liked')) {
      // Unlike
      this.classList.remove('liked');
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
      likeIcon.setAttribute('name', 'heart-outline');
    } else {
      // Like
      this.classList.add('liked');
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
      likeIcon.setAttribute('name', 'heart');
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    document.getElementById("user-name").textContent = userName;
  } else {
    document.getElementById("user-name").textContent = "Guest";
  }
});
  


// يمكنك لاحقًا إضافة الكود الخاص بالفرز باستخدام sortSelect
  document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll('.roadmap-card').forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    card.parentElement.style.display = title.includes(query) ? 'block' : 'none';
  });
});

document.getElementById('levelFilter').addEventListener('change', function () {
  const level = this.value;
  document.querySelectorAll('.roadmap-card').forEach(card => {
    const levelTag = card.getAttribute('data-difficulty'); // تأكد من تعيين هذا في كل بطاقة لاحقًا
    card.parentElement.style.display = (level === 'all' || level === levelTag) ? 'block' : 'none';
  });
});

document.getElementById('categoryFilter').addEventListener('change', function () {
  const selectedCategory = this.value;
  const cards = document.querySelectorAll('.roadmap-card');

  cards.forEach(card => {
    const category = card.getAttribute('data-category'); // تأكد إنه موجود
    if (selectedCategory === 'all' || category === selectedCategory) {
      card.parentElement.style.display = 'block';
    } else {
      card.parentElement.style.display = 'none';
    }
  });
});


// مثال على رابط API (تعدله حسب سيرفرك)
  const API_URL = 'https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/all'; 

  const roadmapList = document.getElementById('roadmapList');
  
  // Fetch and display roadmaps from API
  function fetchAndDisplayRoadmaps() {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        roadmapList.innerHTML = "";
        data.forEach(roadmap => {
          const roadmapItem = document.createElement('div');
          roadmapItem.setAttribute('data-reveal', 'bottom');
          roadmapItem.innerHTML = `
            <div class="roadmap-card" data-difficulty="${(roadmap.DifficultyLevel || "").toLowerCase()}" data-category="${roadmap.Category}">
              <figure class="card-banner img-holder" style="--width: 600; --height: 400;">
                <img src="${roadmap.CoverImageUrl || './Images/default.png'}" width="600" height="400" loading="lazy" alt="${roadmap.Title}" class="img-cover">
              </figure>
              <div class="card-content">
                <ul class="card-meta-list">
                  <li class="card-meta-item">
                    <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
                    <time class="card-meta-text">${roadmap.CreatedAt || 'Unknown'}</time>
                  </li>
                  <li class="card-meta-item">
                    <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                    <p class="card-meta-text">${roadmap.ExpertName || 'Anonymous'}</p>
                  </li>
                </ul>
                <h3 class="h3">
                  <a href="./roadmap.html?id=${roadmap.id}" class="card-title">${roadmap.Title}</a>
                </h3>
                <p class="card-text">${roadmap.Description}</p>
                <div class="card-footer">
                  <a href="./roadmap.html?id=${roadmap.id}" class="link has-before">Read More</a>
                  <button class="like-btn" aria-label="like roadmap">
                    <ion-icon name="heart-outline" class="like-icon"></ion-icon>
                    <span class="like-count">${roadmap.LikesCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          `;
          roadmapList.appendChild(roadmapItem);
        });
        /* updateRoadmapStats() */
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  

function updateRoadmapStats() {
  const cards = document.querySelectorAll(".roadmap-card");

  let beginnerCount = 0;
  let intermediateCount = 0;
  let advancedCount = 0;

  cards.forEach(card => {
    const level = card.dataset.difficulty;
    if (level === "beginner") beginnerCount++;
    else if (level === "intermediate") intermediateCount++;
    else if (level === "advanced") advancedCount++;
  });
 

  document.getElementById("total-count").textContent = cards.length;
  document.getElementById("beginner-count").textContent = beginnerCount;
  document.getElementById("intermediate-count").textContent = intermediateCount;
  document.getElementById("advanced-count").textContent = advancedCount;
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayRoadmaps);

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/stats')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const cards = document.querySelectorAll('.roadmap-card');
      document.getElementById("total-count").textContent = cards.length;
      document.getElementById('beginner-count').textContent = data.beginner;
      document.getElementById('intermediate-count').textContent = data.intermediate;
      document.getElementById('advanced-count').textContent = data.advanced;
    })
    .catch(error => {
  console.error('Error fetching roadmap stats:', error);

  // لو فشل الـ API، احسب التوتال من الكروت الموجودة على الصفحة
  const cards = document.querySelectorAll('.roadmap-card');

  let beginnerCount = 0;
  let intermediateCount = 0;
  let advancedCount = 0;

  cards.forEach(card => {
    const level = card.dataset.difficulty;
    if (level === "beginner") beginnerCount++;
    else if (level === "intermediate") intermediateCount++;
    else if (level === "advanced") advancedCount++;
  });

  document.getElementById("total-count").textContent = cards.length;
  document.getElementById("beginner-count").textContent = beginnerCount;
  document.getElementById("intermediate-count").textContent = intermediateCount;
  document.getElementById("advanced-count").textContent = advancedCount;
});
});
const apiURL = "https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/stats"; // عدل على الرابط حسب API حقك

// أعداد الإحصائيات
const totalCount = document.getElementById("total-count");
const beginnerCount = document.getElementById("beginner-count");
const intermediateCount = document.getElementById("intermediate-count");
const advancedCount = document.getElementById("advanced-count");

// جلب البيانات من API
fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    // تأكد أن البيانات عبارة عن مصفوفة
    if (!Array.isArray(data) || data.length === 0) {
      roadmapList.innerHTML = "<p>No roadmaps found.</p>";
      return;
    }

    // عرض Roadmaps في الصفحة
    roadmapList.innerHTML = data.map(r => `
      <article class="roadmap-item">
        <h3>${r.title}</h3>
        <p><strong>Category:</strong> ${r.category}</p>
        <p><strong>Level:</strong> ${r.level}</p>
        <p>${r.description || ''}</p>
      </article>
    `).join('');

    // تحديث الإحصائيات
    totalCount.textContent = data.length;
    beginnerCount.textContent = data.filter(r => r.level === "beginner").length;
    intermediateCount.textContent = data.filter(r => r.level === "intermediate").length;
    advancedCount.textContent = data.filter(r => r.level === "advanced").length;
  })
  .catch(err => {
    console.error("Failed to fetch roadmaps:", err);
    roadmapList.innerHTML = "<p>Failed to load roadmaps.</p>";
  });
  function createRoadmapCard(roadmap) {
  const li = document.createElement("li");
  li.className = "Roadmap-item";

  li.innerHTML = `
    <div class="Roadmap-card">
      <figure class="card-banner img-holder" style="--width: 370; --height: 240;">
        <img src="${roadmap.image}" width="370" height="240" loading="lazy" alt="${roadmap.title}" class="img-cover">
      </figure>

      <div class="card-content">
        <ul class="card-meta-list">
          <li class="card-meta-item">
            <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
            <time class="card-meta-text" datetime="${roadmap.date}">${roadmap.dateFormatted}</time>
          </li>
          <li class="card-meta-item">
            <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
            <p class="card-meta-text">${roadmap.expert}</p>
          </li>
        </ul>

        <h3 class="h3">
          <a href="./signUp.html" class="card-title">${roadmap.title}</a>
        </h3>

        <p class="card-text">${roadmap.description}</p>

        <a href="./signUp.html" class="link has-before">Read More</a>
      </div>
    </div>
  `;

  return li;
}
// مثال بيانات (بتقدر تجيبهم من API أو JSON)
const roadmaps = [
  {
    image: "./Images/dsa.jpg",
    date: "2022-01-01",
    dateFormatted: "Jan 01 2022",
    expert: "Elliot Alderson",
    title: "Data Structures & Algorithms",
    description: "Learn fundamental concepts for organizing, storing, and processing data in Python to ace technical interviews, LeetCode problems, or a college DSA class!"
  },
  // أضف المزيد حسب الحاجة
];

roadmaps.forEach(roadmap => {
  const card = createRoadmapCard(roadmap);
  roadmapList.appendChild(card);
});









