async function loadStudentProfile() {
    const enrollmentNo = localStorage.getItem('id');
    if (!enrollmentNo) {
      document.getElementById('content-container').innerHTML = `
          <div class="text-red-500 text-center p-4 bg-white rounded-lg shadow-xl">
              Enrollment ID not found. Please log in again.
          </div>`;
      return;
    }

    try {
      const response = await fetch(`https://cvru-library-backend.onrender.com/api/students/${enrollmentNo}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const profileHTML = `
          <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg slide-in-right">
              <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Student Profile</h2>
              <div class="space-y-4">
                  <div><strong class="text-blue-800">Name:</strong> ${data.fullName}</div>
                  <div><strong class="text-blue-800">Enrollment No:</strong> ${data.enrollmentNo}</div>
                  <div><strong class="text-blue-800">Email:</strong> ${data.email}</div>
                  <div><strong class="text-blue-800">Phone:</strong> ${data.phone}</div>
                  <div><strong class="text-blue-800">Role:</strong> ${data.role}</div>
                  <div><strong class="text-blue-800">Status:</strong> ${data.status}</div>
                  <div><strong class="text-blue-800">Total Fines:</strong> ₹${data.totalFines}</div>
              </div>
          </div>`;
      document.getElementById('content-container').innerHTML = profileHTML;
    } catch (error) {
      console.error("Error fetching profile:", error);
      document.getElementById('content-container').innerHTML = `
          <div class="text-red-500 text-center p-4 bg-white rounded-lg shadow-xl">
              Failed to load profile information. Please try again later.
          </div>`;
    }
  }
