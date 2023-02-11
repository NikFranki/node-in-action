import React from 'react';

import { Input, DatePicker, Button, Radio, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';

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

  const getList = (
    status = filteredStatus,
    content = searchText,
    pageNo = pager.pageNo,
    pageSize = pager.pageSize,
  ) => {
    fetch(
      'http://localhost:8000/list',
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          content,
          pageNo,
          pageSize,
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        const { list, pageNo, pageSize, total } = res;
        setList(list);
        setPager({
          pageNo,
          pageSize,
          total,
        });
      });
  };

  React.useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (value) => {
    setSearchText(value);
    getList(filteredStatus, value);
  };

  const handleUpdate = (id, content, status, date) => {
    fetch(
      'http://localhost:8000/update',
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          content,
          status,
          date,
        })
      }
    )
      .then(() => {
        getList();
      });
  };

  const handleDelete = (id) => {
    fetch(
      'http://localhost:8000/delete',
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
        })
      }
    )
      .then(() => {
        getList();
      });
  };

  const handleAdd = () => {
    if (!value) {
      alert('content can not be empty!');
      return;
    }
    if (!date) {
      alert('date can not be empty!');
      return;
    };

    fetch(
      'http://localhost:8000/add',
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: value,
          date,
        })
      }
    )
      .then(() => {
        getList();
        setValue('');
      })
  };

  const handleFilter = (e) => {
    const status = e.target.value;
    setStatus(status);
    setFilteredStatus(status);
    getList(status, searchText, DEFAULT_PAGENO, DEFAULT_PAGESIZE);
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
          next={() => getList(filteredStatus, searchText, pager.pageNo, (pager.pageNo + 1) * pager.pageSize)}
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
                  <Button type="default" key="list-loadmore-edit">edit</Button>,
                  <Button type="primary" danger key="list-loadmore-more" onClick={() => handleDelete(item.id)}>delete</Button>
                ]}
              >
                <div className="ant-list-item-content">
                  <Radio
                    name="check"
                    checked={item.status === FILTER_DONE}
                    onClick={(e) => {
                      handleUpdate(item.id, item.content, item.status === FILTER_DONE ? FILTER_TODO : FILTER_DONE, item.date)
                    }}
                  />
                  <span>{item.content}</span>
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
    </div>
  );
};

export default Todolist;