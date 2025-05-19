export const API_BASE    = "http://localhost:3000"
export const MEMBERS_API = `${API_BASE}/api/members`
export const DURATIONS_API = `${MEMBERS_API}/durations`
export const ARCHIVE_API  = `${API_BASE}/api/archive`

export const AUTH_API      = `${API_BASE}/auth`
export const LOGOUT_API    = `${AUTH_API}/logout`
export const AUTH_HOME_API = `${AUTH_API}/home`

export const SETTINGS_API = `${API_BASE}/api/settings`
export const BACKUPS_API   = `${SETTINGS_API}/backups`
export const BACKUP_API   = `${SETTINGS_API}/backup`
export const RESTORE_API  = `${SETTINGS_API}/restore`

export const LOGS_API    = `${API_BASE}/api/logs`
export const UPDATES_API = `${LOGS_API}/updates`
export const VISITS_API  = `${LOGS_API}/visits`

export const ANALYTICS_API = `${API_BASE}/api/analytics`
