import React, {useState, useEffect, useCallback} from 'react';
import './App.scss';
import {Table} from 'components';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import entitiesAPI from 'utils/entityAPI';
import {Entity} from '../../back/src/entities/entity';

const App = () => {
  const slashToDot = (path: string) => {
    return path[0] + path.substr(1).replace(/\//g, '.');
  };

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [entities, setEntities] = useState([] as Entity[]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState('all');
  const [path, setPath] = useState('');

  const fetchEntities = useCallback(async () => {
    if (path.length < 2) return;
    const [entities, total] = (
      await entitiesAPI.getChilds(path, offset, limit, type)
    ).data as [Entity[], number];

    setTotal(total);
    setEntities(entities);
  }, [path, offset, limit, type]);

  useEffect(() => setPath(slashToDot(window.location.pathname)), []);

  useEffect(() => {
    fetchEntities();
  }, [limit, offset, path, fetchEntities, type]);

  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/root" />
      </Route>
      <Route path="/root">
        <div className="container">
          <Table
            entities={entities}
            path={path}
            total={total}
            offset={offset}
            limit={limit}
            setOffset={setOffset}
            setLimit={setLimit}
            fetchEntities={fetchEntities}
            setType={setType}
          />
        </div>
      </Route>
    </Router>
  );
};

export default App;
