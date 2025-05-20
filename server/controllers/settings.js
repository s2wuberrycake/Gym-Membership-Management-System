import {
  getAccounts,
  getAccountById,
  insertAccount,
  updateAccount,
  removeAccount,
  checkUsernameExists,
  getRoles
} from "../services/authorize.js"
import {
  backupDatabase,
  restoreDatabase,
  listBackups
} from "../services/backup.js"

export const getAllAccountsController = async (req, res, next) => {
  try {
    const accounts = await getAccounts()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
}

export const getAccountByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    const account = await getAccountById(id)
    if (!account) {
      return res.status(404).json({ message: "Account not found" })
    }
    res.json(account)
  } catch (err) {
    next(err)
  }
}

export const getRolesController = async (req, res, next) => {
  try {
    const roles = await getRoles()
    res.json(roles)
  } catch (err) {
    next(err)
  }
}

export const checkUsernameExistsController = async (req, res, next) => {
  try {
    const { username } = req.query
    if (!username) {
      return res.status(400).json({ message: "Username is required" })
    }
    const exists = await checkUsernameExists(username)
    res.json({ exists })
  } catch (err) {
    next(err)
  }
}

export const createAccountController = async (req, res, next) => {
  try {
    const { username, password, role_id } = req.body
    if (!username || !password || !role_id) {
      return res.status(400).json({ message: "username, password, and role_id are required" })
    }
    const newAccount = await insertAccount({ username, password, role_id })
    res.status(201).json({ message: "Account created", account_id: newAccount.account_id })
  } catch (err) {
    next(err)
  }
}

export const updateAccountController = async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, password, role_id: incomingRole } = req.body

    if (!username) {
      return res.status(400).json({ message: "username is required" })
    }

    let role_id
    if (req.user.role === "admin") {
      if (!incomingRole) {
        return res.status(400).json({ message: "role_id is required for admins" })
      }
      role_id = incomingRole
    } else {
      const existing = await getAccountById(id)
      if (!existing) {
        return res.status(404).json({ message: "Account not found" })
      }
      role_id = existing.role_id
    }

    await updateAccount({ account_id: id, username, password, role_id })
    res.json({ message: "Account updated successfully" })
  } catch (err) {
    next(err)
  }
}

export const deleteAccountController = async (req, res, next) => {
  try {
    const { id } = req.params
    await removeAccount(id)
    res.json({ message: "Account deleted successfully" })
  } catch (err) {
    next(err)
  }
}

export const listBackupsController = (req, res, next) => {
  try {
    const files = listBackups()
    res.json(files)
  } catch (err) {
    next(err)
  }
}

export const backupDatabaseController = async (req, res, next) => {
  try {
    const { filepath, filename } = await backupDatabase()
    res.download(filepath, filename, err => {
      if (err) next(err)
    })
  } catch (err) {
    next(err)
  }
}

export const restoreDatabaseController = async (req, res, next) => {
  try {
    const { filename } = req.body
    if (!filename) {
      return res
        .status(400)
        .json({ message: "Must provide a backup filename to restore." })
    }
    await restoreDatabase(filename)
    res.json({ message: "Database restored successfully." })
  } catch (err) {
    next(err)
  }
}