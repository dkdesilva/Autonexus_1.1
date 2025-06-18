import { ReactNode } from 'react';

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  sidebarOpen: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, text, active = false, sidebarOpen, onClick }: SidebarItemProps) => {
  return (
    <li 
      className={`px-4 py-3 flex items-center ${active ? 'bg-blue-800' : 'hover:bg-blue-800'} transition cursor-pointer`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </li>
  );
};

export default SidebarItem;