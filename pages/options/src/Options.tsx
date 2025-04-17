import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import { ComponentPropsWithoutRef } from 'react';
import { ImportExportData } from './components';

const Options = () => {
  const theme = useStorageSuspense(exampleThemeStorage);

  return (
    <div
      className="App-container"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
      }}
    >
      <ImportExportData />
      <ToggleButton>Toggle theme</ToggleButton>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}
    >
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
