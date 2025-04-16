// ================================
// Modal Elements & Setup
// ================================
const modal = document.getElementById("customModal");
const modalMsg = document.getElementById("modalMessage");
const modalActions = document.getElementById("modalActions");
const closeModalBtn = document.getElementById("closeModalBtn");
const clickSound = document.getElementById("clickSound");

// ================================
// Custom Modal Function
// ================================
function showModal(message, onConfirm = null) {
  if (!modal || !modalMsg || !modalActions || !closeModalBtn) return;

  modalMsg.textContent = message;
  modal.style.display = "flex";
  modalActions.innerHTML = "";

  if (onConfirm) {
    // ✅ Yes Button
    const yesBtn = document.createElement("button");
    yesBtn.innerHTML = "✅ Yes";
    yesBtn.className = "modal-confirm";
    yesBtn.onclick = () => {
      modal.style.display = "none";
      clickSound?.play();
      onConfirm();
    };

    // ❌ Cancel Button
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "❌ Cancel";
    cancelBtn.className = "modal-cancel";
    cancelBtn.onclick = () => {
      modal.style.display = "none";
    };

    modalActions.appendChild(yesBtn);
    modalActions.appendChild(cancelBtn);
    closeModalBtn.style.display = "none";
  } else {
    closeModalBtn.style.display = "inline-block";
  }
}

// ================================
// Modal Event: Manual Close
// ================================
closeModalBtn?.addEventListener("click", () => {
  modal.style.display = "none";
});

// Escape key closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") {
    modal.style.display = "none";
  }
});

// ================================
// Profile Image Upload Preview
// ================================
document.getElementById("profilePhoto")?.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("profilePreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ================================
// Profile Form Submission
// ================================
document.getElementById("profileForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  if (newPass || confirmPass) {
    if (newPass !== confirmPass) {
      showModal("❗ Passwords do not match!");
      return;
    }
    showModal("✅ Password updated successfully!");
  } else {
    showModal("✅ Profile updated successfully!");
  }
});

// ================================
// Logout With Confirmation
// ================================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  showModal("Are you sure you want to logout?", () => {
    window.location.href = "index.html";
  });
});

// ================================
// Zoom Page to 80% (Desktop Only)
// ================================
window.addEventListener("DOMContentLoaded", () => {
  document.body.style.zoom = "80%";

  // Optional fallback for browsers not supporting zoom
  if (!("zoom" in document.body.style)) {
    document.body.style.transform = "scale(0.8)";
    document.body.style.transformOrigin = "top left";
    document.body.style.width = "125%";
  }
});

// Phone number with country code selection
let dropdownButton = document.getElementById("selected-country");
let countryCodeInput = document.getElementById("country_code");
let searchInput = document.getElementById("search-country");
let countryItems = document.querySelectorAll(".dropdown-item");

if (dropdownButton && countryCodeInput) {
    countryItems.forEach(item => {
        item.addEventListener("click", function () {
            let selectedCode = this.getAttribute("data-code");
            let selectedFlag = this.getAttribute("data-flag");
            dropdownButton.innerHTML = `<img src="https://flagcdn.com/w40/${selectedFlag}.png" class="flag-icon"> ${selectedCode}`;
            countryCodeInput.value = selectedCode;

            // Hide dropdown after selection
            document.querySelector(".dropdown-content").style.display = "none";
        });
    });
}

if (searchInput) {
    searchInput.addEventListener("input", function () {
        let searchValue = searchInput.value.toLowerCase();
        
        countryItems.forEach(item => {
            let countryText = item.textContent.toLowerCase();
            item.style.display = countryText.includes(searchValue) ? "block" : "none";
        });

        // Reset visibility if search field is empty
        if (searchValue === "") {
            countryItems.forEach(item => item.style.display = "block");
        }
    });

    // Ensure dropdown is visible when search input is focused
    searchInput.addEventListener("focus", function () {
        document.querySelector(".dropdown-content").style.display = "block";
    });
}

// Hide dropdown when clicking outside
document.addEventListener("click", function (event) {
    if (!event.target.closest(".custom-dropdown")) {
        document.querySelector(".dropdown-content").style.display = "none";
    }
});

    // Set zoom to 80% on page load
    window.addEventListener("DOMContentLoaded", () => {
        document.body.style.zoom = "90%";
      });
  