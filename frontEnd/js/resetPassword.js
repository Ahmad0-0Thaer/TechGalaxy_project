document.getElementById('resetPasswordForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');

  if (!token || !email) {
    alert('Invalid or missing email or token.');
    return;
  }

  const formData = new FormData(this);
  const newPassword = formData.get("newPassword")?.trim();
  const confirmPassword = formData.get("confirmPassword")?.trim();

  if (!newPassword || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }


  try {
    const response = await fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Account/ResetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token, newPassword })
    });

    let message;

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        message = errorData.message || 'Failed to reset password.';
      } else {
        message = await response.text();
      }
      alert("❌ " + message);
      return;
    }

    message = '✅ Your password has been reset successfully.';
    alert(message);
    window.location.href = "signUp.html";

  } catch (err) {
    console.error('Error:', err);
    alert("❌ An error occurred. Please try again later.");
  }
});