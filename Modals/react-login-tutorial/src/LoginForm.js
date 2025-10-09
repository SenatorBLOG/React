function LoginForm({ email, password, onEmailChange, onPasswordChange, onSubmit, error }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back!</h2>
      <p className="text-gray-600 mb-6 text-center">Sign in to your account</p>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email"></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email Address"
          autoCapitalize="none"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password"></label>
        <input
          type="password"
          id="password"
          value={password}

          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          secureTextEntry
        />
      </div>
      <button
        onClick={onSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Login
      </button>
    </div>
  );
}

export default LoginForm;