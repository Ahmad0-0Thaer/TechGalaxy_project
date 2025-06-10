 
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

 // هذه هي وظيفة البناء
function renderRoadmap(data) {
  const container = document.getElementById("roadmap-container");
  container.innerHTML = ""; // مسح المحتوى السابق

  // أولاً – كارد الصورة والتفاصيل
  const card = document.createElement("div");
  card.className = "custom-card";
  const fullImageUrl = `https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net${data.coverImageUrl}`;
  
  card.innerHTML = `
    <div class="custom-image-wrapper">
      <span class="category-badge">${data.category}</span>
      <img src="${fullImageUrl}" alt="Roadmap Image" class="custom-image" />
      <button class="btn follow-btn" id="follow-btn">Follow</button>
    </div>
    <div class="custom-content">
      <h2 class="custom-title">${data.title}</h2>
      <p class="custom-description">${data.description}</p>
      <span class="custom-name">${data.createdBy}</span>
    </div>
    <div class="difficulty-badge ${data.difficultyLevel.toLowerCase()}">
  <i class="fas fa-signal"></i> ${data.difficultyLevel}
</div>
  `;
  container.appendChild(card);
  // تفعيل زر المتابعة
// تفعيل زر المتابعة داخل renderRoadmap
const token = localStorage.getItem("token");
const followBtn = document.querySelector(".follow-btn");

// تحديث نص الزر عند تحميل الصفحة بناءً على البيانات (إن وُجدت)
if (typeof data.isFollowed === "boolean") {
  followBtn.textContent = data.isFollowed ? "Unfollow" : "Follow";
}

followBtn.addEventListener("click", () => {
  if (!token) {
    alert("Please log in first.");
    return;
  }

  fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/FollowedRoadmaps/${data.id}/toggle-follow`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Request failed");
      return res.json(); // يحتوي على { isFollowed: true/false }
    })
    .then(result => {
  followBtn.textContent = result.followed ? "Unfollow" : "Follow";
})
    .catch(err => {
      console.error("Toggle follow error:", err);
      alert("An error occurred while toggling follow status.");
    });
});




  // ثانياً – كارد الـ nodes مع Progress Bar
  const progressCard = document.createElement("div");
  progressCard.className = "custom-card";
  let nodesHTML = "";

    data.fields.forEach((node, i) => {
    const resLinks = node.resources.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("");
    nodesHTML += `
      <div class="node">
        <div class="node-header">
          <h3>${node.title}</h3>
          <i class="fas fa-chevron-down toggle-icon"></i>
        </div>
        <div class="node-body">
          <p>${node.description}</p><hr>
          <p><strong>Resources:</strong></p><ul>${resLinks}</ul><hr>
          <label class="custom-checkbox">
            <input type="checkbox" class="node-check" />
            Mark this section as completed once you're done
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    `;
  });

  progressCard.innerHTML = `
    <div class="custom-content">
      <div class="progress-container">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <div class="node-list">${nodesHTML}</div>
    </div>
  `;
  container.appendChild(progressCard);

  // تابع مفتاح الفتح والإغلاق (accordion)
  progressCard.querySelectorAll('.node-header').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
  });

  // تابع progress Update
  function updateProgress() {
    const checks = progressCard.querySelectorAll('.node-check');
    const total = checks.length;
    const done = Array.from(checks).filter(c => c.checked).length;
    const p = Math.round((done / total) * 100);
    progressCard.querySelector('#progress-bar').style.width = p + '%';
  }

  // حدث عند كل تغيير
  progressCard.querySelectorAll('.node-check').forEach(cb => {
    cb.addEventListener('change', updateProgress);
  });
  updateProgress();
}

// استخراج الـ ID من الرابط
const params = new URLSearchParams(window.location.search);
const roadmapId = params.get("id");

if (!roadmapId) {
  alert("No roadmap ID provided in the URL.");
} else {
  fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/${roadmapId}`)
    .then(r => r.json())
    .then(data => {
      renderRoadmap(data);
    })
    .catch(e => console.error("Error loading roadmap:", e));
}
 /* new */

 /* document.querySelectorAll('.node-header').forEach(header => {
    header.addEventListener('click', () => {
      const node = header.parentElement;
      node.classList.toggle('open');
    });
  });

  function updateProgress() {
  const checkboxes = document.querySelectorAll('.node-check');
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const percent = Math.round((checked / total) * 100);
  document.getElementById('progress-bar').style.width = percent + '%';
}

// تحديث عند كل تغيير للـ checkbox
document.querySelectorAll('.node-check').forEach(cb => {
  cb.addEventListener('change', updateProgress);
});

// تحديث أولي عند تحميل الصفحة
updateProgress(); */

