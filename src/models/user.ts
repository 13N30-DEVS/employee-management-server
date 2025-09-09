import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { master_user_role, master_user_roleId } from './master_user_role';
import type { master_user_status, master_user_statusId } from './master_user_status';

export interface userAttributes {
  id: string;
  email_id?: string;
  password_hash?: string;
  role?: number;
  status?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

export type userPk = 'id';
export type userId = user[userPk];
export type userOptionalAttributes =
  | 'email_id'
  | 'password_hash'
  | 'role'
  | 'status'
  | 'is_active'
  | 'created_by'
  | 'created_at'
  | 'updated_by'
  | 'updated_at';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: string;
  email_id?: string;
  password_hash?: string;
  role?: number;
  status?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;

  // user belongsTo master_user_role via role
  role_master_user_role!: master_user_role;
  getRole_master_user_role!: Sequelize.BelongsToGetAssociationMixin<master_user_role>;
  setRole_master_user_role!: Sequelize.BelongsToSetAssociationMixin<
    master_user_role,
    master_user_roleId
  >;
  createRole_master_user_role!: Sequelize.BelongsToCreateAssociationMixin<master_user_role>;
  // user belongsTo master_user_status via status
  status_master_user_status!: master_user_status;
  getStatus_master_user_status!: Sequelize.BelongsToGetAssociationMixin<master_user_status>;
  setStatus_master_user_status!: Sequelize.BelongsToSetAssociationMixin<
    master_user_status,
    master_user_statusId
  >;
  createStatus_master_user_status!: Sequelize.BelongsToCreateAssociationMixin<master_user_status>;
  // user belongsTo user via created_by
  created_by_user!: user;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // user belongsTo user via updated_by
  updated_by_user!: user;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        email_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'master_user_roles',
            key: 'id',
          },
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'master_user_statuses',
            key: 'id',
          },
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        schema: 'auth',
        timestamps: false,
        indexes: [
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
