import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { getApiUrl, setApiUrl } from '../services/storage';
import { GOOGLE_APPS_SCRIPT_CODE } from '../services/googleAppsScript';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(getApiUrl() || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    setApiUrl(url);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-mega-light">
          <h2 className="text-xl font-bold text-mega-dark">Backend Connection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-mega-dark transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Google Apps Script Web App URL</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mega-yellow focus:border-mega-yellow outline-none transition-all"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use LocalStorage (Browser). Paste URL to sync with Sheets.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-yellow-800">How to setup Google Sheets Backend:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
              <li>Create a new Google Sheet.</li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Copy the code below and paste it into <code>Code.gs</code>.</li>
              <li>Click <strong>Deploy &gt; New deployment</strong>.</li>
              <li>Select type <strong>Web App</strong>.</li>
              <li>Set "Who has access" to <strong>Anyone</strong> (needed for simple API access).</li>
              <li>Copy the Web App URL and paste it above.</li>
            </ol>
          </div>

          {/* Code Block */}
          <div className="relative group">
            <div className="absolute top-2 right-2">
              <button 
                onClick={copyCode}
                className="p-2 bg-white/90 rounded-md shadow-sm hover:bg-white text-gray-600 transition-all text-xs flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto h-48 font-mono">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-mega-yellow text-white font-bold rounded-lg shadow-md hover:bg-orange-500 transition-colors"
          >
            Save Connection
          </button>
        </div>

      </div>
    </div>
  );
};