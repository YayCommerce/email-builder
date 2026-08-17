import { useContext } from 'react';

import { AddonsContext } from '../addons-provider';

import './navigation.scss';

const ChevronLeft = () => {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 11L1 6L6 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ChevronRight = () => {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 11L6 6L1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function AddonsTableNavigation() {
  const { currentPage, totalPages, setCurrentPage } = useContext(AddonsContext);
  return (
    <div className="yaymail-addons-table-navigation">
      <div
        className={`yaymail-addons-table-navigation__item ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
      >
        <ChevronLeft />
      </div>
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          className={`yaymail-addons-table-navigation__item ${
            currentPage === index + 1 ? 'active' : ''
          }`}
          onClick={() => setCurrentPage(index + 1)}
          key={index}
        >
          <span>{index + 1}</span>
        </div>
      ))}
      <div
        className={`yaymail-addons-table-navigation__item ${
          currentPage === totalPages ? 'disabled' : ''
        }`}
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
      >
        <ChevronRight />
      </div>
    </div>
  );
}
