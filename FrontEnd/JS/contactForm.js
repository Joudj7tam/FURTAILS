document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const notification = document.getElementById("notification");
  
    const showNotification = (message, isError = false) => {
      notification.textContent = message;
      notification.className = isError ? "show error" : "show";
      setTimeout(() => {
        notification.className = "hidden";
      }, 4000); // Auto hide after 4 seconds
    };
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
      const plainData = Object.fromEntries(formData.entries());
  
      try {
        const response = await fetch("http://localhost:5000/api/contact/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plainData),
        });
  
        const result = await response.json();
        if (result.success) {
          showNotification("Message sent successfully!");
          form.reset();
        } else {
          showNotification("Error: " + result.message, true);
        }
      } catch (error) {
        showNotification("Something went wrong. Try again.", true);
        console.error(error);
      }
    });
  });
  