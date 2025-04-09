import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { workspace_department, workspace_departmentId } from './workspace_department';

export interface master_departmentAttributes {
  id: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type master_departmentPk = "id";
export type master_departmentId = master_department[master_departmentPk];
export type master_departmentOptionalAttributes = "name" | "description" | "is_active" | "created_at" | "updated_at";
export type master_departmentCreationAttributes = Optional<master_departmentAttributes, master_departmentOptionalAttributes>;

export class master_department extends Model<master_departmentAttributes, master_departmentCreationAttributes> implements master_departmentAttributes {
  id!: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // master_department hasMany workspace_department via department_id
  workspace_departments!: workspace_department[];
  getWorkspace_departments!: Sequelize.HasManyGetAssociationsMixin<workspace_department>;
  setWorkspace_departments!: Sequelize.HasManySetAssociationsMixin<workspace_department, workspace_departmentId>;
  addWorkspace_department!: Sequelize.HasManyAddAssociationMixin<workspace_department, workspace_departmentId>;
  addWorkspace_departments!: Sequelize.HasManyAddAssociationsMixin<workspace_department, workspace_departmentId>;
  createWorkspace_department!: Sequelize.HasManyCreateAssociationMixin<workspace_department>;
  removeWorkspace_department!: Sequelize.HasManyRemoveAssociationMixin<workspace_department, workspace_departmentId>;
  removeWorkspace_departments!: Sequelize.HasManyRemoveAssociationsMixin<workspace_department, workspace_departmentId>;
  hasWorkspace_department!: Sequelize.HasManyHasAssociationMixin<workspace_department, workspace_departmentId>;
  hasWorkspace_departments!: Sequelize.HasManyHasAssociationsMixin<workspace_department, workspace_departmentId>;
  countWorkspace_departments!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof master_department {
    return master_department.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'master_departments',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "master_departments_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
