import { ReactNode } from 'react';

type LinkProps = {
  href: string;
  children: ReactNode;
};

export const Link = ({ href, children }: LinkProps) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    chrome.tabs.create({ url: href });
  };

  const handleAuxClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log(e.button);
    // handle middle mouse click
    if (e.button === 1) {
      chrome.tabs.create({ url: href, active: false });
    }
  };

  return (
    <a onClick={handleLinkClick} onAuxClick={handleAuxClick}>
      {children}
    </a>
  );
};
