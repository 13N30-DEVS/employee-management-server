import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { master_designation, master_designationId } from './master_designation';
import type { workspace, workspaceId } from './workspace';

export interface workspace_designationAttributes {
  id: string;
  workspace_id?: string;
  dep_id?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

export type workspace_designationPk = "id";
export type workspace_designationId = workspace_designation[workspace_designationPk];
export type workspace_designationOptionalAttributes = "workspace_id" | "dep_id" | "is_active" | "created_by" | "created_at" | "updated_by" | "updated_at";
export type workspace_designationCreationAttributes = Optional<workspace_designationAttributes, workspace_designationOptionalAttributes>;

export class workspace_designation extends Model<workspace_designationAttributes, workspace_designationCreationAttributes> implements workspace_designationAttributes {
  id!: string;
  workspace_id?: string;
  dep_id?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;

  // workspace_designation belongsTo master_designation via dep_id
  dep!: master_designation;
  getDep!: Sequelize.BelongsToGetAssociationMixin<master_designation>;
  setDep!: Sequelize.BelongsToSetAssociationMixin<master_designation, master_designationId>;
  createDep!: Sequelize.BelongsToCreateAssociationMixin<master_designation>;
  // workspace_designation belongsTo workspace via workspace_id
  workspace!: workspace;
  getWorkspace!: Sequelize.BelongsToGetAssociationMixin<workspace>;
  setWorkspace!: Sequelize.BelongsToSetAssociationMixin<workspace, workspaceId>;
  createWorkspace!: Sequelize.BelongsToCreateAssociationMixin<workspace>;

  static initModel(sequelize: Sequelize.Sequelize): typeof workspace_designation {
    return workspace_designation.init({
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
    dep_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'master_designations',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
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
    }
  }, {
    sequelize,
    tableName: 'workspace_designations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "workspace_designations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
