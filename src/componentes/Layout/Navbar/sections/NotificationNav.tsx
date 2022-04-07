import { useTranslation } from 'react-i18next';
import Popover from '@/componentes/Popover/Popover';
import { Icon } from '@/componentes/Icon/Icon';
import { getNotifications } from '@/componentes/Layout/Navbar/api/getNotifications';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { differenceInDays, differenceInHours, differenceInMinutes, parseJSON } from 'date-fns';
import { Link } from '@/componentes/Elements/Link/Link';
import clsx from 'clsx';
import { Button } from '@/componentes/Elements/Button/Button';

const modelToUrl: Record<string, string> = {
  'carbon-documents': 'documents',
};

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: React.ReactChildren) => React.ReactElement;
  children: any;
}) => (condition ? wrapper(children) : children);

export const NotificationNav = () => {
  const notifications = getNotifications();
  const { t } = useTranslation();
  const renderNotifications = () => {
    if (notifications.data) {
      return (
        <div>
          <ul className="space-y-2">
            {notifications.data.map((notification) => {
              const getDate = () => {
                if (Math.abs(differenceInDays(parseJSON(notification.createdAt), new Date())) > 0) {
                  return `${Math.abs(
                    differenceInDays(parseJSON(notification.createdAt), new Date())
                  )} days`;
                } else if (
                  Math.abs(differenceInHours(parseJSON(notification.createdAt), new Date())) > 0
                ) {
                  return `${Math.abs(
                    differenceInHours(parseJSON(notification.createdAt), new Date())
                  )} hours`;
                }
                return `${Math.abs(
                  differenceInMinutes(parseJSON(notification.createdAt), new Date())
                )} min`;
              };

              return (
                <li key={notification._id} className="flex items-center space-x-2 text-sm">
                  <ConditionalWrapper
                    condition={!!notification.model}
                    wrapper={(children) => (
                      <Link
                        to={`/${modelToUrl[notification.model as string]}/${notification.model_id}`}
                        className="flex w-full items-center space-x-2 text-neutral-4 no-underline hover:underline"
                      >
                        {children}
                      </Link>
                    )}
                  >
                    <div>
                      <div
                        className={clsx(
                          ' h-2 w-2 rounded-full',
                          notification.is_read ? 'bg-neutral-5' : 'bg-primary-green'
                        )}
                      />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex w-full justify-between">
                        <div className="font-medium">{notification.title}</div>
                        <div className="break-normal text-xs">{getDate()}</div>
                      </div>
                      <div className="text-xs text-neutral-5">{notification.description}</div>
                    </div>
                  </ConditionalWrapper>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    if (notifications.error instanceof Error) {
      return <>{('An error has occurred: ' + notifications.error.message) as string}</>;
    }
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
      </div>
    );
  };

  return (
    <div className="flex items-center">
      <Popover>
        <Popover.Button>
          <button className="relative flex p-1">
            <Icon id="bell-line" className="h-7 w-7" />
            {notifications?.data
              ? notifications?.data?.filter((i) => !i.is_read).length > 0 && (
                  <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary-green" />
                )
              : null}
          </button>
        </Popover.Button>
        <Popover.Panel>
          <div className="w-80 space-y-3">
            <div className="flex justify-between text-xs text-neutral-4">
              <div>{t('components.Navbar.notifications.title')}</div>
              <div>
                <button className="text-neutral-5">clear</button>
              </div>
            </div>
            {renderNotifications()}
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
};