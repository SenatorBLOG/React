function WelcomeModal({ isVisible, onClose, email }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Login Successful!</h2>
        <p className="mb-6 text-center">Welcome, {email}!</p>
        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;