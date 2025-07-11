import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { 
  Shield, 
  Crown, 
  Users, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Zap
} from 'lucide-react'

// Role definitions with permissions
const ROLES = {
  guest: {
    name: 'Guest',
    level: 0,
    color: 'bg-gray-500',
    icon: Eye,
    permissions: {
      view_marketplace: true,
      view_public_agents: true,
      demo_free_agents: true,
      view_pricing: true,
      signup: true,
      login: true
    },
    restrictions: [
      'Cannot deploy agents',
      'Cannot access dashboard',
      'Cannot view analytics',
      'Limited to free demos only'
    ]
  },
  team_member: {
    name: 'Team Member',
    level: 1,
    color: 'bg-blue-500',
    icon: Users,
    permissions: {
      view_marketplace: true,
      view_public_agents: true,
      demo_all_agents: true,
      view_dashboard: true,
      view_organization_agents: true,
      use_deployed_agents: true,
      view_basic_analytics: true,
      create_workflows: true
    },
    restrictions: [
      'Cannot deploy new agents',
      'Cannot edit agent settings',
      'Cannot manage billing',
      'Cannot invite team members',
      'Cannot access admin settings'
    ]
  },
  creator: {
    name: 'Creator',
    level: 2,
    color: 'bg-purple-500',
    icon: Zap,
    permissions: {
      view_marketplace: true,
      view_public_agents: true,
      demo_all_agents: true,
      view_dashboard: true,
      view_organization_agents: true,
      use_deployed_agents: true,
      view_analytics: true,
      create_workflows: true,
      create_agents: true,
      edit_own_agents: true,
      publish_to_marketplace: true,
      view_revenue_analytics: true,
      manage_agent_pricing: true
    },
    restrictions: [
      'Cannot edit other creators\' agents',
      'Cannot manage organization billing',
      'Cannot access admin controls',
      'Cannot manage team members'
    ]
  },
  founder: {
    name: 'Founder',
    level: 3,
    color: 'bg-gold-500',
    icon: Crown,
    permissions: {
      view_marketplace: true,
      view_public_agents: true,
      demo_all_agents: true,
      view_dashboard: true,
      view_organization_agents: true,
      use_deployed_agents: true,
      view_analytics: true,
      create_workflows: true,
      create_agents: true,
      edit_all_agents: true,
      publish_to_marketplace: true,
      view_revenue_analytics: true,
      manage_agent_pricing: true,
      deploy_agents: true,
      manage_team: true,
      manage_billing: true,
      view_admin_settings: true,
      manage_organization: true,
      invite_members: true
    },
    restrictions: [
      'Cannot access platform admin controls',
      'Cannot edit Harmony core agents'
    ]
  },
  admin: {
    name: 'Platform Admin',
    level: 4,
    color: 'bg-red-500',
    icon: Shield,
    permissions: {
      // All permissions
      view_marketplace: true,
      view_public_agents: true,
      demo_all_agents: true,
      view_dashboard: true,
      view_organization_agents: true,
      use_deployed_agents: true,
      view_analytics: true,
      create_workflows: true,
      create_agents: true,
      edit_all_agents: true,
      publish_to_marketplace: true,
      view_revenue_analytics: true,
      manage_agent_pricing: true,
      deploy_agents: true,
      manage_team: true,
      manage_billing: true,
      view_admin_settings: true,
      manage_organization: true,
      invite_members: true,
      platform_admin: true,
      edit_core_agents: true,
      manage_all_organizations: true,
      view_platform_analytics: true,
      system_maintenance: true
    },
    restrictions: []
  }
}

// Permission checker hook
export const usePermissions = () => {
  const { user } = useAuth()
  
  const hasPermission = (permission) => {
    if (!user || !user.role) return false
    const role = ROLES[user.role]
    return role?.permissions[permission] || false
  }

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission))
  }

  const getRoleInfo = () => {
    if (!user || !user.role) return ROLES.guest
    return ROLES[user.role] || ROLES.guest
  }

  const canAccess = (requiredRole) => {
    const userRole = ROLES[user?.role] || ROLES.guest
    const required = ROLES[requiredRole]
    return userRole.level >= required.level
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRoleInfo,
    canAccess,
    user,
    role: user?.role || 'guest'
  }
}

