document.addEventListener("DOMContentLoaded", () => {
    // Simulating user data (retrieved from session or backend)
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const name = urlParams.get("name");
  
    const authSection = document.getElementById("auth-section");
  
    if (email && name) {
      // Display user name if logged in
      authSection.innerHTML = `
        <span class="text-sm font-medium text-gray-800">Welcome, ${name}!</span>
        <button
          class="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-700"
          onclick="logout()"
        >
          Logout
        </button>
      `;
  
      // Add parameters to menu links
      document.querySelectorAll("a").forEach((link) => {
        if (link.href && link.href.includes("/")) {
          const url = new URL(link.href, window.location.origin);
          url.searchParams.set("email", email);
          url.searchParams.set("name", name);
          link.href = url.href;
        }
      });
    } else {
      // Default Login button
      authSection.innerHTML = `
        <button
          class="px-4 py-2 text-sm font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-700"
        >
          <a href="/login">Login</a>
        </button>
      `;
    }
  });
  
  // Logout function
  function logout() {
    window.location.href = "/";
  }
  