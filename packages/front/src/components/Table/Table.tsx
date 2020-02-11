import React, {useState} from 'react';
import {Table as T, Switch as S, Icon as I, Button as B} from 'antd';
import {Entity} from '../../../../back/src/entities/entity';
import distanceToNow from 'date-fns/formatDistanceToNow';
import entitiesAPI from 'utils/entityAPI';
import format from 'date-fns/format';
import {CreateEntityModal, EditableCell} from 'components';
import './Table.scss';
import {ColumnProps} from 'antd/lib/table';

export interface EditableColumn<T> extends ColumnProps<T> {
  editable?: boolean;
}

export const Table = ({
  path,
  total,
  limit,
  setOffset,
  setLimit,
  fetchEntities,
  setType,
  entities,
}: {
  entities: Entity[];
  path: string;
  setOffset: Function;
  setLimit: Function;
  total: number;
  offset: number;
  limit: number;
  fetchEntities: Function;
  setType: Function;
}) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const onClickState = async (state: boolean, e: Entity) => {
    await entitiesAPI.updateState(e.path, !state);
    fetchEntities();
  };

  const columns: EditableColumn<Entity>[] = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string, e: Entity) => {
        return type === 'toggle' ? (
          'Toggle'
        ) : (
          <span>
            <I type="folder" /> {e.type[0].toUpperCase() + e.type.slice(1)}
          </span>
        );
      },
      filters: [
        {
          text: 'Group',
          value: 'group',
        },
        {
          text: 'Toggle',
          value: 'toggle',
        },
      ],
      onFilter: (value: string, record: Entity) =>
        record.type.indexOf(value) === 0,

      filterMultiple: false,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, e: Entity) => {
        const el =
          e.type === 'toggle' ? (
            name
          ) : (
            <a
              href={`/${e.path.replace(/\./g, '/')}`}
              onClick={e => e.stopPropagation()}
            >
              {name}
            </a>
          );
        return el;
      },
      sorter: (a: Entity, b: Entity) => (a.name > b.name ? 1 : -1),
      editable: true,
      width: 300,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
      width: 300,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a: Entity, b: Entity) =>
        a.owner > b.owner ? 1 : a.owner < b.owner ? -1 : 0,
    },
    {
      title: 'Last Call',
      key: 'lastCall',
      dataIndex: 'lastCall',
      render: (date: string) => {
        const el = date ? (
          <span> {distanceToNow(new Date(date))} ago</span>
        ) : (
          <span>Never</span>
        );
        return el;
      },
      sorter: (a: Entity, b: Entity) =>
        new Date(a.lastCall) > new Date(b.lastCall)
          ? 1
          : new Date(a.lastCall) < new Date(b.lastCall)
          ? -1
          : 0,
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (date: string) => {
        if (date) return <span>{format(new Date(date), 'dd.MM.yy')}</span>;
      },
      sorter: (a: Entity, b: Entity) =>
        new Date(a.created_at) > new Date(b.created_at)
          ? 1
          : new Date(a.created_at) < new Date(b.created_at)
          ? -1
          : 0,
    },
    {
      title: 'State',
      key: 'state',
      dataIndex: 'state',
      render: (state: boolean, e: Entity) => {
        if (e.type === 'toggle')
          return <S checked={state} onClick={() => onClickState(state, e)}></S>;
        return '';
      },
      //fixed: 'right' as any,
      width: '75px',
    },
  ].map(col => {
    return {
      ...col,
      onCell: record => ({
        record,
        path,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        fetchEntities,
      }),
    };
  });

  return (
    <div>
      <T
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        onChange={(_, filters, __) => {
          if (!filters.type) return;
          const type = filters.type;
          setType(type.length === 0 || type.length > 1 ? 'all' : type[0]);
        }}
        rowKey="path"
        columns={columns}
        dataSource={entities}
        title={() => {
          const nodes: string[] = path.split('.');

          const links: string[] = [];
          nodes.forEach(
            (n, i) =>
              (links[i] = links[i - 1] ? links[i - 1].concat('/', n) : n),
          );

          return (
            <div className="title">
              <div className="title__links">
                {nodes.map((n, i) => (
                  <span key={links[i]}>
                    <a href={links[i]}>{n}</a>
                    {i === nodes.length - 1 ? '' : '/'}
                  </span>
                ))}
              </div>
              <B
                type="primary"
                className="title__add-button"
                onClick={() => showModal()}
              >
                Add
              </B>
            </div>
          );
        }}
        bordered
        rowClassName={() => 'row_editable'}
        pagination={{
          pageSize: limit,
          showSizeChanger: true,
          onShowSizeChange: async (page: number, size) => {
            setLimit(size * page);
          },
          onChange: page => setOffset((page - 1) * limit),
          pageSizeOptions: ['10', '25', '50', '100'],
          showTotal: total => `Total ${total} entities`,
          total,
        }}
      />
      <CreateEntityModal
        visible={visible}
        closeModal={closeModal}
        path={path}
        entities={entities}
        fetchEntities={fetchEntities}
      />
    </div>
  );
};
