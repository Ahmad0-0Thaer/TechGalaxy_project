document.addEventListener('DOMContentLoaded', function () {
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
            if (data.followedRoadmap && data.followedRoadmap.length > 0) {
                followedContainer.querySelector('.empty-message').style.display = 'none';
                data.followedRoadmap.forEach(roadmap => {
                    followedContainer.appendChild(createRoadmapCard(roadmap, true));
                });
            }

            // عرض الرودماب المنشأة
            const createdContainer = document.getElementById('createdRoadmaps');
            if (data.createdRoadmaps && data.createdRoadmaps.length > 0) {
                createdContainer.querySelector('.empty-message').style.display = 'none';
                data.createdRoadmaps.forEach(roadmap => {
                    createdContainer.appendChild(createRoadmapCard(roadmap, true));
                });
            }

            // إظهار العناصر بعد تحميل البيانات
            revealElements();
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

    // وظيفة لإنشاء بطاقة رودماب
    function createRoadmapCard(roadmap, isCreated) {
        const card = document.createElement('div');
        card.className = 'roadmap-card';

        const title = document.createElement('h3');
        title.className = 'h3';
        title.textContent = roadmap.title;

        const category = document.createElement('p');
        category.className = 'roadmap-category';
        category.innerHTML = `<ion-icon name="pricetag-outline"></ion-icon> ${roadmap.category}`;

        card.appendChild(title);
        card.appendChild(category);

        if (isCreated) {
            const difficulty = document.createElement('div');
            difficulty.className = `badge ${roadmap.difficultyLevel.toLowerCase()}`;

            let icon, color;
            switch (roadmap.difficultyLevel.toLowerCase()) {
                case 'beginner':
                    icon = '📗';
                    color = '#00a97f';
                    break;
                case 'intermediate':
                    icon = '📙';
                    color = '#f59e0b';
                    break;
                case 'advanced':
                    icon = '📕';
                    color = '#ef4444';
                    break;
                default:
                    icon = '📘';
                    color = '#3b82f6';
            }

            difficulty.innerHTML = `${icon} ${roadmap.difficultyLevel}`;
            difficulty.style.color = color;
            card.appendChild(difficulty);

            const date = document.createElement('p');
            date.className = 'roadmap-date';
            date.innerHTML = `<ion-icon name="calendar-outline"></ion-icon> ${new Date(roadmap.createdAt).toLocaleDateString()}`;
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