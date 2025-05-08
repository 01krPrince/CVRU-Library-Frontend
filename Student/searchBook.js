async function searchBooks(searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
      alert('Please enter a search query.');
      return;
    }
  
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = `<p class='text-blue-600'>Loading...</p>`;
    resultsDiv.classList.remove('hidden');
  
    try {
      const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/search?searchEle=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
  
      const books = await response.json();
      displaySearchResults(books);
    } catch (error) {
      console.error('Error fetching search results:', error);
      resultsDiv.innerHTML = `<p class='text-red-600'>Failed to fetch search results. Please try again.</p>`;
    }
  }
  
  function displaySearchResults(books) {
    const container = document.getElementById("searchResults");
  
    container.classList.remove("hidden");
  
    if (!books.length) {
      container.innerHTML = `<p class='text-red-600'>No books found.</p>`;
      return;
    }
  
    const isSingle = books.length === 1;
  
    const layoutClass = isSingle
      ? "flex justify-center"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
  
    const cardsHTML = books.map(book => `
      <div class="bg-blue-50 p-4 rounded-lg shadow w-[250px]">
        <h3 class="text-blue-800 font-bold text-lg">${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Status:</strong> ${book.status}</p>
        <p><strong>Book ID:</strong> ${book.id || 'N/A'}</p>
        <img src="${book.imgUrl || ''}" alt="Book Cover" class="w-24 mt-2 rounded">
      </div>
    `).join('');
  
    container.innerHTML = `<div class="${layoutClass}">${cardsHTML}</div>`;
  }
  
  // Make functions available globally
  window.searchBooks = searchBooks;
  window.displaySearchResults = displaySearchResults;
  