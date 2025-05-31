const container = document.querySelector(".roadmap-container");

fetch("https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps") // عدّل الرابط حسب الـ API عندك
  .then(res => res.json())
  .then(data => {
    data.forEach(roadmap => {
      const card = document.createElement("div");
      card.className = "roadmap-card";

      card.innerHTML = `
        <img src="${roadmap.coverImageUrl}" alt="${roadmap.title}">
        <div class="content">
          <h3>${roadmap.title}</h3>
          <p>${roadmap.description}</p>
          <div class="roadmap-meta">
            <span>📅 ${roadmap.createdAt}</span>
            <span>⭐ ${roadmap.likesCount} Likes</span>
            <span>👤 ${roadmap.expertName}</span>
            <span>🎯 ${roadmap.difficultyLevel}</span>
            <span>🏷️ ${roadmap.category}</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Error fetching roadmaps:", err);
    container.innerHTML = "<p>فشل تحميل الـ Roadmaps، حاول لاحقًا.</p>";
  });
