
  async function searchBooks(searchQuery) {
    if (!searchQuery || searchQuery.trim() === "") {
      alert("Please enter a search query.");
      return;
    }

    try {
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = `<p class='text-blue-600'>Searching...</p>`;

      const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/search?searchEle=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const books = await response.json();
      displaySearchResults(books);

    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results.");
    }
  }

  function displaySearchResults(books) {
    const container = document.getElementById("searchResults");

    if (!books.length) {
      container.innerHTML = `<p class='text-red-600 font-semibold'>No books found for your search query.</p>`;
      container.scrollIntoView({ behavior: "smooth" });
      return;
    }

    container.innerHTML = books.map(book => `
      <div class="bg-blue-50 p-4 mb-4 rounded-lg shadow">
        <h3 class="text-blue-800 font-bold text-lg">${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Status:</strong> ${book.status}</p>
        <img src="${book.imgUrl}" alt="Book Cover" class="w-24 mt-2 rounded">
      </div>
    `).join('');

    // Auto-scroll to results
    container.scrollIntoView({ behavior: "smooth" });
  }
