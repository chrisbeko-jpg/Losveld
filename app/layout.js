import './globals.css';

export const metadata = {
  title: 'LOS! | Boek. Poort dicht. Hond los.',
  description: 'Vind en boek een privé hondenveld bij jou in de buurt.',
};

export default function RootLayout({ children }) {
  return <html lang="nl"><body>{children}</body></html>;
}