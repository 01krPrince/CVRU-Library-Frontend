let updateFormInitialized = false;
let uploadedImageUrl = null;

function handleImageUpload(fileInput, form, callback) {
    fileInput.addEventListener('change', async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const uploadStatus = document.createElement('div');
        uploadStatus.textContent = 'Uploading image...';
        uploadStatus.style.color = 'black';
        form.appendChild(uploadStatus);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "CVRU_Library");

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/cloudinarycloudstore/image/upload', {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(await response.text());

            const data = await response.json();
            const imageUrl = data.secure_url;
            uploadedImageUrl = imageUrl;

            uploadStatus.textContent = 'Image uploaded successfully!';
            uploadStatus.style.color = 'green';

            const existingPreview = form.querySelector('.image-preview');
            if (existingPreview) existingPreview.remove();

            const preview = document.createElement('img');
            preview.src = imageUrl;
            preview.className = 'image-preview';
            preview.style.maxWidth = '100px';
            preview.style.marginTop = '10px';
            form.appendChild(preview);

            if (callback) callback(imageUrl);
        } catch (error) {
            console.error("Upload Error:", error);
            uploadStatus.textContent = `Upload failed: ${error.message}`;
            uploadStatus.style.color = 'red';
        }
    });
}

// ✅ Update Book Form Setup
function setUpdateBookForm() {
    const form = document.getElementById('updateBookForm');
    if (!form) {
        console.error('Form with id "updateBookForm" not found.');
        return;
    }

    if (updateFormInitialized) return;
    updateFormInitialized = true;

    const fileInput = form.querySelector('input[name="imgUrl"]');
    const isbnInput = document.querySelector('#isbn');
    const searchBtn = document.querySelector('#search');

    let bookId = null;

    if (fileInput) {
        handleImageUpload(fileInput, form, (url) => {
            uploadedImageUrl = url;
        });
    }

    // Search Book by ISBN
    if (searchBtn && isbnInput) {
        searchBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const isbn = isbnInput.value.trim();
            if (!isbn) {
                alert('Please enter an ISBN.');
                return;
            }

            try {
                const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/searchByISBN?isbn=${isbn}`);
                if (!response.ok) throw new Error('Book not found');

                const book = await response.json();
                bookId = book.id;

                // Fill form
                form.title.value = book.title || '';
                form.author.value = book.author || '';
                form.genre.value = book.genre || '';
                form.publisher.value = book.publisher || '';
                form.publicationYear.value = book.publicationYear || '';
                form.language.value = book.language || '';
                form.totalNumberOfBooks.value = book.totalCopies || '';
                uploadedImageUrl = book.imgUrl || '';

                const existingPreview = form.querySelector('.image-preview');
                if (existingPreview) existingPreview.remove();

                if (uploadedImageUrl) {
                    const preview = document.createElement('img');
                    preview.src = uploadedImageUrl;
                    preview.className = 'image-preview';
                    preview.style.maxWidth = '100px';
                    preview.style.marginTop = '10px';
                    form.appendChild(preview);
                }

                alert('Book data loaded. You can now update it.');
            } catch (error) {
                console.error(error);
                alert('Error fetching book: ' + error.message);
            }
        });
    }

    // Submit Update
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!bookId) {
            alert('Search for a book by ISBN first.');
            return;
        }

        const formData = new FormData(form);

        const existingImageUrl = form.querySelector('.image-preview')?.src || '';

        const updatedBook = {
            title: formData.get('title'),
            author: formData.get('author'),
            genre: formData.get('genre'),
            imgUrl: uploadedImageUrl || existingImageUrl,
            publisher: formData.get('publisher'),
            publicationYear: parseInt(formData.get('publicationYear')),
            language: formData.get('language'),
            totalNumberOfBooks: parseInt(formData.get('totalNumberOfBooks'))
        };

        if (!updatedBook.title || !updatedBook.author || !updatedBook.genre || !updatedBook.publisher || !updatedBook.language) {
            alert('All fields must be filled out.');
            return;
        }

        if (isNaN(updatedBook.publicationYear) || updatedBook.publicationYear < 1800 || updatedBook.publicationYear > new Date().getFullYear()) {
            alert('Invalid publication year.');
            return;
        }

        if (isNaN(updatedBook.totalNumberOfBooks) || updatedBook.totalNumberOfBooks <= 0) {
            alert('Total Number of Books must be a positive number.');
            return;
        }

        const isbn = isbnInput.value.trim();
        try {
            const btn = form.querySelector('button[type="submit"]');
            btn.innerText = 'Updating...';
            const id = localStorage.getItem('id');

            const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/updateByISBN?isbn=${isbn}&adminId=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'adminId': id
                },
                body: JSON.stringify(updatedBook)
            });

            btn.innerText = 'Update Book';

            if (response.ok) {
                alert('Book updated successfully!');
                form.reset();
                bookId = null;
                uploadedImageUrl = null;

                const preview = form.querySelector('.image-preview');
                if (preview) preview.remove();
            } else {
                const result = await response.json();
                alert(`Error updating book: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update book: ' + error.message);
        }
    });
}

// ✅ Add Book Form Setup
function setAddBookForm() {
    const form = document.querySelector('#addBookForm');
    if (!form) return;

    const fileInput = form.querySelector('input[name="imgUrl"]');

    if (fileInput) {
        handleImageUpload(fileInput, form, (url) => {
            uploadedImageUrl = url;
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const newBook = {
            title: formData.get('title'),
            author: formData.get('author'),
            genre: formData.get('genre'),
            imgUrl: uploadedImageUrl,
            publisher: formData.get('publisher'),
            publicationYear: parseInt(formData.get('publicationYear')),
            language: formData.get('language'),
            totalNumberOfBooks: parseInt(formData.get('totalNumberOfBooks'))
        };

        if (!newBook.title || !newBook.author || !newBook.genre || !newBook.publisher || !newBook.language) {
            alert('All fields must be filled out.');
            return;
        }

        if (isNaN(newBook.publicationYear) || newBook.publicationYear < 1800 || newBook.publicationYear > new Date().getFullYear()) {
            alert('Invalid publication year.');
            return;
        }

        if (isNaN(newBook.totalNumberOfBooks) || newBook.totalNumberOfBooks <= 0) {
            alert('Total Number of Books must be a positive number.');
            return;
        }

        try {
            const id = localStorage.getItem('id');
            const btn = form.querySelector('button[type="submit"]');
            btn.innerText = 'Adding...';

            const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/add?adminId=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'adminId': id
                },
                body: JSON.stringify(newBook)
            });

            btn.innerText = 'Add Book';

            if (response.ok) {
                alert('Book added successfully!');
                form.reset();
                uploadedImageUrl = null;

                const preview = form.querySelector('.image-preview');
                if (preview) preview.remove();
            } else {
                const result = await response.json();
                alert(`Error adding book: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Add Book Error:', error);
            alert('Failed to add book: ' + error.message);
        }
    });
}

// ✅ Initialize both forms
setUpdateBookForm();
setAddBookForm();
