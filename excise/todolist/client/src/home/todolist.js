import React from 'react';

import { Input, Button, Radio, Divider, List, Skeleton, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import request from '../utils/request';
import useContextInfo from '../hooks/use-context-info';
import Edit from './edit-form-modal';

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

const DEFAULT_PAGENO = 1;
const DEFAULT_PAGESIZE = 20;

const { Search } = Input;

const Todolist = () => {
  const [list, setList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState(FILTER_ALL);
  const [filteredStatus, setFilteredStatus] = React.useState(FILTER_ALL);
  const [pager, setPager] = React.useState({ pageNo: DEFAULT_PAGENO, pageSize: DEFAULT_PAGESIZE, total: 0 });
  const [mode, setMode] = React.useState('');
  const [todoDetail, setTodoDetail] = React.useState({});

  const { onFetchFolders } = useContextInfo();

  const getTodoById = async (id) => {
    const res = await request(
      `http://localhost:8000/list/${id}`,
      JSON.stringify({
        id
      }),
    );
    return res.data;
  };

  const getList = async (params = {}) => {
    const {
      status = filteredStatus,
      content = searchText,
      pageNo = pager.pageNo,
      pageSize = pager.pageSize,
    } = params;
    const res = await request(
      'http://localhost:8000/list',
      JSON.stringify({
        status,
        content,
        pageNo,
        pageSize,
      }),
    );
    setList(res.list);
    setPager({
      pageNo: res.pageNo,
      pageSize: res.pageSize,
      total: res.total,
    });
  };

  React.useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (mode, values) => {
    setMode('');
    setTodoDetail({});

    if (!values.content) {
      alert('content can not be empty!');
      return;
    }
    if (!values.date) {
      alert('date can not be empty!');
      return;
    };

    values.position_id = Array.isArray(values.position_id) && values.position_id.length > 0 ? values.position_id : [1];
    values.folder_id = values.position_id[values.position_id.length - 1];

    await request(
      `http://localhost:8000/${mode === 'add' ? 'add' : 'update'}`,
      JSON.stringify(values),
    );
    message.success(`${mode[0].toUpperCase()}${mode.slice(1).toLowerCase()} successfully`);
    getList();
    onFetchFolders();
  };

  const onAdd = () => {
    setMode('add');
  };

  const onEdit = async (item) => {
    setMode('edit');
    const res = await getTodoById(item.id);
    setTodoDetail(res);
  };

  const handleSearch = async (content) => {
    setSearchText(content);
    getList({ content });
  };

  const handleDelete = async (id) => {
    await request(
      'http://localhost:8000/delete',
      JSON.stringify({
        id,
      })
    );
    getList();
  };

  const handleFilter = (e) => {
    const status = e.target.value;
    setStatus(status);
    setFilteredStatus(status);
    getList({
      status,
      pageNo: DEFAULT_PAGENO,
      pageSize: DEFAULT_PAGESIZE,
    });
  };

  const renderSearch = () => {
    return (
      <div className="search-wrapper">
        <Search placeholder="Area search" onSearch={handleSearch} enterButton allowClear />
      </div>
    );
  };

  const renderAddItem = () => {
    return (
      <div className="add-item-wrapper">
        <span className="prompt">Try it. </span><Button type="primary" onClick={onAdd}>Add todo</Button>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div
        id="scrollableDiv"
        style={{
          height: 'calc(100vh - 401px)',
          overflow: 'auto',
          margin: '30px 80px',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={list.length}
          next={() => {
            getList({
              pageSize: (pager.pageNo + 1) * pager.pageSize
            });
          }}
          hasMore={list.length < pager.total}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                key={item.email}
                actions={[
                  <Button type="default" key="list-loadmore-edit" onClick={() => onEdit(item)}>edit</Button>,
                  <Button type="primary" danger key="list-loadmore-more" onClick={() => handleDelete(item.id)}>delete</Button>
                ]}
              >
                <div className="ant-list-item-content">
                  <Radio
                    name="check"
                    checked={item.status === FILTER_DONE}
                    onClick={() => {
                      onSubmit('edit', {
                        ...item,
                        status: item.status === FILTER_DONE ? FILTER_TODO : FILTER_DONE,
                      });
                    }}
                  />
                  <span>{item.content}</span>
                  <span className="folder">belongs with {item.folder_name}</span>
                  <span className="author">post by {item.username || 'franki'}</span>
                  <span className="date">{item.date}</span>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    );
  };

  const renderFilter = () => {
    return (
      <Radio.Group className="filter-menu-wrapper" value={status} onChange={handleFilter}>
        <Radio.Button value={FILTER_ALL}>ALL</Radio.Button>
        <Radio.Button value={FILTER_DONE}>DONE</Radio.Button>
        <Radio.Button value={FILTER_TODO}>TODO</Radio.Button>
      </Radio.Group>
    );
  };

  return (
    <div className="todolist-wrapper">
      {renderSearch()}
      {renderAddItem()}
      {renderList()}
      {renderFilter()}
      <Edit
        todoDetail={todoDetail}
        mode={mode}
        onSubmit={onSubmit}
        onCancel={() => {
          setMode('');
        }}
      />
    </div>
  );
};

export default Todolist;