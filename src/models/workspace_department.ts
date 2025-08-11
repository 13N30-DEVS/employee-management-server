import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { master_department, master_departmentId } from './master_department';
import type { workspace, workspaceId } from './workspace';

export interface workspace_departmentAttributes {
  id: string;
  workspace_id?: string;
  department_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type workspace_departmentPk = "id";
export type workspace_departmentId = workspace_department[workspace_departmentPk];
export type workspace_departmentOptionalAttributes = "workspace_id" | "department_id" | "is_active" | "is_deleted" | "created_by" | "created_at" | "updated_by" | "updated_at" | "deleted_by" | "deleted_at";
export type workspace_departmentCreationAttributes = Optional<workspace_departmentAttributes, workspace_departmentOptionalAttributes>;

export class workspace_department extends Model<workspace_departmentAttributes, workspace_departmentCreationAttributes> implements workspace_departmentAttributes {
  id!: string;
  workspace_id?: string;
  department_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // workspace_department belongsTo master_department via department_id
  department!: master_department;
  getDepartment!: Sequelize.BelongsToGetAssociationMixin<master_department>;
  setDepartment!: Sequelize.BelongsToSetAssociationMixin<master_department, master_departmentId>;
  createDepartment!: Sequelize.BelongsToCreateAssociationMixin<master_department>;
  // workspace_department belongsTo workspace via workspace_id
  workspace!: workspace;
  getWorkspace!: Sequelize.BelongsToGetAssociationMixin<workspace>;
  setWorkspace!: Sequelize.BelongsToSetAssociationMixin<workspace, workspaceId>;
  createWorkspace!: Sequelize.BelongsToCreateAssociationMixin<workspace>;

  static initModel(sequelize: Sequelize.Sequelize): typeof workspace_department {
    return workspace_department.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'workspaces',
        key: 'id'
      }
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'master_departments',
        key: 'id'
      }
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
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'workspace_departments',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "workspace_departments_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
