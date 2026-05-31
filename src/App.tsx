import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { ReadScreen } from '@/features/read/read-screen';
import { LibraryScreen } from '@/features/library/library-screen';
import { ProgressScreen } from '@/features/progress/progress-screen';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ReadScreen />} />
          <Route path="library" element={<LibraryScreen />} />
          <Route path="progress" element={<ProgressScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
