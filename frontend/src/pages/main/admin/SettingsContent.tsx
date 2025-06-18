// src/components/SettingsContent.tsx
import { FiGrid, FiBox } from 'react-icons/fi';

const recentDevices = [
  { type: 'desktop', name: 'Macbook Pro', location: 'New York, USA', lastActive: 'Active now' },
  { type: 'mobile', name: 'iPhone 12', location: 'London, UK', lastActive: '2 hours ago' },
  { type: 'tablet', name: 'iPad Pro', location: 'Sydney, Australia', lastActive: '1 day ago' },
];

const SettingsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-black">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-black">Account Settings</h3>
            <ul className="space-y-2">
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-black">Profile Information</li>
              <li className="p-2 rounded bg-blue-100 cursor-pointer text-blue-800">Security</li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-black">Notifications</li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-black">Billing</li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-black">Preferences</li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-6 text-black">Security Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-3 text-black">Change Password</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-md font-medium mb-3 text-black">Two-Factor Authentication</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-black">Status: <span className="text-green-600">Active</span></p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition">
                    Manage
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-md font-medium mb-3 text-black">Recent Devices</h4>
                <div className="space-y-3">
                  {recentDevices.map((device, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          {device.type === 'desktop' ? <FiGrid /> : <FiBox />}
                        </div>
                        <div>
                          <p className="text-black">{device.name}</p>
                          <p className="text-sm text-gray-600">{device.location} • {device.lastActive}</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm">Logout</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;