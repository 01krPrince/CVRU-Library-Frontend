let activeTab = 'overview';

function setActiveTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.setAttribute('aria-selected', btn.onclick.toString().includes(tab) ? 'true' : 'false');
    });
    renderContent();
}

async function renderContent() {
    const contentContainer = document.getElementById('content-container');
    let contentHTML = '';

    switch (activeTab) {
        case 'overview':
            contentHTML = `
    <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg slide-in-right">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Dashboard Overview</h2>
      <p class="text-blue-700 mb-4">Welcome, Student! Explore the library resources below.</p>
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-blue-100 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-800">Books Borrowed</h3>
          <p class="text-2xl text-blue-600" id="booksBorrowed">Loading...</p>
        </div>
        <div class="bg-blue-100 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-800">Due Date</h3>
          <p class="text-2xl text-blue-600" id="dueDate">Loading...</p>
        </div>
      </div>
    </div>`;
            break;

        case 'searchBooks':
            contentHTML = `
        <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg slide-in-right">
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Search Books</h2>
          <form id="searchForm">
            <div class="mb-4">
              <label class="block text-blue-700 mb-2 font-medium" for="searchQuery">
                Search by Title, Author, or ISBN
              </label>
              <input type="text" id="searchQuery" class="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" placeholder="Enter search query" required aria-required="true" />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105">Search</button>
          </form>
        </div>`;
            break;

        case 'borrowBooks':
            contentHTML = `
        <div class="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full slide-in-right">
          <h2 class="text-2xl font-bold mb-4 text-center text-blue-800">Borrow a Book</h2>
          <form id="borrowForm">
            <input type="text" id="borrowBookId" class="w-full p-2 mb-4 rounded-md border border-gray-300 text-gray-800"
              placeholder="Enter Book ID or ISBN" required aria-required="true" />
            <button type="submit"
              class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md">Borrow Book</button>
          </form>
          <div id="borrowStatus" class="mt-4 text-center text-blue-600 hidden"></div>
        </div>
      `;
            break;

        case 'returnBooks':
            contentHTML = `
        <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg slide-in-right">
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Return Books</h2>
          <form id="returnForm">
            <div class="mb-4">
              <label class="block text-blue-700 mb-2 font-medium" for="bookIdReturn">Book ID or ISBN</label>
              <input type="text" id="bookIdReturn" class="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Book ID or ISBN" required aria-required="true" />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105">Return Book</button>
          </form>
          <p id="returnStatus" class="mt-4 text-center hidden"></p>
        </div>`;
            break;

        case 'profile':
            contentHTML = `
        <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg slide-in-right">
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Student Profile</h2>
          <div class="text-blue-700">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Student ID:</strong> CVRU12345</p>
            <p><strong>Email:</strong> john.doe@cvru.edu</p>
            <p><strong>Books Borrowed:</strong> 3</p>
            <p><strong>Fines:</strong> $0.00</p>
          </div>
        </div>`;
            break;

        default:
            contentHTML = `<p class="text-white">Invalid Tab Selected</p>`;
    }

    contentContainer.innerHTML = contentHTML;

    // Set up event listeners for forms
    setupFormEventListeners();
}

function setupFormEventListeners() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('searchQuery').value;
            await window.searchBooks(query);
        });
    }

    const borrowForm = document.getElementById('borrowForm');
    if (borrowForm) {
        borrowForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bookId = document.getElementById('borrowBookId').value;
            await window.borrowBook(bookId);
        });
    }

    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bookId = document.getElementById('bookIdReturn').value;
            await window.returnBook(bookId);
        });
    }
}

// Make functions available globally
window.setActiveTab = setActiveTab;
window.renderContent = renderContent;

// Initialize on window load
window.addEventListener('load', renderContent);