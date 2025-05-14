import {
  getAccounts,
  getAccountById,
  insertAccount,
  updateAccount,
  removeAccount,
  checkUsernameExists,
  getRoles
} from "../services/authorize.js"

export const getAllAccountsController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all accounts")
    const accounts = await getAccounts()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
}

export const getAccountByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(`DEBUG >> Fetching account with ID: ${id}`)

    const account = await getAccountById(id)
    if (!account) {
      return res.status(404).json({ error: "Account not found" })
    }

    res.json(account)
  } catch (err) {
    next(err)
  }
}

export const getRolesController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all role types")
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
      return res.status(400).json({ error: "Username is required" })
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
    console.log(`DEBUG >> Inserting account with username: ${username}, role_id: ${role_id}`)

    if (!username || !password || !role_id) {
      return res.status(400).json({ error: "username, password, and role_id are required" })
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
    const { username, password, role_id } = req.body

    console.log(`DEBUG >> Updating account with ID: ${id}`)

    if (!username || !role_id) {
      return res.status(400).json({ error: "username and role_id are required" })
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
    console.log(`DEBUG >> Deleting account with ID: ${id}`)

    await removeAccount(id)
    res.json({ message: "Account deleted successfully" })
  } catch (err) {
    next(err)
  }
}