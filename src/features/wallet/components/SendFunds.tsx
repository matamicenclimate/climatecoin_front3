import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dl, DlItem } from '@/componentes/DescriptionList';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { useCurrencyContext } from '@/providers/Currency.context';
import { useWalletContext } from '@/providers/Wallet.context';

import { Account, ButtonProps, DialogDataProps } from '../types';

type SendFundsProps = {
  account: Account;
  className?: string;
  type: 'add' | 'send';
};

export function SendFunds({ account, className, type }: SendFundsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { climatecoinBalance } = useWalletContext();
  const { formatToCC } = useCurrencyContext();

  const send: DialogDataProps = {
    acceptLabel: t('Wallet.funds.dialog.send.acceptLabel'),
    title: t('Wallet.funds.dialog.send.title'),
    claim: t('Wallet.funds.dialog.send.claim'),
    accentColor: 'text-primary-brightGreen',
    button: {
      variant: 'grey',
      onClick: () => setIsOpen(true),
      label: t('Wallet.funds.dialog.send.title'),
    },
  };

  const add: DialogDataProps = {
    acceptLabel: t('Wallet.funds.dialog.add.acceptLabel'),
    title: t('Wallet.funds.dialog.add.title'),
    claim: t('Wallet.funds.dialog.add.claim'),
    accentColor: 'text-primary-brightGreen',
    button: {
      variant: 'grey',
      onClick: () => setIsOpen(true),
      label: t('Wallet.funds.dialog.add.title'),
    },
  };

  const DialogData = { add, send };

  const renderButton = ({ variant, onClick, label }: ButtonProps) => {
    return (
      <Button type="button" className="bg-neutral-7" variant={variant} size="sm" onClick={onClick}>
        {label}
      </Button>
    );
  };

  return (
    <>
      {renderButton(DialogData[type].button)}
      <Dialog
        size="xs"
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        acceptLabel={DialogData[type].acceptLabel}
        cancelLabel={t('Wallet.action.dialog.cancel')}
        onCancel={() => setIsOpen(!isOpen)}
        title={DialogData[type].title}
        claim={DialogData[type].claim}
      >
        <Dl wrapperClassName={'mb-8'}>
          <DlItem
            dt={'Your Climatecoins'}
            dd={<span> {formatToCC(climatecoinBalance())} CC</span>}
          />
          <DlItem
            dt={t('Wallet.action.dialog.amount')}
            dd={<input type="text" id="name" name="name" className="w-full border-2" required />}
            ddClassNames="text-primary-brightGreen"
          />
          <hr className="col-span-2" />

          <DlItem
            fullWidth
            dt={type === 'send' ? t('Wallet.action.dialog.to') : t('Wallet.action.dialog.from')}
            dd={<textarea id="name" name="name" maxLength={70} className="w-full border-2" />}
          />
        </Dl>
      </Dialog>
    </>
  );
}
