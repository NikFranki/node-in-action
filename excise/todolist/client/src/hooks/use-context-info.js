import React from 'react';

import TodolistContext from '../utils/todolist-context';

const useContextInfo = () => {
  return React.useContext(TodolistContext);
};

export default useContextInfo;