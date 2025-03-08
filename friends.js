// Mock data: simulate a list of friends (and potential friends) as JSON
const friendsData = [
    { id: 1, name: "Lemich", isFriend: true },
    { id: 2, name: "Nayef",    isFriend: true },
    { id: 3, name: "Hassan",  isFriend: false },
    { id: 4, name: "Hamad",  isFriend: true },
    { id: 5, name: "Sam",  isFriend: false }
    // Additional friend objects can be added here
  ];
  
  // Get references to DOM elements
  const friendsListEl = document.getElementById("friendsList");
  const searchInputEl = document.getElementById("searchInput");
  
  /**
   * Render the friends list to the page.
   * @param {Array} list - Array of friend objects to display.
   */
  function renderFriendsList(list) {
    // Clear any existing list items
    friendsListEl.innerHTML = "";
  
    // Iterate over each friend in the provided list
    list.forEach(friend => {
      // Create a list item element for the friend
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
  
      // Create the name link element
      const nameLink = document.createElement("a");
      nameLink.href = "#";  // Placeholder URL for friend's profile
      nameLink.textContent = friend.name;
      nameLink.className = "friend-name";
      // (In a real app, href might be something like `/profile.html?user=${friend.id}`)
  
      // Append the name link to the list item
      li.appendChild(nameLink);
  
      // If this person is not yet a friend, add an "Add Friend" button
      if (!friend.isFriend) {
        const addButton = document.createElement("button");
        addButton.textContent = "Add Friend";
        addButton.className = "btn btn-primary btn-sm add-friend-btn";
        addButton.setAttribute("data-id", friend.id);  // store friend ID for reference
        // Append the button to the list item (right side, thanks to flex classes)
        li.appendChild(addButton);
      } else {
        // If already a friend, optionally show a badge instead of a button
        const badge = document.createElement("span");
        badge.textContent = "Friend";
        badge.className = "badge bg-success rounded-pill";
        li.appendChild(badge);
      }
  
      // Append the completed list item to the friends list container
      friendsListEl.appendChild(li);
    });
  }
  
  /**
   * Filter and render friends based on the search query.
   */
  function handleSearch() {
    const query = searchInputEl.value.trim().toLowerCase();
    if (query === "") {
      // If search box is empty, show the full friends list
      renderFriendsList(friendsData);
    } else {
      // Filter friendsData to those whose name includes the query substring (case-insensitive)
      const filteredList = friendsData.filter(friend => 
        friend.name.toLowerCase().includes(query)
      );
      renderFriendsList(filteredList);
    }
  }
  
  // Attach the search handler to the input's 'input' event for real-time filtering
  searchInputEl.addEventListener("input", handleSearch);
  
  /**
   * Handle click events on the "Add Friend" buttons using event delegation.
   * This listens for any click on a button with the class 'add-friend-btn' inside the friends list.
   */
  friendsListEl.addEventListener("click", (event) => {
    if (event.target.matches("button.add-friend-btn")) {
      const button = event.target;
      const friendId = button.getAttribute("data-id");
      // Find the friend object by ID
      const friend = friendsData.find(f => f.id === Number(friendId));
      if (friend) {
        // Simulate sending a friend request (e.g., call an API in real app)
        alert(`Friend request sent to ${friend.name}!`);
        console.log(`Friend request sent to ${friend.name} (ID: ${friend.id})`);
  
        // Update the data to mark this person as now a friend
        friend.isFriend = true;
        // Re-render the list (to update the UI: remove add button, show "Friend" badge)
        renderFriendsList(
          searchInputEl.value ? friendsData.filter(f => f.name.toLowerCase().includes(searchInputEl.value.toLowerCase())) 
                               : friendsData
        );
      }
    }
  });
  
  // Initial render: display the full friends list on page load
  renderFriendsList(friendsData);
  