
document.addEventListener("DOMContentLoaded", function () {
    const adminId = localStorage.getItem('id');
    fetch(`https://cvru-library-backend.onrender.com/api/books/adminDashboard?adminId=${adminId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalBooks').textContent = data.totalBookCount;
            document.getElementById('registeredStudents').textContent = data.totalRegisteredStudents;
            document.getElementById('booksIssued').textContent = data.totalBookIssued;
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            document.getElementById('totalBooks').textContent = 'Error';
            document.getElementById('registeredStudents').textContent = 'Error';
            document.getElementById('booksIssued').textContent = 'Error';
        });
});
