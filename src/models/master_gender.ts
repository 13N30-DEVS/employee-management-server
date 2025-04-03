import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { employee_information, employee_informationId } from './employee_information';

export interface master_genderAttributes {
  id: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type master_genderPk = "id";
export type master_genderId = master_gender[master_genderPk];
export type master_genderOptionalAttributes = "name" | "description" | "is_active" | "created_at" | "updated_at";
export type master_genderCreationAttributes = Optional<master_genderAttributes, master_genderOptionalAttributes>;

export class master_gender extends Model<master_genderAttributes, master_genderCreationAttributes> implements master_genderAttributes {
  id!: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // master_gender hasMany employee_information via gender
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

  static initModel(sequelize: Sequelize.Sequelize): typeof master_gender {
    return master_gender.init({
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
    tableName: 'master_genders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "master_genders_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
