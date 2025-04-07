import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, History, User, Settings } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          <NavItem 
            to="/" 
            Icon={LayoutDashboard}
            label="Dashboard" 
            active={isActive('/')}
            color="indigo"
          />
          <NavItem 
            to="/scan" 
            Icon={Search}
            label="Scan" 
            active={isActive('/scan')}
            color="purple"
          />
          <NavItem 
            to="/history" 
            Icon={History}
            label="History" 
            active={isActive('/history')}
            color="fuchsia"
          />
          <NavItem 
            to="/account" 
            Icon={User}
            label="Account" 
            active={isActive('/account')}
            color="rose"
          />
          <NavItem 
            to="/settings" 
            Icon={Settings}
            label="Settings" 
            active={isActive('/settings')}
            color="emerald"
          />
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  Icon: React.ElementType;
  label: string;
  active: boolean;
  color: 'indigo' | 'purple' | 'fuchsia' | 'rose' | 'emerald';
}

function NavItem({ to, Icon, label, active, color }: NavItemProps) {
  const activeColors = {
    indigo: "from-indigo-500 to-blue-600",
    purple: "from-purple-500 to-indigo-600",
    fuchsia: "from-fuchsia-500 to-purple-600",
    rose: "from-rose-500 to-fuchsia-600",
    emerald: "from-emerald-500 to-teal-600",
  };
  
  const iconColors = {
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    fuchsia: "text-fuchsia-600",
    rose: "text-rose-600",
    emerald: "text-emerald-600",
  };
  
  return (
    <Link href={to}>
      <a className="flex flex-col items-center relative group">
        <div className={`
          ${active ? 'bg-gradient-to-r ' + activeColors[color] : 'bg-gray-50'} 
          ${active ? 'text-white' : iconColors[color]}
          p-2 rounded-full transition-all duration-300 relative
          ${active ? 'scale-in shadow-md' : 'hover:scale-110 hover:shadow-md'}
        `}>
          <Icon className={`h-5 w-5 ${active ? 'animate-none' : 'group-hover:scale-110 transition-transform duration-300'}`} />
          {active && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-inner shadow-white/50"></span>
          )}
        </div>
        <span className={`text-xs mt-1 font-medium transition-all duration-300 ${active ? iconColors[color] : 'text-gray-500'}`}>
          {label}
        </span>
      </a>
    </Link>
  );
}
