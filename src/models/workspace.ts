import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { employee_information, employee_informationId } from './employee_information';
import type { workspace_department, workspace_departmentId } from './workspace_department';
import type { workspace_designation, workspace_designationId } from './workspace_designation';

export interface workspaceAttributes {
  id: string;
  workspace_name?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type workspacePk = "id";
export type workspaceId = workspace[workspacePk];
export type workspaceOptionalAttributes = "workspace_name" | "is_active" | "is_deleted" | "created_by" | "created_at" | "updated_by" | "updated_at" | "deleted_by" | "deleted_at";
export type workspaceCreationAttributes = Optional<workspaceAttributes, workspaceOptionalAttributes>;

export class workspace extends Model<workspaceAttributes, workspaceCreationAttributes> implements workspaceAttributes {
  id!: string;
  workspace_name?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // workspace hasMany employee_information via workspace_id
  employee_informations!: employee_information[];
  getEmployee_informations!: Sequelize.HasManyGetAssociationsMixin<employee_information>;
  setEmployee_informations!: Sequelize.HasManySetAssociationsMixin<employee_information, employee_informationId>;
  addEmployee_information!: Sequelize.HasManyAddAssociationMixin<employee_information, employee_informationId>;
  addEmployee_informations!: Sequelize.HasManyAddAssociationsMixin<employee_information, employee_informationId>;
  createEmployee_information!: Sequelize.HasManyCreateAssociationMixin<employee_information>;
  removeEmployee_information!: Sequelize.HasManyRemoveAssociationMixin<employee_information, employee_informationId>;
  removeEmployee_informations!: Sequelize.HasManyRemoveAssociationsMixin<employee_information, employee_informationId>;
  hasEmployee_information!: Sequelize.HasManyHasAssociationMixin<employee_information, employee_informationId>;
  hasEmployee_informations!: Sequelize.HasManyHasAssociationsMixin<employee_information, employee_informationId>;
  countEmployee_informations!: Sequelize.HasManyCountAssociationsMixin;
  // workspace hasMany workspace_department via workspace_id
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
  // workspace hasMany workspace_designation via workspace_id
  workspace_designations!: workspace_designation[];
  getWorkspace_designations!: Sequelize.HasManyGetAssociationsMixin<workspace_designation>;
  setWorkspace_designations!: Sequelize.HasManySetAssociationsMixin<workspace_designation, workspace_designationId>;
  addWorkspace_designation!: Sequelize.HasManyAddAssociationMixin<workspace_designation, workspace_designationId>;
  addWorkspace_designations!: Sequelize.HasManyAddAssociationsMixin<workspace_designation, workspace_designationId>;
  createWorkspace_designation!: Sequelize.HasManyCreateAssociationMixin<workspace_designation>;
  removeWorkspace_designation!: Sequelize.HasManyRemoveAssociationMixin<workspace_designation, workspace_designationId>;
  removeWorkspace_designations!: Sequelize.HasManyRemoveAssociationsMixin<workspace_designation, workspace_designationId>;
  hasWorkspace_designation!: Sequelize.HasManyHasAssociationMixin<workspace_designation, workspace_designationId>;
  hasWorkspace_designations!: Sequelize.HasManyHasAssociationsMixin<workspace_designation, workspace_designationId>;
  countWorkspace_designations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof workspace {
    return workspace.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    workspace_name: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'workspaces',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "workspaces_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
