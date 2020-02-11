import axios from 'axios';
import {Entity} from '../../../back/src/entities/entity';

axios.defaults.baseURL = 'http://localhost:3000/entities';

export default {
  getChilds: (path: string, offest = 0, limit = 10, type: string) => {
    return axios.get(`childs${path}/${offest}-${limit}-${type}`);
  },
  updateState: (path: string, newState: boolean) =>
    axios.put(`toggles/${path}`, {state: newState}),
  createEntity: (entity: Partial<Entity>) => axios.post('', entity),
  updateEntity: (path: string, field: string, newVal: string) =>
    axios.put(path, {field, newVal}),
};
