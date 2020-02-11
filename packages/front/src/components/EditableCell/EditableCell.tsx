import React, {useState, useEffect, useRef, FunctionComponent} from 'react';
import {Entity} from '../../../../back/src/entities/entity';
import {entityAPI} from 'utils';
import './EditableCell.scss';

export const EditableCell: FunctionComponent<EditableCellProps> = ({
  children,
  editable,
  dataIndex,
  title,
  record,
  path,
  fetchEntities,
  ...other
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState((record as any)[dataIndex]);
  const inputEl = useRef(null);

  const save = async () => {
    await entityAPI.updateEntity(record.path, dataIndex, value);
    fetchEntities();
  };

  const onEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    save();
  };

  useEffect(() => {
    if (editing) (inputEl.current as any).focus();
  }, [editing]);

  return (
    <td {...other}>
      <div className={`cell${editable ? '_editable' : ''}`}>
        {!editable ? (
          children
        ) : !editing ? (
          <div
            className="cell_editable-wrap"
            onClick={() => {
              setEditing(true);
            }}
          >
            {children}
          </div>
        ) : (
          <input
            className="cell_editable__input"
            type="text"
            ref={inputEl}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onEnterDown}
            onBlur={() => save()}
          />
        )}
      </div>
    </td>
  );
};

export interface EditableCellProps {
  editable?: boolean;
  dataIndex: string;
  title: string;
  record: Entity;
  path: string;
  fetchEntities: Function;
}
