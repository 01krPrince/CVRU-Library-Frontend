function setupAddBookForm() {
    const form = document.querySelector('#addBookForm');
    const fileInput = form.querySelector('input[name="imgUrl"]');
    let uploadedImageUrl = null;

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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Image upload failed.');
            }

            const data = await response.json();
            uploadedImageUrl = data.secure_url;
            uploadStatus.textContent = 'Image uploaded successfully!';
            uploadStatus.style.color = 'green';

            // Optional: Show image
            let preview = document.createElement('img');
            preview.src = uploadedImageUrl;
            preview.style.maxWidth = '100px';
            preview.style.marginTop = '10px';
            form.appendChild(preview);

        } catch (error) {
            console.error("Upload Error:", error);
            uploadStatus.textContent = `Upload failed: ${error.message}`;
            uploadStatus.style.color = 'red';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const bookData = {
            title: formData.get('title'),
            author: formData.get('author'),
            genre: formData.get('genre'),
            imgUrl: uploadedImageUrl || null,
            publisher: formData.get('publisher'),
            publicationYear: parseInt(formData.get('publicationYear')),
            language: formData.get('language'),
            totalNumberOfBooks: parseInt(formData.get('totalNumberOfBooks'))
        };

        // Input validation
        const requiredFields = [
            { name: 'title', value: bookData.title },
            { name: 'author', value: bookData.author },
            { name: 'genre', value: bookData.genre },
            { name: 'publisher', value: bookData.publisher },
            { name: 'language', value: bookData.language }
        ];

        for (const field of requiredFields) {
            if (!field.value.trim()) {
                alert(`${field.name.charAt(0).toUpperCase() + field.name.slice(1)} must not be empty.`);
                return;
            }
        }

        if (isNaN(bookData.publicationYear) || bookData.publicationYear < 1800 ||
            bookData.publicationYear > new Date().getFullYear()) {
            alert('Publication Year must be between 1800 and the current year.');
            return;
        }

        if (isNaN(bookData.totalNumberOfBooks) || bookData.totalNumberOfBooks <= 0) {
            alert('Total Number of Books must be a positive number.');
            return;
        }

        if (bookData.imgUrl && !/^https?:\/\/.+$/.test(bookData.imgUrl)) {
            alert('Image URL must start with http:// or https://');
            return;
        }

        const id = localStorage.getItem('id');
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            alert('Invalid or missing Admin ID. Please log in again.');
            return;
        }

        try {
            const btn = document.getElementById("addBook");
            btn.innerText = "Adding...";
            const response = await fetch(`https://cvru-library-backend.onrender.com/api/books/addBook?adminId=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();
            btn.innerText = "Add Book";

            if (response.ok) {
                alert('Book added successfully!');
                form.reset();
                uploadedImageUrl = null;
            } else {
                const errorMessage = result.message || 'Failed to add book';
                if (result.errors && Array.isArray(result.errors)) {
                    const detailedErrors = result.errors.map(err => {
                        if (typeof err === 'object' && err.field && err.message) {
                            return `${err.field}: ${err.message}`;
                        }
                        return String(err);
                    }).join('; ');
                    alert(`Error: ${errorMessage}\nDetails: ${detailedErrors}`);
                } else {
                    alert(`Error: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('Failed to fetch')) {
                alert('Failed to connect to the server. Is it running on https://cvru-library-backend.onrender.com?');
            } else {
                alert('Unexpected error: ' + error.message);
            }
        }
    });
}

window.setupAddBookForm = setupAddBookForm;
