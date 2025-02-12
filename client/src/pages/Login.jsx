import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Back</h1>
        <SignIn
          onlyThirdPartyProviders
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none p-0',
              socialButtonsVariant: 'blockButton',
            },
          }}
        />
      </div>
    </div>
  );
}