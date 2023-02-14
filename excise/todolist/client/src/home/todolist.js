import React from 'react';

import { Input, DatePicker, Button, Radio, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';

import request from '../utils/request';
import Edit from './edit-form-modal';

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

const DEFAULT_PAGENO = 1;
const DEFAULT_PAGESIZE = 20;

const { Search } = Input;

const Todolist = () => {
  const [list, setList] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState(FILTER_ALL);
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [filteredStatus, setFilteredStatus] = React.useState(FILTER_ALL);
  const [pager, setPager] = React.useState({ pageNo: DEFAULT_PAGENO, pageSize: DEFAULT_PAGESIZE, total: 0 });
  const [open, setOpen] = React.useState('');
  const [todoDetail, setTodoDetail] = React.useState(null);

  const onSubmit = (values) => {
    setOpen('');
    handleUpdate(values);
  };

  const getTodoById = async (id) => {
    const res = await request(
      `http://localhost:8000/list/${id}`,
      JSON.stringify({
        id
      }),
    );
    setTodoDetail(res.data);
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

  const onEdit = (item) => {
    setOpen('edit');
    getTodoById(item.id);
  };

  const handleSearch = async (content) => {
    setSearchText(content);
    getList({ content });
  };

  const handleUpdate = async (params) => {
    const {
      id,
      content,
      status,
      date,
    } = params;
    await request(
      'http://localhost:8000/update',
      JSON.stringify({
        id,
        content,
        status,
        date,
      })
    );
    getList();
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

  const handleAdd = async () => {
    if (!value) {
      alert('content can not be empty!');
      return;
    }
    if (!date) {
      alert('date can not be empty!');
      return;
    };

    await request(
      'http://localhost:8000/add',
      JSON.stringify({
        content: value,
        date,
      })
    );
    getList();
    setValue('');
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
        <Search placeholder="Input search text" onSearch={handleSearch} enterButton allowClear />
      </div>
    );
  };

  const renderAddItem = () => {
    return (
      <div className="add-item-wrapper">
        <Input.Group compact>
          <Input
            style={{
              width: '50%',
              textAlign: 'left',
            }}
            placeholder="Please input your todo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <DatePicker
            style={{
              width: '50%',
            }}
            value={dayjs(new Date(date))}
            onChange={(value) => setDate(value.format('YYYY-MM-DD'))}
          />
          <Button type="primary" onClick={handleAdd}>Add</Button>
        </Input.Group>
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
                      handleUpdate({
                        id: item.id,
                        content: item.content,
                        status: item.status === FILTER_DONE ? FILTER_TODO : FILTER_DONE,
                        date: item.date,
                      });
                    }}
                  />
                  <span>{item.content}</span>
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
        open={open}
        onSubmit={onSubmit}
        onCancel={() => {
          setOpen('');
        }}
      />
    </div>
  );
};

export default Todolist;