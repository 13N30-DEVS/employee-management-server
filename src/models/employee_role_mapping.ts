import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { employee_information, employee_informationId } from './employee_information';
import type { master_user_role, master_user_roleId } from './master_user_role';

export interface employee_role_mappingAttributes {
  id: string;
  emp_id?: string;
  role_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type employee_role_mappingPk = "id";
export type employee_role_mappingId = employee_role_mapping[employee_role_mappingPk];
export type employee_role_mappingOptionalAttributes = "emp_id" | "role_id" | "is_active" | "is_deleted" | "created_by" | "created_at" | "updated_by" | "updated_at" | "deleted_by" | "deleted_at";
export type employee_role_mappingCreationAttributes = Optional<employee_role_mappingAttributes, employee_role_mappingOptionalAttributes>;

export class employee_role_mapping extends Model<employee_role_mappingAttributes, employee_role_mappingCreationAttributes> implements employee_role_mappingAttributes {
  id!: string;
  emp_id?: string;
  role_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // employee_role_mapping belongsTo employee_information via emp_id
  emp!: employee_information;
  getEmp!: Sequelize.BelongsToGetAssociationMixin<employee_information>;
  setEmp!: Sequelize.BelongsToSetAssociationMixin<employee_information, employee_informationId>;
  createEmp!: Sequelize.BelongsToCreateAssociationMixin<employee_information>;
  // employee_role_mapping belongsTo master_user_role via role_id
  role!: master_user_role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<master_user_role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<master_user_role, master_user_roleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<master_user_role>;

  static initModel(sequelize: Sequelize.Sequelize): typeof employee_role_mapping {
    return employee_role_mapping.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    emp_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'employee_informations',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'master_user_roles',
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
    tableName: 'employee_role_mappings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "employee_role_mappings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
