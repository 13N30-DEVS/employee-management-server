import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { employee_detail, employee_detailId } from './employee_detail';
import type { employee_role_mapping, employee_role_mappingId } from './employee_role_mapping';
import type { master_gender, master_genderId } from './master_gender';
import type { user, userId } from './user';
import type { workspace, workspaceId } from './workspace';

export interface employee_informationAttributes {
  id: string;
  user_id: string;
  workspace_id?: string;
  name?: string;
  gender?: number;
  email?: string;
  mobile_number?: string;
  profile_pic?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;
}

export type employee_informationPk = 'id';
export type employee_informationId = employee_information[employee_informationPk];
export type employee_informationOptionalAttributes =
  | 'workspace_id'
  | 'name'
  | 'gender'
  | 'email'
  | 'mobile_number'
  | 'profile_pic'
  | 'is_active'
  | 'is_deleted'
  | 'created_by'
  | 'created_at'
  | 'updated_by'
  | 'updated_at'
  | 'deleted_by'
  | 'deleted_at';
export type employee_informationCreationAttributes = Optional<
  employee_informationAttributes,
  employee_informationOptionalAttributes
>;

export class employee_information
  extends Model<employee_informationAttributes, employee_informationCreationAttributes>
  implements employee_informationAttributes
{
  id!: string;
  user_id!: string;
  workspace_id?: string;
  name?: string;
  gender?: number;
  email?: string;
  mobile_number?: string;
  profile_pic?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
  deleted_by?: string;
  deleted_at?: Date;

  // employee_information hasMany employee_detail via emp_id
  employee_details!: employee_detail[];
  getEmployee_details!: Sequelize.HasManyGetAssociationsMixin<employee_detail>;
  setEmployee_details!: Sequelize.HasManySetAssociationsMixin<employee_detail, employee_detailId>;
  addEmployee_detail!: Sequelize.HasManyAddAssociationMixin<employee_detail, employee_detailId>;
  addEmployee_details!: Sequelize.HasManyAddAssociationsMixin<employee_detail, employee_detailId>;
  createEmployee_detail!: Sequelize.HasManyCreateAssociationMixin<employee_detail>;
  removeEmployee_detail!: Sequelize.HasManyRemoveAssociationMixin<
    employee_detail,
    employee_detailId
  >;
  removeEmployee_details!: Sequelize.HasManyRemoveAssociationsMixin<
    employee_detail,
    employee_detailId
  >;
  hasEmployee_detail!: Sequelize.HasManyHasAssociationMixin<employee_detail, employee_detailId>;
  hasEmployee_details!: Sequelize.HasManyHasAssociationsMixin<employee_detail, employee_detailId>;
  countEmployee_details!: Sequelize.HasManyCountAssociationsMixin;
  // employee_information hasMany employee_role_mapping via emp_id
  employee_role_mappings!: employee_role_mapping[];
  getEmployee_role_mappings!: Sequelize.HasManyGetAssociationsMixin<employee_role_mapping>;
  setEmployee_role_mappings!: Sequelize.HasManySetAssociationsMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  addEmployee_role_mapping!: Sequelize.HasManyAddAssociationMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  addEmployee_role_mappings!: Sequelize.HasManyAddAssociationsMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  createEmployee_role_mapping!: Sequelize.HasManyCreateAssociationMixin<employee_role_mapping>;
  removeEmployee_role_mapping!: Sequelize.HasManyRemoveAssociationMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  removeEmployee_role_mappings!: Sequelize.HasManyRemoveAssociationsMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  hasEmployee_role_mapping!: Sequelize.HasManyHasAssociationMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  hasEmployee_role_mappings!: Sequelize.HasManyHasAssociationsMixin<
    employee_role_mapping,
    employee_role_mappingId
  >;
  countEmployee_role_mappings!: Sequelize.HasManyCountAssociationsMixin;
  // employee_information belongsTo master_gender via gender
  gender_master_gender!: master_gender;
  getGender_master_gender!: Sequelize.BelongsToGetAssociationMixin<master_gender>;
  setGender_master_gender!: Sequelize.BelongsToSetAssociationMixin<master_gender, master_genderId>;
  createGender_master_gender!: Sequelize.BelongsToCreateAssociationMixin<master_gender>;
  // employee_information belongsTo user via created_by
  created_by_user!: user;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // employee_information belongsTo user via deleted_by
  deleted_by_user!: user;
  getDeleted_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setDeleted_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createDeleted_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // employee_information belongsTo user via updated_by
  updated_by_user!: user;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // employee_information belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // employee_information belongsTo workspace via workspace_id
  workspace!: workspace;
  getWorkspace!: Sequelize.BelongsToGetAssociationMixin<workspace>;
  setWorkspace!: Sequelize.BelongsToSetAssociationMixin<workspace, workspaceId>;
  createWorkspace!: Sequelize.BelongsToCreateAssociationMixin<workspace>;

  static initModel(sequelize: Sequelize.Sequelize): typeof employee_information {
    return employee_information.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        workspace_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'workspaces',
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        gender: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'master_genders',
            key: 'id',
          },
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: 'employee_informations_email_key',
        },
        mobile_number: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: 'employee_informations_mobile_number_key',
        },
        profile_pic: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
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
        deleted_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'employee_informations',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'employee_informations_email_key',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'employee_informations_mobile_number_key',
            unique: true,
            fields: [{ name: 'mobile_number' }],
          },
          {
            name: 'employee_informations_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
