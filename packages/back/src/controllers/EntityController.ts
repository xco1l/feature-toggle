import {inject} from '@loopback/context';
import {
  post,
  requestBody,
  getModelSchemaRef,
  get,
  put,
  param,
} from '@loopback/rest';
import {EntityRepository} from '../repositories';
import {Entity, EntityType} from '../entities/entity';
import {Permissions} from '../entities/permissions';

export class ToggleController {
  constructor(
    @inject('repositories.ToggleRepository')
    private entityRepo: EntityRepository,
  ) {}

  @post('/entities', {
    responses: {
      '200': {
        description: 'New Entity instance',
        content: {'application/json': {schema: {'x-ts-type': Entity}}},
      },
    },
  })
  async createEntity(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entity, {
            title: 'NewEntity',
            exclude: ['id'],
          }),
        },
      },
    })
    data: Omit<Entity, 'id'>,
  ) {
    console.log(data);
    if (await this.entityRepo.findByPath(data.path + `.${data.name}`))
      return {message: 'Entity is already exist'};

    switch (data.type) {
      case EntityType.PROJECT: {
        const root = await this.entityRepo.findByPath('root');
        data.parentId = root.id;
        data.path = `root.${data.name.toLowerCase()}`;
        break;
      }
      case EntityType.TOGGLE: {
        const parent = await this.entityRepo.findByPath(data.path);
        data.parentId = parent.id;
        data.path += `.${data.name.toLowerCase()}`;
        data.state = data.state || false;
        break;
      }
      case EntityType.GROUP: {
        const parent = await this.entityRepo.findByPath(data.path);
        data.parentId = parent.id;
        data.path += `.${data.name}`;
        break;
      }
    }
    const entity = {...new Entity(), ...data};
    console.log(entity);
    const t = await this.entityRepo.save(entity);
    return t;
  }

  @put('/entities/toggles/{path}', {
    responses: {
      '200': {
        description: "Update toggle's state",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {message: 'string', newState: 'boolean'},
            },
          },
        },
      },
    },
  })
  async updateState(
    @requestBody()
    newState: {state: boolean},
    @param.path.string('path') path: string,
  ) {
    const entity = await this.entityRepo.findByPath(path);
    if (entity.type !== EntityType.TOGGLE)
      return {message: "Error, can't change state of non-toggle entity"};
    entity.state = newState.state;
    entity.lastCall = new Date();
    return await this.entityRepo.save(entity);
  }

  @put('/entities/{path}', {
    responses: {
      '200': {
        description: 'Update entity',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {message: 'string', newState: 'boolean'},
            },
          },
        },
      },
    },
  })
  async updateEntity(
    @requestBody()
    {field, newVal}: {field?: string; newVal?: string},
    @param.path.string('path') path: string,
  ) {
    let entity: Entity | null;
    switch (field) {
      case 'name': {
        entity = await this.entityRepo.updateName(path, newVal);
        break;
      }
      case 'description': {
        entity = await this.entityRepo.updateDescription(path, newVal);
        break;
      }
    }
    return entity;
  }

  @get('/entities/childs/{path}/{filter}', {
    responses: {
      '200': {
        description: 'New Entity instance',
        content: {'application/json': {schema: getModelSchemaRef(Entity)}},
      },
    },
  })
  async findChilds(
    @param.path.string('path') path: string,
    @param.path.string('filter') filter: string,
  ) {
    const [from, to, type] = filter.split('-');
    const childsAndCount = await this.entityRepo.findChildrenPaths(
      path,
      from,
      to,
      type,
    );
    return childsAndCount;
  }

  @get('/entities/{path}', {
    responses: {
      '200': {
        description: 'Get Entity by path',
        content: {'application/json': {schema: getModelSchemaRef(Entity)}},
      },
    },
  })
  async findByPath(@param.path.string('path') path: string) {
    const entity = await this.entityRepo.findByPath(path);
    entity.lastCall = new Date();
    const savedEntity = await this.entityRepo.save(entity);
    return savedEntity;
  }
}
