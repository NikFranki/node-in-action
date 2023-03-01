import React from 'react';

import request from '../utils/request';
import useFolders from '../hooks/use-folders';
import { DEFAULT_PAGENO, DEFAULT_PAGESIZE } from '../constant';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const { folders, onFetchFolders } = useFolders();
  const [list, setList] = React.useState([]);
  const [pager, setPager] = React.useState({ pageNo: DEFAULT_PAGENO, pageSize: DEFAULT_PAGESIZE, total: 0 });
  const [folderRootId, setFolderRootId] = React.useState(1); // 1 mean point to default folder's todolist

  React.useEffect(() => {
    onUserInfoChange();
  }, []);

  const onUserInfoChange = () => {
    request(
      'http://localhost:8000/user/searchUser',
      JSON.stringify({})
    ).then((user) => {
      setUserInfo(user.data || {});
    });
  };

  const onFetchTodolist = async (params) => {
    params = {
      root_id: folderRootId,
      ...params,
      pageNo: DEFAULT_PAGENO,
      pageSize: DEFAULT_PAGESIZE,
    };

    const res = await request(
      'http://localhost:8000/list',
      JSON.stringify(params),
    );
    setList(res.list);
    setPager({
      pageNo: res.pageNo,
      pageSize: res.pageSize,
      total: res.total,
    });
  };

  const onSetFolderRootId = (folderRootId) => {
    setFolderRootId(folderRootId);
  };

  const values = {
    userInfo,
    folders,
    list,
    pager,
    onUserInfoChange,
    onFetchFolders,
    onFetchTodolist,
    onSetFolderRootId,
  };

  return values;
};

export default useGlobalContextDispatch;
