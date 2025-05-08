function loadOverviewData() {
    const studentId = localStorage.getItem('id');

    fetch(`https://cvru-library-backend.onrender.com/api/borrow/bookBorrowedCount?studentId=${studentId}`)
        .then(res => res.text())
        .then(count => {
            document.getElementById('booksBorrowed').textContent = count;
        })
        .catch(() => {
            document.getElementById('booksBorrowed').textContent = 'Error';
        });

    fetch(`https://cvru-library-backend.onrender.com/api/borrow/upcomingDueBook?studentId=${studentId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.dueDate) {
                const formattedDate = new Date(data.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });
                document.getElementById('dueDate').textContent = formattedDate;
            } else {
                document.getElementById('dueDate').textContent = 'No Due Date';
            }
        })
        .catch(() => {
            document.getElementById('dueDate').textContent = 'Error';
        });
}

loadOverviewData();