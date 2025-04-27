// My Bookings Page Script
(function myBookingsModule() {
  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("bookingsTable");
    const pageInfo = document.getElementById("pageInfo");
    const rowCount = document.getElementById("rowCount");

    const editForm = document.getElementById("editBookingForm");
    const editId = document.getElementById("editBookingId");
    const editDate = document.getElementById("editDate");
    const editTime = document.getElementById("editTime");
    const editCourt = document.getElementById("editCourt");
    const editLocation = document.getElementById("editLocation");

    // Set today's date as minimum for date input
    const today = new Date().toISOString().split("T")[0];
    editDate.setAttribute("min", today);

    // Adjust time field dynamically based on selected date
    editDate.addEventListener("change", () => {
      const selectedDate = new Date(editDate.value);
      const now = new Date();
      const isToday = editDate.value === now.toISOString().split("T")[0];

      if (isToday) {
        now.setMinutes(now.getMinutes() + 5); // 5-minute buffer
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        editTime.min = `${hours}:${minutes}`;
      } else {
        editTime.removeAttribute("min");
      }
    });

    let bookings = [
      { id: 1, date: '2025-04-24', time: '16:00', court: 'ABC Court', location: 'Doha' },
      { id: 2, date: '2025-05-01', time: '18:00', court: 'XYZ Court', location: 'Beirut' },
    ];
    let filteredBookings = [...bookings];
    let currentPage = 1;
    let rowsPerPage = 5;

    function renderTable() {
      const start = (currentPage - 1) * rowsPerPage;
      const end = rowsPerPage === "all" ? filteredBookings.length : start + parseInt(rowsPerPage);
      const paginated = filteredBookings.slice(start, end);

      tableBody.innerHTML = paginated.map(b => `
        <tr>
          <td>${b.date}</td>
          <td>${b.time}</td>
          <td>${b.court}</td>
          <td>${b.location}</td>
          <td>
            <button onclick="editMyBooking(${b.id})">Edit</button>
            <button onclick="cancelMyBooking(${b.id})">Cancel</button>
          </td>
        </tr>
      `).join("");

      pageInfo.textContent = `Page ${currentPage}`;
    }

    function showModal(message, onConfirm = null) {
      const modal = document.getElementById("customModal");
      const modalMsg = document.getElementById("modalMessage");
      const modalActions = document.getElementById("modalActions");
      const closeModalBtn = document.getElementById("closeModalBtn");

      if (!modal || !modalMsg || !modalActions || !closeModalBtn) return;

      modalMsg.textContent = message;
      modal.style.display = "flex";
      modalActions.innerHTML = "";

      if (onConfirm) {
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "✅ Save";
        confirmBtn.onclick = () => {
          modal.style.display = "none";
          onConfirm();
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "❌ Cancel";
        cancelBtn.onclick = () => {
          modal.style.display = "none";
          if (editForm) editForm.style.display = "none";
        };

        modalActions.appendChild(confirmBtn);
        modalActions.appendChild(cancelBtn);
        closeModalBtn.style.display = "none";
      } else {
        closeModalBtn.style.display = "inline-block";
      }
    }

    window.editMyBooking = function (id) {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;

      editId.value = booking.id;
      editDate.value = booking.date;
      editDate.dispatchEvent(new Event('change'));
      editTime.value = booking.time;
      editCourt.value = booking.court;
      editLocation.value = booking.location;

      editForm.style.display = "block";

      showModal("✏️ Edit Your Booking", () => {
        const updatedBooking = {
          id: parseInt(editId.value),
          date: editDate.value,
          time: editTime.value,
          court: editCourt.value.trim(),
          location: editLocation.value.trim()
        };

        const index = bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          bookings[index] = updatedBooking;
          filteredBookings = [...bookings];
        }

        editForm.style.display = "none";
        renderTable();
      });
    };

    window.cancelMyBooking = function (id) {
      showModal(`❌ Are you sure you want to cancel Booking #${id}?`, () => {
        bookings = bookings.filter(b => b.id !== id);
        filteredBookings = filteredBookings.filter(b => b.id !== id);
        renderTable();
      });
    };

    function filterBookings() {
      const dateInput = document.getElementById("filterDate");
      const courtInput = document.getElementById("filterCourt");

      const date = dateInput?.value || "";
      const court = courtInput?.value?.toLowerCase() || "";

      filteredBookings = bookings.filter(b => {
        const matchDate = !date || b.date === date;
        const matchCourt = !court || b.court.toLowerCase().includes(court);
        return matchDate && matchCourt;
      });

      currentPage = 1;
      renderTable();
    }

    function resetBookingsFilters() {
      document.getElementById("filterDate").value = '';
      document.getElementById("filterCourt").value = '';
      filteredBookings = [...bookings];
      currentPage = 1;
      renderTable();
    }

    window.myBookingsPrevPage = function () {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    };

    window.myBookingsNextPage = function () {
      const maxPage = Math.ceil(filteredBookings.length / rowsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderTable();
      }
    };

    rowCount?.addEventListener("change", () => {
      rowsPerPage = rowCount.value === "all" ? Infinity : parseInt(rowCount.value);
      currentPage = 1;
      renderTable();
    });

    document.getElementById("searchBookingsBtn")?.addEventListener("click", filterBookings);
    document.getElementById("resetBookingsBtn")?.addEventListener("click", resetBookingsFilters);

    document.getElementById("closeModalBtn")?.addEventListener("click", () => {
      if (editForm) editForm.style.display = "none";
    });

    renderTable();
  });
})();
