import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          © 2025 GazSmart. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Help</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Terms</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;