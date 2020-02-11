import {EntityRepository as E, AbstractRepository} from 'typeorm';
import {Entity} from '../entities/entity';

@E(Entity)
export class EntityRepository extends AbstractRepository<Entity> {
  save(entity: Entity) {
    return this.repository.save(entity);
  }

  findByPath(path: string) {
    return this.repository
      .createQueryBuilder('entity')
      .where(`path ~ :path`, {path})
      .getOne();
  }

  findChildrenPaths(path: string, from: string, to: string, type: string) {
    path += '.*{1}';
    let query = this.repository
      .createQueryBuilder('entity')
      .select(`entity`)
      .where(`path ~ :path`, {path});

    if (type !== 'all')
      query = query.andWhere('type = :type', {
        type,
      });

    return query
      .orderBy('type', 'DESC')
      .addOrderBy('name')
      .offset(+from)
      .limit(+to - +from)
      .getManyAndCount();
  }

  async updateName(path: string, newName: string) {
    const newPath = path.replace(/[^\.]+$/, newName);

    const updateChildsPaths = await this.manager.query(
      `UPDATE entity SET path = '${newPath}' || subpath(path, nlevel('${path}')) WHERE path ~ '${path}.*{1,}'`,
    );

    const updateName = await this.manager.query(
      `UPDATE entity SET path = '${newPath}', name = '${newName}' WHERE path ~ '${path}'`,
    );

    return await this.manager.transaction(async manager => {
      try {
        await manager
          .createQueryBuilder()
          .update(Entity)
          .set({name: newName})
          .where('path ~ :path', {path})
          .execute();

        await manager
          .createQueryBuilder()
          .update(Entity)
          .set({
            path: () =>
              `text2ltree(regexp_replace(ltree2text(path), '^${path}', '${newPath}'))`,
          })
          .where('path <@ :path', {path})
          .execute();

        return await this.findByPath(newPath);
      } catch (err) {
        return err;
      }
    });
  }

  async updateDescription(
    path: string,
    description: string,
  ): Promise<Entity | null> {
    try {
      await this.repository
        .createQueryBuilder('entity')
        .update(Entity)
        .set({description})
        .where('path ~ :path ', {path})
        .execute();

      return await this.findByPath(path);
    } catch (err) {
      //TODO Log(err)
      return null;
    }
  }
}
