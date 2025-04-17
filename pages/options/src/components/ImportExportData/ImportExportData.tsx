import { useStorageSuspense } from '@chrome-extension-boilerplate/shared';
import { collectionsStorage } from '@chrome-extension-boilerplate/storage';

import type { ChangeEvent } from 'react';

export const ImportExportData = () => {
  const collections = useStorageSuspense(collectionsStorage);
  console.log(collections);

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('import');
    const { target } = e;
    const files = target?.files;

    if (files) {
      const reader = new FileReader();

      reader.onload = event => {
        if (event.target && event.target.result) {
          try {
            const parsedData = JSON.parse(event.target.result);
            // setJsonData(parsedData);
            collectionsStorage.set(parsedData);
            console.log(parsedData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      };

      reader.readAsText(files[0]);
    }
  };

  const handleExport = () => {
    // const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storageObj));

    // const collectionData = JSON.stringify(collections);
    // const blob = new Blob([collectionData], { type: 'text/plain' });
    // const url = URL.createObjectURL(blob);

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(collections))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'tab-manager-data.json';

    link.click();
  };

  return (
    <div className="text-base text-white flex flex-col gap-4">
      <label htmlFor="import">Import:</label>
      <input type="file" id="import" name="import" accept="application/JSON" onChange={handleImport} />
      <button className="bg-white text-black" onClick={handleExport}>
        Export
      </button>
    </div>
  );
};
