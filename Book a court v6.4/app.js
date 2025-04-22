/************************************************************
 * Combined Script: Book a Court + Friends + History Matches + Matchmaking
 ************************************************************/

/* Book a Court Logic */
(function bookCourtModule() {
  document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector("form");

    const modal = document.getElementById("customModal");
    const modalMsg = document.getElementById("modalMessage");
    const closeModalBtn = document.getElementById("closeModalBtn");

    const showModal = (message) => {
      if (modal && modalMsg) {
        modalMsg.textContent = message;
        modal.style.display = "flex";
      }
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name")?.value.trim();
        let email = document.getElementById("email")?.value.trim();
        let phone = document.getElementById("phone_number")?.value.trim();
        let matchDate = document.getElementById("match_date")?.value;
        let matchTime = document.getElementById("match_time")?.value;
        let location = document.getElementById("location")?.value;

        if (!name || !email || !phone || !matchDate || !matchTime || !location) {
          showModal("⚠️ Please fill out all fields before submitting.");
          return;
        }

        if (!validateEmail(email)) {
          showModal("⚠️ Invalid email format. Please enter a valid email.");
          return;
        }

        if (!validatePhone(phone)) {
          showModal("⚠️ Invalid phone number. Please enter only numbers.");
          return;
        }

        showModal("✅ Court booked successfully!");
        form.reset();
      });
    }

    function validateEmail(email) {
      let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validatePhone(phone) {
      let re = /^[0-9]{8,15}$/;
      return re.test(phone);
    }

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

        if (searchValue === "") {
          countryItems.forEach(item => item.style.display = "block");
        }
      });

      searchInput.addEventListener("focus", function () {
        document.querySelector(".dropdown-content").style.display = "block";
      });
    }

    document.addEventListener("click", function (event) {
      const isClickInside = event.target.closest(".custom-dropdown");
      if (!isClickInside) {
        document.querySelectorAll(".dropdown-content").forEach(d => d.style.display = "none");
      }
    });
    
  });
})();

/* Friends Page Logic */
(function friendsModule() {
  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("customModal");
    const modalMsg = document.getElementById("modalMessage");
    const closeModalBtn = document.getElementById("closeModalBtn");

    const showModal = (message) => {
      if (modal && modalMsg) {
        modalMsg.textContent = message;
        modal.style.display = "flex";
      }
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    const friendsData = [
      { playerId: 101, playerName: "Serena Williams", location: "NY, USA", isFriend: false },
      { playerId: 102, playerName: "Roger Federer", location: "Basel, Switzerland", isFriend: true },
      { playerId: 103, playerName: "Rafael Nadal", location: "Mallorca, Spain", isFriend: false },
      { playerId: 104, playerName: "Novak Djokovic", location: "Belgrade, Serbia", isFriend: false },
      { playerId: 105, playerName: "Andy Murray", location: "Dunblane, Scotland", isFriend: true }
    ];

    let currentPage = 1;
    let rowsPerPage = 5;
    let filteredFriends = [...friendsData];

    const initFriendsPage = () => {
      const searchBtn = document.getElementById("searchFriendsBtn");
      const resetBtn = document.getElementById("resetFiltersBtn");
      const rowCountSelect = document.getElementById("rowCount");
      const friendsBody = document.getElementById("friendsTableBody");
      const pageInfo = document.getElementById("pageInfo");

      if (!searchBtn || !resetBtn || !rowCountSelect || !friendsBody || !pageInfo) return;

      searchBtn.addEventListener("click", searchForFriends);
      resetBtn.addEventListener("click", resetFilters);
      rowCountSelect.addEventListener("change", handleRowCountChange);

      updateFriendsTable();
    };

    const searchForFriends = () => {
      const idInput = document.getElementById("filterId")?.value.trim();
      const nameInput = document.getElementById("filterName")?.value.toLowerCase().trim();
      const locationInput = document.getElementById("filterLocation")?.value.toLowerCase().trim();

      filteredFriends = friendsData.filter(friend => {
        const matchId = !idInput || friend.playerId.toString() === idInput;
        const matchName = !nameInput || friend.playerName.toLowerCase().includes(nameInput);
        const matchLocation = !locationInput || friend.location.toLowerCase().includes(locationInput);
        return matchId && matchName && matchLocation;
      });

      currentPage = 1;
      updateFriendsTable();
    };

    const resetFilters = () => {
      document.getElementById("filterId").value = "";
      document.getElementById("filterName").value = "";
      document.getElementById("filterLocation").value = "";

      filteredFriends = [...friendsData];
      currentPage = 1;
      updateFriendsTable();
    };

    const handleRowCountChange = () => {
      const val = document.getElementById("rowCount").value;
      rowsPerPage = val === "all" ? filteredFriends.length : parseInt(val, 10);
      currentPage = 1;
      updateFriendsTable();
    };

    const updateFriendsTable = () => {
      const tableBody = document.getElementById("friendsTableBody");
      const pageInfo = document.getElementById("pageInfo");

      tableBody.innerHTML = "";

      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const pageData = filteredFriends.slice(startIndex, endIndex);

      pageData.forEach(friend => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = friend.playerId;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = friend.playerName;
        row.appendChild(nameCell);

        const locCell = document.createElement("td");
        locCell.textContent = friend.location;
        row.appendChild(locCell);

        const actionCell = document.createElement("td");
        const actionBtn = document.createElement("button");

        if (friend.isFriend) {
          actionBtn.textContent = "Remove";
          actionBtn.addEventListener("click", () => removeFriend(friend.playerId));
        } else {
          actionBtn.textContent = "Add";
          actionBtn.addEventListener("click", () => addFriend(friend.playerId));
        }

        actionCell.appendChild(actionBtn);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });

      pageInfo.textContent = `Page ${currentPage}`;
    };

    window.prevPage = () => {
      if (currentPage > 1) {
        currentPage--;
        updateFriendsTable();
      }
    };

    window.nextPage = () => {
      const totalPages = Math.ceil(filteredFriends.length / rowsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateFriendsTable();
      }
    };

    const addFriend = (playerId) => {
      const friend = friendsData.find(f => f.playerId === playerId);
      if (!friend || friend.isFriend) return;
      friend.isFriend = true;
      showModal("Friend request is sent!");
      searchForFriends();
    };

    const removeFriend = (playerId) => {
      const friend = friendsData.find(f => f.playerId === playerId);
      if (!friend || !friend.isFriend) return;
      friend.isFriend = false;
      showModal("Removed from your friend list!");
      searchForFriends();
    };

    window.addEventListener("DOMContentLoaded", () => {
      document.body.style.zoom = "80%";
    });

    initFriendsPage();
  });
})();

