const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const expertFields = document.getElementById('expertFields');
const studentRadio = document.getElementById('student');
const expertRadio = document.getElementById('expert');
const certificateInput = document.getElementById('certificate');
const fileInfo = document.querySelector('.file-info');
const specialtySelect = document.getElementById('specialty');
const customSpecialtyInput = document.getElementById('customSpecialty');
const signUpForm = document.getElementById('signUpForm');
const signUpPasswordInput = document.getElementById('signUpPassword');
const userNameInput = document.getElementById('userNameInput');
const passwordHelp = document.getElementById('passwordHelp');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


signUpPasswordInput.addEventListener('input', () => {
	const password = signUpPasswordInput.value;

	if (passwordPattern.test(password)) {
		passwordHelp.textContent = "Strong password ✅";
		passwordHelp.classList.add("valid");
	} else {
		passwordHelp.textContent =
			"Password must contain:\n• Uppercase letter\n• Lowercase letter\n• Number\n• Special character\n• At least 8 characters";
		passwordHelp.classList.remove("valid");
	}
});

studentRadio.addEventListener('change', () => {
	expertFields.style.display = 'none';
	certificateInput.required = false;
});

expertRadio.addEventListener('change', () => {
	expertFields.style.display = 'block';
	certificateInput.required = true;
});

certificateInput.addEventListener('change', (e) => {
	const file = e.target.files[0];
	if (file) {
		const fileSize = (file.size / 1024 / 1024).toFixed(2);
		fileInfo.textContent = `Selected file: ${file.name} (${fileSize} MB)`;
	} else {
		fileInfo.textContent = '';
	}
});

const uploadArea = document.querySelector('.upload-area');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	uploadArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}
['dragenter', 'dragover'].forEach(eventName => {
	uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
});
['dragleave', 'drop'].forEach(eventName => {
	uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
});
uploadArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
	const dt = e.dataTransfer;
	const files = dt.files;
	certificateInput.files = files;
	const event = new Event('change');
	certificateInput.dispatchEvent(event);
}

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

specialtySelect.addEventListener('change', function () {
	if (this.value === 'other') {
		customSpecialtyInput.style.display = 'block';
		customSpecialtyInput.required = true;
	} else {
		customSpecialtyInput.style.display = 'none';
		customSpecialtyInput.required = false;
	}
});

signUpForm.addEventListener('submit', async function (e) {
	e.preventDefault();
	const userName = userNameInput.value;

	if (/\s/.test(userName)) {
		alert("Name must not contain spaces.");
		userNameInput.focus();
		return;
	}

	const userType = document.querySelector('input[name="Role"]:checked').value;
	const formData = new FormData(this);
	formData.set('Role', userType);

	const password = document.getElementById("signUpPassword").value;

	if (!passwordPattern.test(password)) {
		passwordHelp.scrollIntoView({ behavior: 'smooth' });
		return;
	}

	if (userType === 'Expert') {
		const specialty = specialtySelect.value;
		const certFile = certificateInput.files[0];

		if (!specialty) {
			alert("Please select your specialty.");
			return;
		}

		if (specialty === 'other') {
			const customValue = customSpecialtyInput.value.trim();
			if (!customValue) {
				alert("Please enter your custom specialty.");
				return;
			}
			formData.set("Specialty", customValue);
		}

		if (!certFile) {
			alert("Please upload your certificate.");
			return;
		}
		formData.set("CertificateFile", certFile);
	}

	try {
		const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/Register', {
			method: 'POST',
			body: formData
		});

		const contentType = response.headers.get('content-type');
		let data;

		if (!response.ok) {
			let errorMessage = 'Registration failed';

			if (contentType && contentType.includes('application/json')) {
				const errorData = await response.json();
				errorMessage += ': ' + (errorData.message || JSON.stringify(errorData));
			} else {
				const errorText = await response.text();
				errorMessage += ': ' + errorText;
			}

			console.error(errorMessage);
			alert(errorMessage);
			return;
		}

		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			const text = await response.text();
			data = { message: text };
		}

		console.log('Registration success:', data);

		alert('Registration successful! You can now log in.');
		container.classList.remove("right-panel-active");
		signUpForm.reset();

		if (data.requiresApproval) {
			return;
		}

		const userNameStored = formData.get("userName");
		localStorage.setItem("userName", userNameStored);

	} catch (err) {
		console.error('Network or server error:', err);
		alert('An error occurred. Please try again later.');
	}
});

const signInForm = document.getElementById('signInForm');

signInForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const formData = new FormData(signInForm);
	const email = formData.get("email");
	const password = formData.get("password");

	// ✅ تحقق من الأدمن أولاً
	if (email === "admin@techgalaxy" && password === "Admin123!") {
		window.location.href = "adminHome.html";
	}

	try {
		const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/Login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			alert('Login failed: ' + errorText);
			return;
		}

		const data = await response.json();
		console.log("Login success:", data);
		localStorage.setItem("token", data.token); //⬅ مهم جدًا


		if (data.role === "Expert") {
			window.location.href = "expertHome.html";
		} else if (data.role === "Learner") {
			window.location.href = "userHome.html";
		} else {
			alert("Unknown user type.");
		}


		localStorage.setItem("userName", data.userName || data.name || "");

	} catch (err) {
		console.error('Login error:', err);
		alert("An error occurred. Please try again.");
	}
});