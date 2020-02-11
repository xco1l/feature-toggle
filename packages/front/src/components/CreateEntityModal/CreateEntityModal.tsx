import React, {useState} from 'react';
import {Modal, Input, Select, Radio} from 'antd';
import {entityAPI} from 'utils';
import {EntityType} from '../../../../back/src/entities/entity';
import {Entity} from '../../../../back/src/entities/entity';

const TestUser = {
  id: 'someString',
  email: 'test@test.ru',
  name: 'Test',
};

export const CreateEntityModal = ({
  path,
  visible,
  closeModal,
  fetchEntities,
}: {
  path: string;
  visible: boolean;
  closeModal: Function;
  entities: Entity[];
  fetchEntities: Function;
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('' as EntityType);
  const [disabled, setDisabled] = useState(true);
  const [selectVal, setSelectVal] = useState(undefined);
  const [description, setDescription] = useState('');
  const [state, setState] = useState(false);
  const [confirmLoading, setLoading] = useState(false);

  const {Option} = Select;
  const {TextArea} = Input;

  const onOK = async () => {
    setLoading(true);
    await entityAPI.createEntity({
      path: path.slice(1),
      owner: TestUser.email,
      type,
      description,
      state,
      name,
    });
    setLoading(false);
    fetchEntities();
  };
  return (
    <Modal
      title="Add new entity"
      visible={visible}
      onCancel={() => {
        closeModal();
        setName('');
        setType('' as EntityType);
        setDisabled(true);
        setSelectVal(undefined);
      }}
      onOk={onOK}
      confirmLoading={confirmLoading}
    >
      <Select
        onSelect={
          ((type: EntityType, {props: {children}}: any) => {
            setType(type);
            setDisabled(false);
            setSelectVal(children);
          }) as any
        }
        placeholder="Select type of entity"
        style={{
          width: 200,
          marginBottom: 20,
        }}
        value={selectVal}
      >
        <Option value="toggle">Toggle</Option>
        <Option value="group">Group</Option>
        <Option value="project">Project</Option>
      </Select>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        disabled={disabled}
        style={{
          marginBottom: 20,
        }}
      ></Input>
      <TextArea
        placeholder="Description (optional)"
        disabled={disabled}
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{
          marginBottom: 20,
        }}
      ></TextArea>
      <div
        style={{
          display: type === 'toggle' ? 'block' : 'none',
        }}
      >
        <p>Initial state:</p>
        <Radio.Group
          onChange={e => setState(e.target.value)}
          defaultValue={false}
        >
          <Radio.Button value={true}>On</Radio.Button>
          <Radio.Button value={false}>Off</Radio.Button>
        </Radio.Group>
      </div>
    </Modal>
  );
};
