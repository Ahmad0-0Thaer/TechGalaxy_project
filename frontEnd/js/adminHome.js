document.addEventListener("DOMContentLoaded", fetchExperts);

async function fetchExperts() {
	const container = document.getElementById("expertListContainer");

	try {
		const response = await fetch("https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/PendingExpertVerifications")
		if (!response.ok) throw new Error("Failed to load experts.");

		const experts = await response.json();

		if (experts.length === 0) {
			container.innerHTML = "<p>No pending experts found.</p>";
			return;
		}

		const expertsWrapper = document.createElement('div');
		expertsWrapper.className = 'experts-container';

		experts.forEach(expert => {
			const card = document.createElement('div');
			card.className = 'expert-card';
			card.innerHTML = `
				<h3>${expert.userName}</h3>
				<p><strong>Email:</strong> ${expert.email}</p>
				<p><strong>Specialty:</strong> ${expert.specialty}</p>
				<p><strong>Certificate:</strong> <a href="${expert.certificateUrl}" target="_blank">View Certificate</a></p>
				<div class="button-group">
					<button class="approve-btn">Approve</button>
					<button class="reject-btn">Reject</button>
				</div>
			`;

			card.querySelector(".approve-btn").addEventListener("click", () => handleDecision(expert.requestId, true, card));
			card.querySelector(".reject-btn").addEventListener("click", () => handleDecision(expert.requestId, false, card));
			

			expertsWrapper.appendChild(card);
		});
		
		// نضيف كل الكروت داخل الـ container الرئيسي
		container.innerHTML = ""; // تفريغ المحتوى الحالي
		container.appendChild(expertsWrapper);

	} catch (err) {
		console.error(err);
		container.innerHTML = `<p style="color:red;">Error loading expert data.</p>`;
	}
}

async function handleDecision(expertId, isApproved, cardElement) {
	try {
		const endpoint = "https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/ReviewExpert";
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			
			body: JSON.stringify({ Id: expertId, Approve: isApproved })
		});

		if (!response.ok) throw new Error("Review failed");

		const result = await response.json();
		console.log("API response:", result);

		alert(result.message || (isApproved ? "Approved" : "Rejected"));
		cardElement.remove();
	} catch (err) {
		console.error(err);
		alert("An error occurred while processing your request.");
	}
}

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
  window.location.href = "home.html";
});