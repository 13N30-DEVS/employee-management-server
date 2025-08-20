import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { workspace_designation, workspace_designationId } from './workspace_designation';

export interface master_designationAttributes {
  id: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type master_designationPk = 'id';
export type master_designationId = master_designation[master_designationPk];
export type master_designationOptionalAttributes =
  | 'name'
  | 'description'
  | 'is_active'
  | 'created_at'
  | 'updated_at';
export type master_designationCreationAttributes = Optional<
  master_designationAttributes,
  master_designationOptionalAttributes
>;

export class master_designation
  extends Model<master_designationAttributes, master_designationCreationAttributes>
  implements master_designationAttributes
{
  id!: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // master_designation hasMany workspace_designation via designation_id
  workspace_designations!: workspace_designation[];
  getWorkspace_designations!: Sequelize.HasManyGetAssociationsMixin<workspace_designation>;
  setWorkspace_designations!: Sequelize.HasManySetAssociationsMixin<
    workspace_designation,
    workspace_designationId
  >;
  addWorkspace_designation!: Sequelize.HasManyAddAssociationMixin<
    workspace_designation,
    workspace_designationId
  >;
  addWorkspace_designations!: Sequelize.HasManyAddAssociationsMixin<
    workspace_designation,
    workspace_designationId
  >;
  createWorkspace_designation!: Sequelize.HasManyCreateAssociationMixin<workspace_designation>;
  removeWorkspace_designation!: Sequelize.HasManyRemoveAssociationMixin<
    workspace_designation,
    workspace_designationId
  >;
  removeWorkspace_designations!: Sequelize.HasManyRemoveAssociationsMixin<
    workspace_designation,
    workspace_designationId
  >;
  hasWorkspace_designation!: Sequelize.HasManyHasAssociationMixin<
    workspace_designation,
    workspace_designationId
  >;
  hasWorkspace_designations!: Sequelize.HasManyHasAssociationsMixin<
    workspace_designation,
    workspace_designationId
  >;
  countWorkspace_designations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof master_designation {
    return master_designation.init(
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
        tableName: 'master_designations',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'master_designations_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
