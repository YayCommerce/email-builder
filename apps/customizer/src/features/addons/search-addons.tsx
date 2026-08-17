import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Input, InputRef } from 'antd';

import { AddonsContext } from './addons-provider';

export default function SearchAddons() {
  const { setSearchText, isFetching } = useContext(AddonsContext);
  const [value, setValue] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchText(value);
    }, 200);
    return () => clearTimeout(timeout);
  }, [value, setSearchText]);
  const inputRef = useRef<InputRef>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.input?.focus();
    }
  }, [isFetching]);
  return (
    <div className="yaymail-addons-search">
      <Input
        placeholder="Search addons"
        allowClear
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isFetching}
        ref={inputRef}
        suffix={
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.6922 13.8L17 17M15.9333 8.46667C15.9333 12.5904 12.5904 15.9333 8.46667 15.9333C4.34294 15.9333 1 12.5904 1 8.46667C1 4.34294 4.34294 1 8.46667 1C12.5904 1 15.9333 4.34294 15.9333 8.46667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      />
    </div>
  );
}
