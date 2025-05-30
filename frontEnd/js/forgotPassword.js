// forgotPassword.js
document.getElementById('forgotPasswordForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const email = formData.get("email");

  try {
    const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/ForgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const contentType = response.headers.get('content-type');
    let message = 'If your email exists, a reset link has been sent.';

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        message = errorData.message || 'Failed to send reset email.';
      } else {
        message = await response.text();
      }
    }

    alert(message);
    window.location.href = "signUp.html";

  } catch (err) {
    console.error('Error:', err);
    alert("An error occurred. Please try again later.");
  }
});