/* History Matches Page Logic */
(function historyMatchesModule() {
  document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    let rowsPerPage = 5;

    function search() {
      const dateFilter = document.getElementById("dateFilter").value;
      const playerFilter = document.getElementById("playerFilter").value.toLowerCase();
      const winnerFilter = document.getElementById("winnerFilter").value.toLowerCase();
      const courtFilter = document.getElementById("CourtFilter").value.toLowerCase();

      document.querySelectorAll("table tbody tr").forEach(row => {
        const date = row.cells[0].textContent;
        const player1 = row.cells[2].textContent.toLowerCase();
        const player2 = row.cells[3].textContent.toLowerCase();
        const winner = row.cells[5].textContent.toLowerCase();
        const court = row.cells[6].textContent.toLowerCase();

        const showRow = (!dateFilter || date.includes(dateFilter)) &&
                        (!playerFilter || player1.includes(playerFilter) || player2.includes(playerFilter)) &&
                        (!winnerFilter || winner.includes(winnerFilter)) &&
                        (!courtFilter || court.includes(courtFilter));

        row.style.display = showRow ? "" : "none";
      });

      updateTable();
    }

    function reset() {
      document.getElementById("dateFilter").value = "";
      document.getElementById("playerFilter").value = "";
      document.getElementById("winnerFilter").value = "";
      document.getElementById("CourtFilter").value = "";

      document.querySelectorAll("table tbody tr").forEach(row => row.style.display = "");
      updateTable();
    }

    function updateTable() {
      const val = document.getElementById("rowCount").value;
      rowsPerPage = val === "all" ? Infinity : parseInt(val, 10);
      const rows = Array.from(document.querySelectorAll("table tbody tr")).filter(row => row.style.display !== "none");

      rows.forEach((row, index) => {
        row.style.display = (index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage) ? "" : "none";
      });

      document.getElementById("pageInfo").textContent = `Page ${currentPage}`;
    }

    window.prevPage = function () {
      if (currentPage > 1) {
        currentPage--;
        updateTable();
      }
    };

    window.nextPage = function () {
      const rows = Array.from(document.querySelectorAll("table tbody tr")).filter(row => row.style.display !== "none");
      const totalPages = Math.ceil(rows.length / rowsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateTable();
      }
    };

    document.querySelector("button[onclick='search()']")?.addEventListener("click", search);
    document.querySelector("button[onclick='reset()']")?.addEventListener("click", reset);
    document.getElementById("rowCount")?.addEventListener("change", () => {
      currentPage = 1;
      updateTable();
    });

    updateTable();
  });
})();

