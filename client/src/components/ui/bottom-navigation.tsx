import { Link, useLocation } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          <NavItem 
            to="/" 
            icon="dashboard" 
            label="Dashboard" 
            active={isActive('/')} 
          />
          <NavItem 
            to="/scan" 
            icon="search" 
            label="Scan" 
            active={isActive('/scan')} 
          />
          <NavItem 
            to="/history" 
            icon="history" 
            label="History" 
            active={isActive('/history')} 
          />
          <NavItem 
            to="/account" 
            icon="person" 
            label="Account" 
            active={isActive('/account')} 
          />
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link href={to}>
      <a className={`flex flex-col items-center ${active ? 'text-primary-600' : 'text-gray-500'}`}>
        <span className="material-icons">{icon}</span>
        <span className="text-xs mt-1">{label}</span>
      </a>
    </Link>
  );
}
