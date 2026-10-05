// src/App.jsx
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { InterviewProvider } from '@/context/InterviewContext';
import AppRouter from '@/routes/AppRouter';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <AppRouter />
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
