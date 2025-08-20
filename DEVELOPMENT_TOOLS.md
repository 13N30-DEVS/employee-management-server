# Development Tools Guide

This document explains how to use the type checking, linting, and formatting tools that have been added to the project.

## 🛠️ **Available Tools**

### **Type Checking**

- **Command**: `npm run type-check`
- **Description**: Runs TypeScript compiler in type-checking mode without generating output files
- **Use Case**: Verify type safety before committing code

### **Linting**

- **Command**: `npm run lint`
- **Description**: Runs ESLint to check code quality and style
- **Use Case**: Ensure code follows project standards

### **Linting with Auto-fix**

- **Command**: `npm run lint:fix`
- **Description**: Runs ESLint and automatically fixes fixable issues
- **Use Case**: Quickly resolve common formatting issues

### **Strict Linting**

- **Command**: `npm run lint:check`
- **Description**: Runs ESLint with zero tolerance for warnings
- **Use Case**: CI/CD pipelines and pre-commit hooks

### **Code Formatting**

- **Command**: `npm run format`
- **Description**: Runs Prettier to format all code files
- **Use Case**: Ensure consistent code formatting

### **Format Checking**

- **Command**: `npm run format:check`
- **Description**: Checks if files are properly formatted without changing them
- **Use Case**: CI/CD pipelines and pre-commit hooks

### **Complete Code Quality Check**

- **Command**: `npm run code-quality`
- **Description**: Runs type checking, linting, and format checking
- **Use Case**: Comprehensive code review before commits

### **Auto-fix Everything**

- **Command**: `npm run fix-all`
- **Description**: Automatically fixes linting and formatting issues
- **Use Case**: Quick cleanup of codebase

### **Pre-commit Hook**

- **Command**: `npm run pre-commit`
- **Description**: Runs lint-staged to check and fix staged files
- **Use Case**: Automatically runs before each commit

## 🐕 **Husky Git Hooks**

The project uses Husky to enforce code quality standards automatically:

### **Pre-commit Hook**

- **Trigger**: Before each commit
- **Action**: Runs `lint-staged` on staged files
- **Purpose**: Ensures only clean, properly formatted code gets committed
- **Files**: `.husky/pre-commit`

### **Pre-push Hook**

- **Trigger**: Before pushing to remote
- **Action**: Runs comprehensive quality checks
- **Purpose**: Ensures code is ready for production
- **Files**: `.husky/pre-push`

## 📋 **ESLint Rules**

The project uses a comprehensive ESLint configuration with the following key rules:

### **TypeScript Rules**

- No unused variables
- No explicit `any` types (warning)
- Prefer nullish coalescing (`??`)
- Prefer optional chaining (`?.`)
- No unnecessary type assertions
- Proper async/await usage

### **Code Style Rules**

- Single quotes for strings
- 2-space indentation
- Semicolons required
- Trailing commas on multiline objects/arrays
- No trailing spaces
- Consistent spacing

### **Best Practices**

- No `console.log` (warning)
- No `debugger` statements
- Prefer `const` over `let`
- Use template literals
- Proper error handling

## 🎨 **Prettier Configuration**

Prettier is configured with the following settings:

- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Single Quotes**: Yes
- **Trailing Comma**: ES5 compatible
- **Semicolons**: Yes
- **End of Line**: LF (Unix style)

## 🚀 **Workflow Examples**

### **Daily Development**

```bash
# Check types before starting work
npm run type-check

# Format code after making changes
npm run format

# Check for any remaining issues
npm run lint
```

### **Before Committing**

```bash
# The pre-commit hook will automatically:
# 1. Format staged files with Prettier
# 2. Fix linting issues with ESLint
# 3. Block commit if errors remain

git add .
git commit -m "add new feature"
# Pre-commit hook runs automatically
```

### **Manual Quality Check**

```bash
# Run complete quality check
npm run code-quality

# If issues found, auto-fix them
npm run fix-all

# Verify everything is clean
npm run code-quality
```

### **CI/CD Pipeline**

```bash
# These commands should pass in CI
npm run type-check
npm run lint:check
npm run format:check
npm run build
```

## 🔧 **Configuration Files**

### **ESLint Configuration**

- **File**: `.eslintrc.js`
- **Purpose**: Defines linting rules and TypeScript integration
- **Customization**: Modify rules in the `rules` section

### **Prettier Configuration**

- **File**: `.prettierrc`
- **Purpose**: Defines code formatting rules
- **Customization**: Modify formatting preferences

### **Husky Configuration**

- **File**: `.husky/`
- **Purpose**: Git hooks for automated quality checks
- **Files**: `pre-commit`, `pre-push`

### **Lint-staged Configuration**

- **File**: `package.json` (lint-staged section)
- **Purpose**: Defines what runs on staged files
- **Configuration**: ESLint + Prettier for TS/JS, Prettier for JSON/MD

### **Ignore Files**

- **`.eslintignore`**: Files/directories to skip during linting
- **`.prettierignore`**: Files/directories to skip during formatting

## 📊 **Current Status**

As of the latest setup:

- **Type Checking**: ✅ Working
- **Linting**: ✅ Working (279 issues found)
- **Formatting**: ✅ Working
- **Auto-fix**: ✅ Available
- **Pre-commit Hooks**: ✅ Working
- **Git Hooks**: ✅ Configured

## 🎯 **Next Steps**

1. **Fix Current Issues**: Run `npm run fix-all` to resolve existing formatting issues
2. **Commit Clean Code**: Commit with confidence - hooks will ensure quality
3. **IDE Integration**: Configure your editor to use these tools
4. **Team Training**: Share this guide with your development team

## 🚨 **Common Issues & Solutions**

### **ESLint Not Working**

- Ensure `@typescript-eslint` packages are installed
- Check `.eslintrc.js` configuration
- Verify file extensions are included

### **Prettier Conflicts**

- Install `eslint-config-prettier` to disable conflicting ESLint rules
- Run `npm run fix-all` to resolve conflicts

### **Type Errors**

- Run `npm run type-check` to identify issues
- Fix type annotations and imports
- Ensure all dependencies are properly typed

### **Pre-commit Hook Failing**

- Fix linting errors before committing
- Use `npm run lint:fix` to auto-fix issues

### **Husky Not Working**

- Ensure `husky install` was run
- Check `.husky/` directory exists
- Verify hook files are executable

## 📚 **Additional Resources**

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Husky Git Hooks](https://typicode.github.io/husky/)
- [Lint-staged](https://github.com/okonet/lint-staged)

---

**Note**: These tools are designed to improve code quality and consistency. Regular use will help maintain a clean, professional codebase. The pre-commit hooks ensure that only quality code reaches your repository.
