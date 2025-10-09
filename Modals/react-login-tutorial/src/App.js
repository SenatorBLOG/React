import { useState } from 'react';
import LoginForm from './LoginForm';
import WelcomeModal from './WelcomeModal';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }
    setError('');
    setIsModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        error={error}
      />
      <WelcomeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        email={email}
      />
    </div>
  );
}

export default App;