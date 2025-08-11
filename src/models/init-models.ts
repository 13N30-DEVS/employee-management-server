import type { Sequelize } from "sequelize";
import { employee_detail as _employee_detail } from "./employee_detail";
import type { employee_detailAttributes, employee_detailCreationAttributes } from "./employee_detail";
import { employee_information as _employee_information } from "./employee_information";
import type { employee_informationAttributes, employee_informationCreationAttributes } from "./employee_information";
import { employee_role_mapping as _employee_role_mapping } from "./employee_role_mapping";
import type { employee_role_mappingAttributes, employee_role_mappingCreationAttributes } from "./employee_role_mapping";
import { master_department as _master_department } from "./master_department";
import type { master_departmentAttributes, master_departmentCreationAttributes } from "./master_department";
import { master_designation as _master_designation } from "./master_designation";
import type { master_designationAttributes, master_designationCreationAttributes } from "./master_designation";
import { master_gender as _master_gender } from "./master_gender";
import type { master_genderAttributes, master_genderCreationAttributes } from "./master_gender";
import { master_user_role as _master_user_role } from "./master_user_role";
import type { master_user_roleAttributes, master_user_roleCreationAttributes } from "./master_user_role";
import { master_user_status as _master_user_status } from "./master_user_status";
import type { master_user_statusAttributes, master_user_statusCreationAttributes } from "./master_user_status";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";
import { workspace_department as _workspace_department } from "./workspace_department";
import type { workspace_departmentAttributes, workspace_departmentCreationAttributes } from "./workspace_department";
import { workspace_designation as _workspace_designation } from "./workspace_designation";
import type { workspace_designationAttributes, workspace_designationCreationAttributes } from "./workspace_designation";
import { workspace_shift as _workspace_shift } from "./workspace_shift";
import type { workspace_shiftAttributes, workspace_shiftCreationAttributes } from "./workspace_shift";
import { workspace as _workspace } from "./workspace";
import type { workspaceAttributes, workspaceCreationAttributes } from "./workspace";

export {
  _employee_detail as employee_detail,
  _employee_information as employee_information,
  _employee_role_mapping as employee_role_mapping,
  _master_department as master_department,
  _master_designation as master_designation,
  _master_gender as master_gender,
  _master_user_role as master_user_role,
  _master_user_status as master_user_status,
  _user as user,
  _workspace_department as workspace_department,
  _workspace_designation as workspace_designation,
  _workspace_shift as workspace_shift,
  _workspace as workspace,
};

export type {
  employee_detailAttributes,
  employee_detailCreationAttributes,
  employee_informationAttributes,
  employee_informationCreationAttributes,
  employee_role_mappingAttributes,
  employee_role_mappingCreationAttributes,
  master_departmentAttributes,
  master_departmentCreationAttributes,
  master_designationAttributes,
  master_designationCreationAttributes,
  master_genderAttributes,
  master_genderCreationAttributes,
  master_user_roleAttributes,
  master_user_roleCreationAttributes,
  master_user_statusAttributes,
  master_user_statusCreationAttributes,
  userAttributes,
  userCreationAttributes,
  workspace_departmentAttributes,
  workspace_departmentCreationAttributes,
  workspace_designationAttributes,
  workspace_designationCreationAttributes,
  workspace_shiftAttributes,
  workspace_shiftCreationAttributes,
  workspaceAttributes,
  workspaceCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const employee_detail = _employee_detail.initModel(sequelize);
  const employee_information = _employee_information.initModel(sequelize);
  const employee_role_mapping = _employee_role_mapping.initModel(sequelize);
  const master_department = _master_department.initModel(sequelize);
  const master_designation = _master_designation.initModel(sequelize);
  const master_gender = _master_gender.initModel(sequelize);
  const master_user_role = _master_user_role.initModel(sequelize);
  const master_user_status = _master_user_status.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const workspace_department = _workspace_department.initModel(sequelize);
  const workspace_designation = _workspace_designation.initModel(sequelize);
  const workspace_shift = _workspace_shift.initModel(sequelize);
  const workspace = _workspace.initModel(sequelize);

  user.belongsTo(master_user_role, { as: "role_master_user_role", foreignKey: "role"});
  master_user_role.hasMany(user, { as: "users", foreignKey: "role"});
  user.belongsTo(master_user_status, { as: "status_master_user_status", foreignKey: "status"});
  master_user_status.hasMany(user, { as: "users", foreignKey: "status"});
  employee_detail.belongsTo(employee_information, { as: "emp", foreignKey: "emp_id"});
  employee_information.hasMany(employee_detail, { as: "employee_details", foreignKey: "emp_id"});
  employee_role_mapping.belongsTo(employee_information, { as: "emp", foreignKey: "emp_id"});
  employee_information.hasMany(employee_role_mapping, { as: "employee_role_mappings", foreignKey: "emp_id"});
  workspace_department.belongsTo(master_department, { as: "department", foreignKey: "department_id"});
  master_department.hasMany(workspace_department, { as: "workspace_departments", foreignKey: "department_id"});
  workspace_designation.belongsTo(master_designation, { as: "designation", foreignKey: "designation_id"});
  master_designation.hasMany(workspace_designation, { as: "workspace_designations", foreignKey: "designation_id"});
  employee_information.belongsTo(master_gender, { as: "gender_master_gender", foreignKey: "gender"});
  master_gender.hasMany(employee_information, { as: "employee_informations", foreignKey: "gender"});
  employee_role_mapping.belongsTo(master_user_role, { as: "role", foreignKey: "role_id"});
  master_user_role.hasMany(employee_role_mapping, { as: "employee_role_mappings", foreignKey: "role_id"});
  employee_information.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(employee_information, { as: "employee_informations", foreignKey: "user_id"});
  employee_information.belongsTo(workspace, { as: "workspace", foreignKey: "workspace_id"});
  workspace.hasMany(employee_information, { as: "employee_informations", foreignKey: "workspace_id"});
  workspace_department.belongsTo(workspace, { as: "workspace", foreignKey: "workspace_id"});
  workspace.hasMany(workspace_department, { as: "workspace_departments", foreignKey: "workspace_id"});
  workspace_designation.belongsTo(workspace, { as: "workspace", foreignKey: "workspace_id"});
  workspace.hasMany(workspace_designation, { as: "workspace_designations", foreignKey: "workspace_id"});

  return {
    employee_detail: employee_detail,
    employee_information: employee_information,
    employee_role_mapping: employee_role_mapping,
    master_department: master_department,
    master_designation: master_designation,
    master_gender: master_gender,
    master_user_role: master_user_role,
    master_user_status: master_user_status,
    user: user,
    workspace_department: workspace_department,
    workspace_designation: workspace_designation,
    workspace_shift: workspace_shift,
    workspace: workspace,
  };
}
