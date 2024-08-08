import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { createClient } from '@supabase/supabase-js'
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const queryClient = new QueryClient();
const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE')

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={<PrivateRoute>{page}</PrivateRoute>} />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
