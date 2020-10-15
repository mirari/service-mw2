import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  AfterLoad,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { BaseModel } from './base';
import { AdminRoleModel } from './admin-role';
import { AdminUserModel } from './admin-user';

@EntityModel({
  name: 'admin_permissions',
})
export class AdminPermissionModel extends BaseModel {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '标识',
  })
  slug: string;

  @Column({
    type: 'varchar',
    name: 'http_method',
    comment:
      '请求方式 ["ANY", "DELETE", "POST", "GET", "PUT", "PATCH", "OPTIONS", "HEAD"]',
  })
  httpMethod: string[];

  @Column({
    type: 'text',
    name: 'http_path',
    comment: '请求路径',
  })
  httpPath: string;

  @ManyToMany(type => AdminRoleModel, role => role.permissions)
  @JoinTable({
    name: 'admin_role_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: AdminRoleModel[];

  @ManyToMany(type => AdminUserModel, user => user.permissions)
  @JoinTable({
    name: 'admin_user_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: AdminUserModel[];

  @AfterLoad()
  mixin() {
    this.httpMethod = this.httpMethod?.toString().split(',');
  }
}

/**
 * 权限信息
 */
export interface AdminPermissionInfo {
  id?: string;
  name?: string;
  slug?: string;
  httpMethod?: string[]; // ["ANY", "DELETE", "POST", "GET", "PUT", "PATCH", "OPTIONS", "HEAD"]
  httpPath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
