import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface workspace_shiftAttributes {
  id: string;
  workspace_id?: string;
  name?: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type workspace_shiftPk = "id";
export type workspace_shiftId = workspace_shift[workspace_shiftPk];
export type workspace_shiftOptionalAttributes = "workspace_id" | "name" | "description" | "is_active" | "is_deleted" | "created_by" | "created_at" | "updated_by" | "updated_at" | "deleted_by" | "deleted_at";
export type workspace_shiftCreationAttributes = Optional<workspace_shiftAttributes, workspace_shiftOptionalAttributes>;

export class workspace_shift extends Model<workspace_shiftAttributes, workspace_shiftCreationAttributes> implements workspace_shiftAttributes {
  id!: string;
  workspace_id?: string;
  name?: string;
  description?: string;
  start_time!: string;
  end_time!: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // workspace_shift belongsTo user via created_by
  created_by_user!: user;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // workspace_shift belongsTo user via deleted_by
  deleted_by_user!: user;
  getDeleted_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setDeleted_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createDeleted_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // workspace_shift belongsTo user via updated_by
  updated_by_user!: user;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof workspace_shift {
    return workspace_shift.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'workspace_shifts',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "workspace_shifts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
