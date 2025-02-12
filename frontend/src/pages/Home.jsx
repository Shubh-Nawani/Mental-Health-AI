import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoMdChatboxes } from 'react-icons/io';

const Home = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Mental Health AI Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal AI companion for mental health support and guidance.
            Talk to our AI in a safe, private, and judgment-free environment.
          </p>

          <div className="space-y-4">
            {!token ? (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link
                to="/chat"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <IoMdChatboxes className="mr-2" size={20} />
                Start Chatting
              </Link>
            )}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Access support anytime, anywhere. Our AI is always here to listen.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Private & Secure
              </h3>
              <p className="text-gray-600">
                Your conversations are private and protected with end-to-end encryption.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Personalized Help
              </h3>
              <p className="text-gray-600">
                Get tailored support based on your unique needs and situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;