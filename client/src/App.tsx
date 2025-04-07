import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Scan from "@/pages/Scan";
import History from "@/pages/History";
import Account from "@/pages/Account";
import AppLayout from "@/components/layout/app-layout";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}

function AppContent() {
  const [location] = useLocation();
  
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scan" component={Scan} />
        <Route path="/history" component={History} />
        <Route path="/account" component={Account} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default App;
