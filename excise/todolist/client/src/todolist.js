import React from 'react';
import {
  Link,
  Outlet,
} from "react-router-dom";

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

const DEFAULT_PAGENO = 1;
const DEFAULT_PAGESIZE = 10;

const Todolist = () => {
  const [list, setList] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [jumpno, setJumpno] = React.useState('');
  const [date, setDate] = React.useState('');
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
        mode: 'cors',
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

  const handleSearch = () => {
    getList();
  };

  const handleUpdate = (id, content, status, date) => {
    fetch(
      'http://localhost:8000/update',
      {
        method: 'post',
        mode: 'cors',
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
        mode: 'cors',
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
        mode: 'cors',
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
        setDate('');
      })
  };

  const handleFilter = (status) => {
    setFilteredStatus(status);
    getList(status, searchText, DEFAULT_PAGENO, DEFAULT_PAGESIZE);
  };

  const handlePageNoJump = () => {
    if (!jumpno) {
      alert('jumpno can not be empty!');
      return;
    }
    const jumpnoNumeric = +jumpno;
    if (isNaN(jumpnoNumeric)) {
      alert('Must be number!');
      return;
    }

    setJumpno('');
    getList(filteredStatus, searchText, jumpnoNumeric);
  };

  const handlePagination = (type) => {
    getList(filteredStatus, searchText, type === 'prev' ? pager.pageNo - 1 : pager.pageNo + 1);
  };

  const renderSearch = () => {
    return (
      <div className="search-wrapper">
        <label>Search</label>
        <input type="text" name="search" placeholder="please input what you want" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <button onClick={handleSearch}>Confirm</button>
      </div>
    );
  };

  const renderAddItem = () => {
    return (
      <div className="add-item-wrapper">
        <label>Add</label>
        <input type="text" value={value} placeholder="please input your todo" onChange={(e) => setValue(e.target.value)} />
        <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={handleAdd}>Confirm</button>
      </div>
    );
  };

  const renderList = () => {
    return (
      <ul className="list-wrapper">
        {
          list.map(item => {
            const isFinished = item.status === FILTER_DONE;

            return (
              <li className={`list-item ${isFinished ? 'active' : 'normal'}`} key={item.id}>
                <input
                  className="check"
                  name="check"
                  type="checkbox"
                  checked={isFinished}
                  onChange={(e) => {
                    handleUpdate(item.id, item.content, isFinished ? FILTER_TODO : FILTER_DONE, item.date)
                  }}
                />
                <span>{item.content}</span>
                {' '}
                <span>{item.date}</span>
                <button onClick={() => handleDelete(item.id)}>DELETE</button>
              </li>
            );
          })
        }
      </ul>
    );
  };

  const renderFilter = () => {
    const cls = (sts) => `filter-menu-item ${filteredStatus === sts ? 'active' : 'normal'}`;
    return (
      <div className="filter-menu-wrapper">
        <span className={cls(FILTER_ALL)} onClick={() => handleFilter(FILTER_ALL)}>ALL</span>
        <span className={cls(FILTER_DONE)} onClick={() => handleFilter(FILTER_DONE)}>DONE</span>
        <span className={cls(FILTER_TODO)} onClick={() => handleFilter(FILTER_TODO)}>TODO</span>
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <div className="pagination-wrapper">
        {pager.pageNo > 1 && <button className="btn prev" onClick={() => handlePagination('prev')}>prev</button>}
        {pager.pageNo < Math.ceil(pager.total / pager.pageSize) && <button className="btn next" onClick={() => handlePagination('next')}>next</button>}
        <input type="text" value={jumpno} name="jumpno" onChange={(e) => setJumpno(e.target.value)} />
        <button className="btn jump" onClick={handlePageNoJump}>jump</button>
        <span className="indicator">{`${pager.pageNo}/${Math.ceil(pager.total / pager.pageSize)}`}</span>
      </div>
    );
  };

  return (
    <div className="todolist-wrapper">
      <h1>TODOLIST</h1>
      {renderSearch()}
      {renderAddItem()}
      {renderList()}
      {renderFilter()}
      {renderPagination()}
      <div>
        <Link to={`contacts/1`}>Contacts</Link>
        <Outlet />
      </div>
    </div>
  );
};

export default Todolist;