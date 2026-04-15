import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import NavBar from '@/components/NavBar';
import AuthSessionProvider from '@/components/SessionProvider';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata = {
  title: 'ProductsHub',
  description: 'A Next.js CRUD app with MongoDB & NextAuth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <NavBar />
          <BootstrapClient />
          <main className="container py-4">{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
