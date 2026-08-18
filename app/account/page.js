import { Suspense } from 'react';
import AccountClient from './AccountClient';

export default function AccountPage(){
  return (
    <Suspense fallback={<main><div className="wrap" style={{padding:'60px 0'}}>Mijn LOS! laden...</div></main>}>
      <AccountClient />
    </Suspense>
  );
}