/* Matchmaking Page Logic */
(function matchmakingModule() {
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("customModal");
    const modalMsg = document.getElementById("modalMessage");
    const closeModalBtn = document.getElementById("closeModalBtn");

    function showModal(message) {
      modalMsg.textContent = message;
      modal.style.display = "flex";
    }

    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.filterTable = function () {
      let idFilter = document.getElementById("filterId").value;
      let nameFilter = document.getElementById("filterName").value.toLowerCase();
      let genderFilter = document.getElementById("filterGender").value;
      let strengthFilter = document.getElementById("filterStrength").value;

      document.querySelectorAll("table tbody tr").forEach(row => {
        let id = row.cells[1].textContent;
        let name = row.cells[2].textContent.toLowerCase();
        let gender = row.cells[7].textContent;
        let strength = row.cells[3].textContent;

        let showRow = (!idFilter || id.includes(idFilter)) &&
                      (!nameFilter || name.includes(nameFilter)) &&
                      (!genderFilter || gender === genderFilter) &&
                      (!strengthFilter || strength === strengthFilter);

        row.style.display = showRow ? "" : "none";
      });
    };

    window.resetFilters = function () {
      document.getElementById("filterId").value = "";
      document.getElementById("filterName").value = "";
      document.getElementById("filterGender").value = "";
      document.getElementById("filterStrength").value = "";
      document.querySelectorAll("table tbody tr").forEach(row => row.style.display = "");
      document.querySelectorAll("input[name='playerSelection']").forEach(r => r.checked = false);
    };

    window.ChooseRandom = function () {
      let rows = Array.from(document.querySelectorAll("table tbody tr")).filter(row => row.style.display !== "none");
      if (rows.length === 0) {
        showModal("⚠️ No players available to select.");
        return;
      }
      let randomRow = rows[Math.floor(Math.random() * rows.length)];
      let radio = randomRow.querySelector("input[type='radio']");
      if (radio) {
        radio.checked = true;
        showModal("✅ Random player selected!");
      }
    };

    window.ChooseSelected = function () {
      let selected = document.querySelector("input[name='playerSelection']:checked");
      if (!selected) {
        showModal("⚠️ Please select a player first.");
        return;
      }
      const row = selected.closest("tr");
      const availability = row.cells[8].textContent.trim().toLowerCase();
      if (["no", "not available", "unavailable"].includes(availability)) {
        showModal("❌ This player is not available. Please select another.");
        selected.checked = false;
      } else {
        showModal("✅ Player Selected!");
      }
    };

    let currentPage = 1;
    let rowsPerPage = 5;

    function updateTable() {
      let rows = Array.from(document.querySelectorAll("table tbody tr"));
      rows.forEach(row => row.style.display = "none");

      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      let visibleRows = rows.filter(r => !r.classList.contains("filtered-out"));
      visibleRows.slice(start, end).forEach(row => row.style.display = "");

      document.getElementById("pageInfo").textContent = `Page ${currentPage}`;
    }

    window.updateTable = function () {
      const value = document.getElementById("rowCount").value;
      rowsPerPage = value === "all" ? Infinity : parseInt(value);
      currentPage = 1;
      updateTable();
    };

    window.nextPage = function () {
      const rows = Array.from(document.querySelectorAll("table tbody tr")).filter(r => r.style.display !== "none");
      const maxPage = Math.ceil(rows.length / rowsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        updateTable();
      }
    };

    window.prevPage = function () {
      if (currentPage > 1) {
        currentPage--;
        updateTable();
      }
    };

    updateTable();
  });
})();



/* Profile Page Logic */
(function profileModule() {
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
// Zoom Page & Fallback (Merged)
// ================================
window.addEventListener("DOMContentLoaded", () => {
  document.body.style.zoom = "90%";

  // Optional fallback for older browsers
  if (!("zoom" in document.body.style)) {
    document.body.style.transform = "scale(0.9)";
    document.body.style.transformOrigin = "top left";
    document.body.style.width = "111.11%";
  }
});

// ================================
// Phone number with country code selection
// ================================
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

// ================================
// Dropdown Toggle (Reusable Function) + Outside Click
// ================================
window.toggleDropdown = function(button) {
  const dropdown = button.nextElementSibling;
  const isVisible = dropdown.style.display === "block";
  document.querySelectorAll(".dropdown-content").forEach(d => d.style.display = "none");
  dropdown.style.display = isVisible ? "none" : "block";
}

document.addEventListener("click", function (event) {
  const isClickInside = event.target.closest(".custom-dropdown");
  if (!isClickInside) {
    document.querySelectorAll(".dropdown-content").forEach(d => d.style.display = "none");
  }
});




})();
