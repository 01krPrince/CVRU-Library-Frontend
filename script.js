function LoginForm() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;

        console.log('Submitting login with:', email, password);

        try {
            const response = await fetch(`https://cvru-library-backend.onrender.com/api/students/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

            if (response.ok) {
                const data = await response.json();
                console.log('Login response:', data);

                if (data.role === 'STUDENT') {
                    window.location.href = 'student.html';
                  } else if (data.role === 'ADMIN') {
                    window.location.href = 'admin.html';
                  } else {
                    alert('Unknown role');
                  }
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    };

    return (
      <div className="glass p-8 rounded-xl shadow-xl w-full max-w-md mx-auto text-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-6">Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your ID"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New student?{" "}
          <a href="#" className="text-indigo-600 hover:underline font-medium">
            Contact Admin
          </a>
        </p>
      </div>
    );
}

function LandingPage() {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <header className="bg-white shadow-sm py-4">
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="https://via.placeholder.com/40" alt="Logo" className="rounded-full"/>
              <span className="text-xl font-semibold text-indigo-800">Dr. C.V. Raman University Library</span>
            </div>
            <nav className="space-x-6 text-gray-700 font-medium text-sm hidden sm:block">
              <a href="#" className="hover:text-indigo-600">Home</a>
              <a href="#" className="hover:text-indigo-600">Resources</a>
              <a href="#" className="hover:text-indigo-600">Contact</a>
            </nav>
          </div>
        </header>

        <main className="flex flex-col-reverse lg:flex-row items-center justify-center px-6 py-12 lg:py-20 gap-12 max-w-6xl mx-auto">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Library Portal</h1>
            <p className="text-gray-700 mb-6">
              Access your study materials, journals, e-books, and more through our digital library. CVRU is committed to empowering students through knowledge.
            </p>
            <a href="#" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Explore Library
            </a>
          </div>

          <div className="lg:w-1/2">
            <LoginForm />
          </div>
        </main>

        <footer className="bg-white border-t text-sm text-gray-600 py-4">
          <div className="max-w-6xl mx-auto px-6 flex justify-between flex-col sm:flex-row items-center">
            <p>© 2025 CVRU. All rights reserved.</p>
            <div className="space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Help</a>
            </div>
          </div>
        </footer>
      </div>
    );
}

ReactDOM.render(<LandingPage />, document.getElementById('root'));
