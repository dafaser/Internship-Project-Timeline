import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Layout } from 'lucide-react';

interface LoginProps {
  onSuccess: (credentialResponse: any) => void;
  onError: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onError }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-8">
        
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-mega-yellow p-4 rounded-full shadow-lg">
            <Layout className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-mega-dark">Welcome</h1>
            <p className="text-gray-500 mt-2">Internship Project Timeline</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-100 py-8 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Please sign in with your Google Account to access the dashboard.
          </p>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Powered by React & Google Sheets
        </p>
      </div>
    </div>
  );
};