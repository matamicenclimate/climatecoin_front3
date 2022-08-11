import clsx from 'clsx';

import { usePaginationContext } from '@/providers/Pagination.context';

import styles from './Pagination.styles';

export const Pagination = () => {

  const { currentPage, setCurrentPage, totalItems = 0, maxItemsPerPage, maxPagesToDisplay } = usePaginationContext();
  const maxPages = Math.ceil(totalItems / maxItemsPerPage); // Math.ceil round to next integer number
  const pagesToDisplay = maxPages < maxPagesToDisplay ? maxPages : maxPagesToDisplay;

  function changePage(e: React.MouseEvent<HTMLButtonElement>) {
    setCurrentPage(parseInt(e.currentTarget.value));
  }

  function goNext() {
    setCurrentPage(currentPage + 1 < maxPages ? currentPage + 1 : maxPages);
  }

  function goPrevious() {
    setCurrentPage(currentPage - 1 || 1);
  }

  function goFirst() {
    setCurrentPage(1);
  }

  function goLast() {
    setCurrentPage(maxPages);
  }

  let firstPageToDisplay;
  const pagesToNavigate = Math.floor(pagesToDisplay / 2); // Math.ceil round to previous integer number
  const blockPreviousPages = currentPage - pagesToNavigate <= 1;
  const blockNextPages = currentPage + pagesToNavigate >= maxPages;
  if (blockPreviousPages) {
    firstPageToDisplay = 1;
  } else if(blockNextPages) {
    firstPageToDisplay = maxPages - pagesToDisplay + 1;
  } else {
    firstPageToDisplay = currentPage - pagesToNavigate;
  }

  const buttons = [];
  for (let i = firstPageToDisplay; i < pagesToDisplay + firstPageToDisplay; i++) {
    const isActive = currentPage == i && styles.active;
    buttons.push(<button id={ `page${ i }` } value={ i } onClick={ changePage } className={clsx(styles.button, isActive)}>{ i }</button>)
  }

  return (
    <div hidden={ totalItems === 0 } className={styles.pagination}>
      <button disabled={ currentPage === 1 } onClick={ goFirst } className={styles.button}>&laquo;</button>
      <button disabled={ currentPage === 1 } onClick={ goPrevious } className={styles.button}>&lt;</button>
      {
        buttons.map((button) => button)
      }
      <button disabled={ currentPage === maxPages } onClick={ goNext } className={styles.button}>&gt;</button>
      <button disabled={ currentPage === maxPages } onClick={ goLast } className={styles.button}>&raquo;</button>
    </div>
  )
}
