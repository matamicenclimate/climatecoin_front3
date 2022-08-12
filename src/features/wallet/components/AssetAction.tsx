import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dl, DlItem } from '@/componentes/DescriptionList';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { useCurrencyContext } from '@/providers/Currency.context';

import { Asset, ButtonProps, DialogDataProps } from '../types';

type AssetActionProps = {
  asset: Asset;
  address: string;
  disabled: boolean;
  type: 'send' | 'remove';
  className?: string;
};

export function AssetAction({ asset, address, disabled, className, type }: AssetActionProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { formatToCC } = useCurrencyContext();

  const send: DialogDataProps = {
    acceptLabel: t('Wallet.action.dialog.send.acceptLabel'),
    title: t('Wallet.action.dialog.send.title'),
    claim: t('Wallet.action.dialog.send.claim'),
    accentColor: 'text-primary-brightGreen',
    button: {
      variant: 'grey',
      onClick: () => setIsOpen(true),
      label: t('Wallet.action.dialog.send.title'),
    },
  };

  const remove: DialogDataProps = {
    acceptLabel: t('Wallet.action.dialog.delete.acceptLabel'),
    title: t('Wallet.action.dialog.delete.title'),
    claim: t('Wallet.action.dialog.delete.claim'),
    accentColor: 'text-primary-red',
    button: {
      variant: 'danger',
      onClick: () => setIsOpen(true),
      label: t('Wallet.action.dialog.delete.title'),
    },
  };

  const DialogData = { send, remove };

  const renderSendTo = () => {
    if (type === 'send') {
      return (
        <>
          <hr className="col-span-2" />
          <DlItem
            fullWidth
            dt={t('Wallet.action.dialog.to')}
            dd={<textarea id="name" name="name" maxLength={70} className="w-full border-2" />}
          />
        </>
      );
    }
    return '';
  };

  const renderButton = ({ variant, onClick, label }: ButtonProps) => {
    return (
      <Button
        type="button"
        className="bg-neutral-7"
        variant={variant}
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  };

  return (
    <>
      <div className={className}>{renderButton(DialogData[type].button)}</div>
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
            dt={t('Wallet.action.dialog.from')}
            dd={`${address?.slice(0, 30)}...${address?.slice(-3)}`}
          />

          <hr className="col-span-2" />
          <DlItem
            dt={t('Wallet.action.dialog.yourAsset')}
            dd={asset['asset-id'].toString()}
            ddClassNames={DialogData[type].accentColor}
          />

          <DlItem
            dt={t('Wallet.action.dialog.amount')}
            dd={formatToCC(asset.amount)}
            ddClassNames={DialogData[type].accentColor}
          />

          {renderSendTo()}
        </Dl>
      </Dialog>
    </>
  );
}
