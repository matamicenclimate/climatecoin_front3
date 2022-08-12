import { useState } from 'react';

import { Icon } from '@/componentes/Icon/Icon';

type CoinListProps = {
  coinsList: Array<CoinProps>;
};

type CoinProps = {
  label: string;
  value: number | string;
};

export const CoinsList = ({ coinsList }: CoinListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-1/3 flex-col items-center">
      <ul className="flex w-full flex-col space-y-4">
        {coinsList.slice(0, 3).map((coin: CoinProps) => {
          return (
            <div key={coin.label} className="flex w-full justify-between">
              <li className="text-neutral-4">{coin.label}</li>
              <li>{coin.value}</li>
            </div>
          );
        })}
        {isOpen === true &&
          coinsList.slice(3, coinsList.length).map((coin: CoinProps) => {
            return (
              <div key={coin.label} className="flex w-full justify-between">
                <li className="text-neutral-4">{coin.label}</li>
                <li>{coin.value}</li>
              </div>
            );
          })}
      </ul>
      {coinsList.length > 3 && (
        <button onClick={() => setIsOpen(!isOpen)}>
          <Icon
            id={isOpen === true ? 'arrow-up-simple-line' : 'arrow-down-simple-line'}
            className="h-9 w-9"
          />
        </button>
      )}
    </div>
  );
};