// Protected component wrapper
export const ProtectedComponent = ({ 
  children, 
  requiredPermission, 
  requiredRole, 
  fallback, 
  showUpgrade = true 
}) => {
  const { hasPermission, canAccess, getRoleInfo } = usePermissions()
  
  let hasAccess = true
  
  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission)
  }
  
  if (requiredRole) {
    hasAccess = hasAccess && canAccess(requiredRole)
  }
  
  if (hasAccess) {
    return children
  }
  
  if (fallback) {
    return fallback
  }
  
  const roleInfo = getRoleInfo()
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="text-center py-8">
        <Lock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Access Restricted</h3>
        <p className="text-slate-400 mb-4">
          This feature requires {requiredRole ? `${ROLES[requiredRole]?.name}` : 'higher'} permissions
        </p>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-slate-400">Your role:</span>
          <Badge className={roleInfo.color}>
            {roleInfo.name}
          </Badge>
        </div>
        {showUpgrade && (
          <Button className="bg-purple-600 hover:bg-purple-700">
            Request Access Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Role display component
export const RoleDisplay = ({ user, showDetails = false }) => {
  const roleInfo = ROLES[user?.role] || ROLES.guest
  const Icon = roleInfo.icon
  
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4" />
      <Badge className={roleInfo.color}>
        {roleInfo.name}
      </Badge>
      {showDetails && (
        <span className="text-xs text-slate-400">
          Level {roleInfo.level}
        </span>
      )}
    </div>
  )
}

// Permission guard for buttons/actions
export const PermissionGuard = ({ 
  permission, 
  role, 
  children, 
  fallback = null,
  showTooltip = true 
}) => {
  const { hasPermission, canAccess } = usePermissions()
  
  let hasAccess = true
  
  if (permission) {
    hasAccess = hasPermission(permission)
  }
  
  if (role) {
    hasAccess = hasAccess && canAccess(role)
  }
  
  if (hasAccess) {
    return children
  }
  
  if (fallback) {
    return fallback
  }
  
  if (showTooltip) {
    return (
      <div className="relative group">
        <div className="opacity-50 cursor-not-allowed">
          {children}
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          Insufficient permissions
        </div>
      </div>
    )
  }
  
  return null
}

// Role management component
const RoleBasedAccess = () => {
  const { user, organization } = useAuth()
  const { getRoleInfo } = usePermissions()
  
  const roleInfo = getRoleInfo()
  const Icon = roleInfo.icon
  
  return (
    <div className="space-y-6">
      {/* Current Role Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            Access Control & Permissions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your current role and access level in {organization?.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Role */}
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-lg font-bold text-white">{roleInfo.name}</h3>
                <p className="text-sm text-slate-400">Access Level {roleInfo.level}</p>
              </div>
            </div>
            <Badge className={`${roleInfo.color} text-white`}>
              Current Role
            </Badge>
          </div>
          
          {/* Permissions Grid */}
          <div>
            <h4 className="text-white font-medium mb-3">Your Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(roleInfo.permissions).map(([permission, hasAccess]) => (
                <div key={permission} className="flex items-center space-x-2">
                  {hasAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-slate-600" />
                  )}
                  <span className={`text-sm ${hasAccess ? 'text-white' : 'text-slate-600'}`}>
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Restrictions */}
          {roleInfo.restrictions.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Current Restrictions</h4>
              <div className="space-y-2">
                {roleInfo.restrictions.map((restriction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-slate-400">{restriction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Role Comparison */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Roles</CardTitle>
          <CardDescription className="text-slate-400">
            Compare different access levels and their capabilities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLES).map(([roleKey, role]) => {
              const RoleIcon = role.icon
              const isCurrent = user?.role === roleKey
              const canUpgrade = role.level > roleInfo.level
              
              return (
                <div 
                  key={roleKey}
                  className={`p-4 rounded-lg border ${
                    isCurrent 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-slate-700 bg-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RoleIcon className="h-5 w-5 text-white" />
                    <h4 className="font-medium text-white">{role.name}</h4>
                    {isCurrent && (
                      <Badge className="bg-purple-600 text-xs">Current</Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-3">
                    Level {role.level} • {Object.keys(role.permissions).length} permissions
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {Object.entries(role.permissions).slice(0, 3).map(([permission, hasAccess]) => (
                      <div key={permission} className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-slate-300">
                          {permission.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                    {Object.keys(role.permissions).length > 3 && (
                      <div className="text-xs text-slate-400">
                        +{Object.keys(role.permissions).length - 3} more...
                      </div>
                    )}
                  </div>
                  
                  {canUpgrade && !isCurrent && (
                    <Button 
                      size="sm" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Request Upgrade
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoleBasedAccess

