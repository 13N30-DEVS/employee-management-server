import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface master_user_roleAttributes {
  id: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type master_user_rolePk = 'id';
export type master_user_roleId = master_user_role[master_user_rolePk];
export type master_user_roleOptionalAttributes =
  | 'name'
  | 'description'
  | 'is_active'
  | 'created_at'
  | 'updated_at';
export type master_user_roleCreationAttributes = Optional<
  master_user_roleAttributes,
  master_user_roleOptionalAttributes
>;

export class master_user_role
  extends Model<master_user_roleAttributes, master_user_roleCreationAttributes>
  implements master_user_roleAttributes
{
  id!: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // master_user_role hasMany user via role
  users!: user[];
  getUsers!: Sequelize.HasManyGetAssociationsMixin<user>;
  setUsers!: Sequelize.HasManySetAssociationsMixin<user, userId>;
  addUser!: Sequelize.HasManyAddAssociationMixin<user, userId>;
  addUsers!: Sequelize.HasManyAddAssociationsMixin<user, userId>;
  createUser!: Sequelize.HasManyCreateAssociationMixin<user>;
  removeUser!: Sequelize.HasManyRemoveAssociationMixin<user, userId>;
  removeUsers!: Sequelize.HasManyRemoveAssociationsMixin<user, userId>;
  hasUser!: Sequelize.HasManyHasAssociationMixin<user, userId>;
  hasUsers!: Sequelize.HasManyHasAssociationsMixin<user, userId>;
  countUsers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof master_user_role {
    return master_user_role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'master_user_roles',
        schema: 'auth',
        timestamps: false,
        indexes: [
          {
            name: 'master_user_roles_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
