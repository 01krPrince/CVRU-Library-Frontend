async function borrowBook(bookId) {
    const status = document.getElementById('borrowStatus');
    status.classList.remove('hidden');
    status.innerHTML = `<p class='text-blue-600'>Processing...</p>`;
  
    if (!bookId || bookId.trim() === '') {
      status.innerHTML = `<p class='text-red-600'>Please enter a valid Book ID or ISBN.</p>`;
      return;
    }
  
    const studentId = localStorage.getItem("id");
    
    try {
      const response = await fetch(`https://cvru-library-backend.onrender.com/api/borrow/BorrowBook?studentId=${encodeURIComponent(studentId)}&isbn=${encodeURIComponent(bookId)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.text().then(text => {
          try {
            return JSON.parse(text);
          } catch {
            return { message: text || 'No error details provided' };
          }
        }).catch(() => ({}));
        
        console.log('Error response:', errorData, 'Status:', response.status);
        
        const errorMessage = response.status === 400
          ? errorData.message || 'Invalid Student ID or Book ID. Please check your input.'
          : response.status === 404
            ? 'Borrow endpoint not found. Ensure the server is running and the endpoint is correct.'
            : errorData.message || `Server responded with status ${response.status}`;
            
        throw new Error(errorMessage);
      }
  
      const result = await response.json();
      status.innerHTML = `<p class='text-green-600'>Book borrowed successfully! Borrow ID: ${result.borrowedId || 'N/A'}</p>`;
    } catch (error) {
      console.error('Error borrowing book:', error);
      status.innerHTML = `<p class='text-red-600'>Failed to borrow book: ${error.message}.</p>`;
    }
  }
  
  // Make function available globally
  window.borrowBook = borrowBook;