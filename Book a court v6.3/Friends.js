/************************************************************
 * FRIENDS PAGE LOGIC
 * - Search & Reset Buttons
 * - Filtering by Player ID, Name, Location
 * - Pagination (rowCount dropdown, prev/next page)
 * - Toggling Add/Remove friend status with custom modal
 ************************************************************/
document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // 0. Modal Setup
    // -----------------------------
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
  
    // -----------------------------
    // 1. Sample in-memory data
    // -----------------------------
    const friendsData = [
      { playerId: 101, playerName: "Serena Williams", location: "NY, USA", isFriend: false },
      { playerId: 102, playerName: "Roger Federer", location: "Basel, Switzerland", isFriend: true },
      { playerId: 103, playerName: "Rafael Nadal", location: "Mallorca, Spain", isFriend: false },
      { playerId: 104, playerName: "Novak Djokovic", location: "Belgrade, Serbia", isFriend: false },
      { playerId: 105, playerName: "Andy Murray", location: "Dunblane, Scotland", isFriend: true }
    ];
  
    // -----------------------------
    // 2. State variables
    // -----------------------------
    let currentPage = 1;
    let rowsPerPage = 5;
    let filteredFriends = [...friendsData];
  
    // -----------------------------
    // 3. Initialization
    // -----------------------------
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
  
    // -----------------------------
    // 4. Search & Reset
    // -----------------------------
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
  
    // -----------------------------
    // 5. Pagination
    // -----------------------------
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
  
    // -----------------------------
    // 6. Pagination Buttons
    // -----------------------------
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
  
    // -----------------------------
    // 7. Add/Remove Friend
    // -----------------------------
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
    // Set zoom to 80% on page load
    window.addEventListener("DOMContentLoaded", () => {
        document.body.style.zoom = "80%";
      });

    // -----------------------------
    // 8. Initialize Page
    // -----------------------------
    initFriendsPage();
  });
  