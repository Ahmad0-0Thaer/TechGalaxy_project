const list = document.querySelector(".Roadmap-list");
const totalCount = document.getElementById("total-count");
const beginnerCount = document.getElementById("beginner-count");
const intermediateCount = document.getElementById("intermediate-count");
const advancedCount = document.getElementById("advanced-count");

function renderRoadmaps(roadmapsArray) {
  list.innerHTML = "";

  let beginner = 0, intermediate = 0, advanced = 0;

  roadmapsArray.forEach(r => {
    if (r.difficulty === "beginner") beginner++;
    else if (r.difficulty === "intermediate") intermediate++;
    else if (r.difficulty === "advanced") advanced++;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="Roadmap-card">
        <figure class="card-banner img-holder">
          <img src="${r.image}" alt="${r.title}" class="img-cover">
        </figure>
        <div class="card-content">
          <ul class="card-meta-list">
            <li class="card-meta-item">
              <ion-icon name="calendar-outline"></ion-icon>
              <time class="card-meta-text">${r.date}</time>
            </li>
            <li class="card-meta-item">
              <ion-icon name="person-outline"></ion-icon>
              <p class="card-meta-text">${r.author}</p>
            </li>
          </ul>
          <h3 class="h3"><a href="./roadmapUser.html" class="card-title">${r.title}</a></h3>
          <p class="card-text">${r.description}</p>
          <div class="card-footer">
            <a href="./roadmapUser.html" class="link has-before">Read More</a>
            <button class="like-btn"><ion-icon name="heart-outline"></ion-icon> <span class="like-count">${r.likes}</span></button>
          </div>
        </div>
      </div>`;
    list.appendChild(li);
  });

  totalCount.textContent = roadmapsArray.length;
  beginnerCount.textContent = beginner;
  intermediateCount.textContent = intermediate;
  advancedCount.textContent = advanced;
}

document.addEventListener("DOMContentLoaded", () => {
  renderRoadmaps(roadmaps);
});
