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
      name: "默认文件夹",
      parent_id: 0,
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