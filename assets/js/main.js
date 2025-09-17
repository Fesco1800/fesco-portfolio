(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const filter = document.getElementById("filter");
    const cards = document.querySelectorAll(".works-card");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageNumbers = document.getElementById("pageNumbers");

    let currentPage = 1;
    const itemsPerPage = 9;
    let filteredCards = [];

    function showCards() {
      cards.forEach((card) => card.classList.add("hide"));

      let start = (currentPage - 1) * itemsPerPage;
      let end = start + itemsPerPage;

      filteredCards
        .slice(start, end)
        .forEach((card) => card.classList.remove("hide"));

      updatePagination();
    }

    function updatePagination() {
      const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
      pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function applyFilter() {
      const selected = filter.value;

      filteredCards = Array.from(cards).filter((card) => {
        return (
          selected === "all" ||
          card.dataset.category.split(" ").includes(selected)
        );
      });

      currentPage = 1;
      showCards();
    }

    // --- Handle URL / local hash fallback ---
    function getInitialFilter() {
      let params;
      try {
        params = new URLSearchParams(window.location.search);
      } catch {
        params = null;
      }

      let filterValue = params ? params.get("filter") : null;

      // If no query param (like file:///), check hash: #filter=ui
      if (!filterValue && window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        if (hash.startsWith("filter=")) {
          filterValue = hash.split("=")[1];
        }
      }

      return filterValue || "website"; // fallback default
    }

    // Init
    const initialFilter = getInitialFilter();
    if (
      initialFilter &&
      filter.querySelector(`option[value="${initialFilter}"]`)
    ) {
      filter.value = initialFilter;
    }

    filter.addEventListener("change", applyFilter);
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        showCards();
      }
    });
    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        showCards();
      }
    });

    // Default load
    applyFilter();
  });
})();
