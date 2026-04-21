import './globals.css';
import { AppProvider } from '@/components/app-provider';

export const metadata = {
  title: 'BuzzFlow',
  description: 'Simple Business OS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <AppProvider>
          <div className="buzz-root">
            <div className="buzz-layer">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
