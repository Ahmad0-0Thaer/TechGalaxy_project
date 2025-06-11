document.addEventListener('DOMContentLoaded', function () {
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
  
  // جلب بيانات المستخدم من API
    fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User data received:', data);

            // عرض بيانات المستخدم
            document.getElementById('headerUserName').textContent = data.name;
            document.getElementById('profileUserName').textContent = data.name;
            document.getElementById('userRole').textContent = data.role;
            document.getElementById('userSpecialty').textContent = data.specialty ? `| ${data.specialty}` : '';
            document.getElementById('userEmail').textContent = data.email;

            // عرض الشهادة إذا كانت موجودة
            const certificateSection = document.getElementById('certificateSection');
            const certificateImage = document.getElementById('certificateImage');
            const certificateLink = document.getElementById('certificateLink');

            // التحقق من وجود مسار الشهادة
            if (data.certificatePath && typeof data.certificatePath === 'string' && data.certificatePath.trim() !== '') {
                console.log('Certificate path found:', data.certificatePath);

                // التأكد من أن المسار يبدأ بـ http أو https
                let certificateUrl = data.certificatePath;
                if (!certificateUrl.startsWith('http://') && !certificateUrl.startsWith('https://')) {
                    certificateUrl = 'https://' + certificateUrl;
                }

                // تعيين الصورة مع معالجة الأخطاء
                certificateImage.onerror = function () {
                    console.error('Error loading certificate image');
                    certificateSection.style.display = 'none';
                };

                certificateImage.onload = function () {
                    console.log('Certificate image loaded successfully');
                    certificateSection.style.display = 'block';
                };

                // تعيين المصدر والرابط
                certificateImage.src = certificateUrl;
                certificateLink.href = certificateUrl;
            } else {
                console.log('No valid certificate path found');
                certificateSection.style.display = 'none';
            }

            // عرض الرودماب المتابعة
            const followedContainer = document.getElementById('followedRoadmaps');
            console.log('Followed Roadmaps data:', data.followedRoadmaps); // إضافة سجل للتحقق من البيانات

            if (data.followedRoadmaps && Array.isArray(data.followedRoadmaps) && data.followedRoadmaps.length > 0) {
                console.log('Displaying followed roadmaps');
                const emptyMessage = followedContainer.querySelector('.empty-message');
                if (emptyMessage) {
                    emptyMessage.style.display = 'none';
                }

                // مسح المحتوى السابق
                followedContainer.innerHTML = '';

                // إضافة كل رودماب
                data.followedRoadmaps.forEach(roadmap => {
                    console.log('Creating card for roadmap:', roadmap);
                    const card = createRoadmapCard(roadmap, false);
                    followedContainer.appendChild(card);
                });
            } else {
                console.log('No followed roadmaps found');
                const emptyMessage = followedContainer.querySelector('.empty-message');
                if (emptyMessage) {
                    emptyMessage.style.display = 'block';
                }
            }

            // عرض الرودماب المنشأة
            const createdContainer = document.getElementById('createdRoadmaps');
            console.log('Created Roadmaps data:', data.createdRoadmaps); // إضافة سجل للتحقق من البيانات

            if (data.createdRoadmaps && Array.isArray(data.createdRoadmaps) && data.createdRoadmaps.length > 0) {
                console.log('Displaying created roadmaps');
                const emptyMessage = createdContainer.querySelector('.empty-message');
                if (emptyMessage) {
                    emptyMessage.style.display = 'none';
                }

                // مسح المحتوى السابق
                createdContainer.innerHTML = '';

                // إضافة كل رودماب
                data.createdRoadmaps.forEach(roadmap => {
                    console.log('Creating card for roadmap:', roadmap);
                    const card = createRoadmapCard(roadmap, true);
                    createdContainer.appendChild(card);
                });
            } else {
                console.log('No created roadmaps found');
                const emptyMessage = createdContainer.querySelector('.empty-message');
                if (emptyMessage) {
                    emptyMessage.style.display = 'block';
                }
            }

            // إظهار العناصر بعد تحميل البيانات
            revealElements();
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

    // وظيفة لإنشاء بطاقة رودماب
    function createRoadmapCard(roadmap, isCreated) {
        console.log('Creating roadmap card with data:', roadmap); // إضافة سجل للتحقق من البيانات

        const card = document.createElement('div');
        card.className = 'roadmap-card';

        const title = document.createElement('h3');
        title.className = 'h3';
        title.textContent = roadmap.title || 'Untitled Roadmap';

        const category = document.createElement('p');
        category.className = 'roadmap-category';
        category.innerHTML = `<ion-icon name="pricetag-outline"></ion-icon> ${roadmap.category || 'Uncategorized'}`;

        card.appendChild(title);
        card.appendChild(category);

        if (isCreated) {
            const difficulty = document.createElement('div');
            difficulty.className = `badge ${(roadmap.difficultyLevel || 'beginner').toLowerCase()}`;

            let icon, color;
            switch ((roadmap.difficultyLevel || 'beginner').toLowerCase()) {
                case 'beginner':
                    icon = '<i class="fas fa-signal"></i>';
                    color = '#00a97f';
                    break;
                case 'intermediate':
                    icon = '<i class="fas fa-signal"></i>';
                    color = '#f59e0b';
                    break;
                case 'advanced':
                    icon = '<i class="fas fa-signal"></i>';
                    color = '#ef4444';
                    break;
                default:
                    icon = '<i class="fas fa-signal"></i>';
                    color = '#3b82f6';
            }

            difficulty.innerHTML = `${icon} ${roadmap.difficultyLevel || 'Beginner'}`;
            difficulty.style.color = color;
            card.appendChild(difficulty);

            const date = document.createElement('p');
            date.className = 'roadmap-date';
            date.innerHTML = `<ion-icon name="calendar-outline"></ion-icon> ${new Date(roadmap.createdAt || Date.now()).toLocaleDateString()}`;
            card.appendChild(date);
        }

        return card;
    }

    // وظيفة لإظهار العناصر المتحركة
    function revealElements() {
        const elements = document.querySelectorAll('[data-reveal]');
        elements.forEach(el => {
            el.classList.add('revealed');
        });
    }
});