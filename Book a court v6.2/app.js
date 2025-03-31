document.addEventListener("DOMContentLoaded", function () {
    // Form Validation for Booking a Court
    let form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent actual form submission

            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let phone = document.getElementById("phone_number").value.trim();
            let matchDate = document.getElementById("match_date").value;
            let matchTime = document.getElementById("match_time").value;
            let location = document.getElementById("location").value;

            // Check for empty fields
            if (!name || !email || !phone || !matchDate || !matchTime || !location) {
                alert("⚠️ Please fill out all fields before submitting.");
                return;
            }

            // Validate email format
            if (!validateEmail(email)) {
                alert("⚠️ Invalid email format. Please enter a valid email.");
                return;
            }

            // Validate phone number (basic validation for digits only)
            if (!validatePhone(phone)) {
                alert("⚠️ Invalid phone number. Please enter only numbers.");
                return;
            }

            // Successful submission
            alert("✅ Court booked successfully!");
            form.reset();
        });
    }

    // Function to validate email format
    function validateEmail(email) {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Function to validate phone number format
    function validatePhone(phone) {
        let re = /^[0-9]{8,15}$/; // Allows only 8-15 digits
        return re.test(phone);
    }
    
    // Match History Filtering
    function search() {
        let dateFilter = document.getElementById("dateFilter").value;
        let playerFilter = document.getElementById("playerFilter").value.toLowerCase();
        let winnerFilter = document.getElementById("winnerFilter").value.toLowerCase();
        let courtFilter = document.getElementById("CourtFilter").value.toLowerCase();
        
        document.querySelectorAll("table tbody tr").forEach(row => {
            let date = row.cells[0].textContent;
            let player1 = row.cells[2].textContent.toLowerCase();
            let player2 = row.cells[3].textContent.toLowerCase();
            let winner = row.cells[5].textContent.toLowerCase();
            let court = row.cells[6].textContent.toLowerCase();
            
            let showRow = (!dateFilter || date.includes(dateFilter)) &&
                (!playerFilter || player1.includes(playerFilter) || player2.includes(playerFilter)) &&
                (!winnerFilter || winner.includes(winnerFilter)) &&
                (!courtFilter || court.includes(courtFilter));
            
            row.style.display = showRow ? "" : "none";
        });
    }
    
    function reset() {
        document.getElementById("dateFilter").value = "";
        document.getElementById("playerFilter").value = "";
        document.getElementById("winnerFilter").value = "";
        document.getElementById("CourtFilter").value = "";
        document.querySelectorAll("table tbody tr").forEach(row => row.style.display = "");
        
        // Clear player selection and disable the button
        document.querySelectorAll("input[name='playerSelection']").forEach(radio => radio.checked = false);
        updateChooseSelectedButton();
    }
    
    // Matchmaking Filtering & Selection
    function filterTable() {
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
    }
    
    function resetFilters() {
        document.getElementById("filterId").value = "";
        document.getElementById("filterName").value = "";
        document.getElementById("filterGender").value = "";
        document.getElementById("filterStrength").value = "";
        document.querySelectorAll("table tbody tr").forEach(row => row.style.display = "");
        
        // Clear player selection and disable the button
        document.querySelectorAll("input[name='playerSelection']").forEach(radio => radio.checked = false);
        updateChooseSelectedButton();
    }
    
    function ChooseRandom() {
        let rows = document.querySelectorAll("table tbody tr");
        let randomIndex = Math.floor(Math.random() * rows.length);
        let randomRadio = rows[randomIndex].querySelector("input[type='radio']");
        if (randomRadio) {
            randomRadio.checked = true;
            updateChooseSelectedButton();
        }
    }
    
    function ChooseSelected() {
        let selected = document.querySelector("input[name='playerSelection']:checked");
        if (selected) {
            alert("Player Selected!");
        } else {
            alert("Please select a player first.");
        }
    }

    function updateChooseSelectedButton() {
        let selected = document.querySelector("input[name='playerSelection']:checked");
        let chooseButton = document.getElementById("chooseSelected");
        if (chooseButton) {
            chooseButton.disabled = !selected;
        }
    }

    // Ensure the button is disabled by default
    let chooseButton = document.getElementById("chooseSelected");
    if (chooseButton) {
        chooseButton.disabled = true;
    }
    
    document.querySelectorAll("input[name='playerSelection']").forEach(radio => {
        radio.addEventListener("change", updateChooseSelectedButton);
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

    document.querySelector("button[onclick='search()']")?.addEventListener("click", search);
    document.querySelector("button[onclick='reset()']")?.addEventListener("click", reset);
    document.querySelector("button[onclick='filterTable()']")?.addEventListener("click", filterTable);
    document.querySelector("button[onclick='resetFilters()']")?.addEventListener("click", resetFilters);
    document.querySelector("button[onclick='ChooseRandom()']")?.addEventListener("click", ChooseRandom);
    document.querySelector("button[onclick='ChooseSelected()']")?.addEventListener("click", ChooseSelected);
});
