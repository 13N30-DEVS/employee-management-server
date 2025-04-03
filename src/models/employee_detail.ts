import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { employee_information, employee_informationId } from './employee_information';

export interface employee_detailAttributes {
  id: string;
  emp_id?: string;
  date_of_birth?: string;
  addresses?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type employee_detailPk = "id";
export type employee_detailId = employee_detail[employee_detailPk];
export type employee_detailOptionalAttributes = "emp_id" | "date_of_birth" | "addresses" | "is_active" | "is_deleted" | "created_by" | "created_at" | "updated_by" | "updated_at" | "deleted_by" | "deleted_at";
export type employee_detailCreationAttributes = Optional<employee_detailAttributes, employee_detailOptionalAttributes>;

export class employee_detail extends Model<employee_detailAttributes, employee_detailCreationAttributes> implements employee_detailAttributes {
  id!: string;
  emp_id?: string;
  date_of_birth?: string;
  addresses?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // employee_detail belongsTo employee_information via emp_id
  emp!: employee_information;
  getEmp!: Sequelize.BelongsToGetAssociationMixin<employee_information>;
  setEmp!: Sequelize.BelongsToSetAssociationMixin<employee_information, employee_informationId>;
  createEmp!: Sequelize.BelongsToCreateAssociationMixin<employee_information>;

  static initModel(sequelize: Sequelize.Sequelize): typeof employee_detail {
    return employee_detail.init({
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
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    addresses: {
      type: DataTypes.TEXT,
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
    tableName: 'employee_details',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "employee_details_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
