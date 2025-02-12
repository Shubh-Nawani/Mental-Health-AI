import { SignUp } from '@clerk/clerk-react';

export default function Signup() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0b10] text-white">
      <h2 className="text-3xl mb-6">Sign Up</h2>
      <SignUp
        path="/signup"
        signInUrl="/login"
        appearance={{
          layout: {
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton',
          },
          elements: {
            rootBox: 'w-full',
            card: 'bg-transparent shadow-none p-0',
            headerTitle: 'text-2xl font-bold text-gray-900',
            headerSubtitle: 'text-gray-600 mb-8',
            formButtonPrimary: 'w-full bg-black text-white rounded-lg py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed',
            formFieldLabel: 'block text-sm font-medium text-gray-700 mb-2',
            formFieldInput: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            formResendCodeLink: 'text-blue-600 hover:text-blue-700',
            footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
          },
        }}
      />
    </div>
  );
}
