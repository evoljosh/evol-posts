// app.js
// Connects the frontend to the backend API using Fetch
// Handles: signup, login, logout, creating posts, viewing posts, deleting posts

// ===== CHANGE THIS to your deployed backend URL when you deploy =====
const API_URL = "http://localhost:5000/api";

// ===== STATE =====
// We store the JWT token + username in localStorage so the user stays logged in
let token = localStorage.getItem("token");
let username = localStorage.getItem("username");

// ===== DOM ELEMENTS =====
const authSection = document.getElementById("auth-section");
const createPostCard = document.getElementById("create-post-card");
const navAuthArea = document.getElementById("nav-auth-area");
const postsList = document.getElementById("posts-list");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const createPostForm = document.getElementById("create-post-form");

const tabButtons = document.querySelectorAll(".tab-btn");

// ===== TAB SWITCHING (Login / Sign Up) =====
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.tab === "login") {
      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
    } else {
      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  });
});

// ===== UPDATE UI BASED ON LOGIN STATE =====
function updateAuthUI() {
  if (token && username) {
    // Logged in: hide auth forms, show create-post form, show logout button
    authSection.classList.add("hidden");
    createPostCard.classList.remove("hidden");
    navAuthArea.innerHTML = `
      <span>Hi, ${username}</span>
      <button id="logout-btn">Log Out</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    // Logged out: show auth forms, hide create-post form
    authSection.classList.remove("hidden");
    createPostCard.classList.add("hidden");
    navAuthArea.innerHTML = `<span>Not logged in</span>`;
  }
}

// ===== SIGNUP =====
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("signup-message");
  const usernameVal = document.getElementById("signup-username").value;
  const passwordVal = document.getElementById("signup-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameVal, password: passwordVal }),
    });

    const data = await res.json();

    if (!res.ok) {
      msgEl.textContent = data.message;
      msgEl.className = "form-message error";
      return;
    }

    msgEl.textContent = "Account created! You can log in now.";
    msgEl.className = "form-message success";
    signupForm.reset();
  } catch (error) {
    msgEl.textContent = "Could not connect to server.";
    msgEl.className = "form-message error";
  }
});

// ===== LOGIN =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("login-message");
  const usernameVal = document.getElementById("login-username").value;
  const passwordVal = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameVal, password: passwordVal }),
    });

    const data = await res.json();

    if (!res.ok) {
      msgEl.textContent = data.message;
      msgEl.className = "form-message error";
      return;
    }

    // Save token + username so the user stays logged in after refresh
    token = data.token;
    username = data.user.username;
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    loginForm.reset();
    updateAuthUI();
  } catch (error) {
    msgEl.textContent = "Could not connect to server.";
    msgEl.className = "form-message error";
  }
});

// ===== LOGOUT =====
function logout() {
  token = null;
  username = null;
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  updateAuthUI();
}

// ===== CREATE POST =====
createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // send the token so backend knows who's posting
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    createPostForm.reset();
    loadPosts(); // refresh the posts list
  } catch (error) {
    alert("Could not connect to server.");
  }
});

// ===== LOAD ALL POSTS =====
async function loadPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();

    if (posts.length === 0) {
      postsList.innerHTML = `<p class="empty-state">No posts yet. Be the first to post!</p>`;
      return;
    }

    postsList.innerHTML = posts
      .map((post) => {
        // Only show delete button if the logged-in user owns this post
        const isOwner = username === post.authorName;
        const deleteBtn = isOwner
          ? `<button onclick="deletePost('${post._id}')">Delete</button>`
          : "";

        return `
          <div class="post-card">
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-content">${escapeHtml(post.content)}</p>
            <div class="post-meta">
              <span>By ${escapeHtml(post.authorName)}</span>
              <div class="post-actions">${deleteBtn}</div>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    postsList.innerHTML = `<p class="empty-state">Could not load posts. Is the server running?</p>`;
  }
}

// ===== DELETE POST =====
async function deletePost(postId) {
  if (!confirm("Delete this post?")) return;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    loadPosts();
  } catch (error) {
    alert("Could not connect to server.");
  }
}

// Basic protection against XSS when displaying user-generated content
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===== INITIAL LOAD =====
updateAuthUI();
loadPosts();
