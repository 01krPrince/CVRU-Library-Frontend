function setRemoveBookForm() {
    const form = document.querySelector('#removeBookForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const bookData = {
            isbn: formData.get('isbn')
        };

        // Validate inputs
        const requiredFields = [
            { name: 'isbn', value: bookData.isbn }
        ];

        for (const field of requiredFields) {
            if (!field.value.trim()) {
                alert(`${field.name.charAt(0).toUpperCase() + field.name.slice(1)} must not be empty.`);
                return;
            }
        }

        const id = localStorage.getItem('id');
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            alert('Invalid or missing Admin ID. Please log in again.');
            return;
        }

        try {
            const btn = document.getElementById("removeBook");
            btn.innerText = "Removing....";

            console.log('Sending bookData:', JSON.stringify(bookData, null, 2));

            const response = await fetch(`http://localhost:8080/api/books/${id}?isbn=${bookData.isbn}&adminId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            let result = null;
            if (response.status !== 204) {
                try {
                    result = await response.json();
                } catch (jsonError) {
                    console.warn("No JSON returned from server.");
                }
            }

            console.log("Id is ->>", id);
            console.log('Server response:', result);
            btn.innerText = "Remove Book";

            if (response.ok) {
                alert('Book removed successfully!');
                form.reset();
            } else {
                const errorMessage = result?.message || 'Failed to remove book';
                if (result?.errors && Array.isArray(result.errors)) {
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
                alert('Failed to connect to the server. Please ensure the server is running on http://localhost:8080, check for port conflicts, and verify backend configuration.');
            } else {
                alert('An unexpected error occurred: ' + error.message);
            }
        }
    });
}
