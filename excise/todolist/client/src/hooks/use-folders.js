import React from 'react';

import request from '../utils/request';
import { BASE_URL } from '../config/url';

const useFolders = () => {
  const [folders, setFolders] = React.useState([]);

  const fetchFolders = async () => {
    const res = await request(
      `${BASE_URL}/folders/list`,
    );
    const newData = res.list;
    newData.unshift({
      id: 0,
      name: "default",
      parent_id: null,
    });
    setFolders(newData);
  };

  React.useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    onFetchFolders: fetchFolders,
  };
};

export default useFolders;