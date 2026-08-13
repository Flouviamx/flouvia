export type OpsRole = 'owner' | 'operator' | 'finance' | 'collaborator';

export type OpsCapability =
  | 'ops:read'
  | 'inbox:write'
  | 'clients:write'
  | 'projects:write'
  | 'roadmap:write'
  | 'support:write'
  | 'vault:write'
  | 'communications:write'
  | 'billing:write'
  | 'team:manage'
  | 'clients:archive'
  | 'system:read';

export interface OpsMembership {
  role: OpsRole;
  status: 'active' | 'revoked';
  capabilities: OpsCapability[];
}

const ALL_CAPABILITIES: OpsCapability[] = [
  'ops:read',
  'inbox:write',
  'clients:write',
  'projects:write',
  'roadmap:write',
  'support:write',
  'vault:write',
  'communications:write',
  'billing:write',
  'team:manage',
  'clients:archive',
  'system:read',
];

const ROLE_CAPABILITIES: Record<OpsRole, OpsCapability[]> = {
  owner: ALL_CAPABILITIES,
  operator: [
    'ops:read',
    'inbox:write',
    'clients:write',
    'projects:write',
    'roadmap:write',
    'support:write',
    'vault:write',
    'communications:write',
    'system:read',
  ],
  finance: ['ops:read', 'billing:write', 'system:read'],
  collaborator: ['ops:read', 'inbox:write'],
};

export function isOpsRole(value: unknown): value is OpsRole {
  return value === 'owner'
    || value === 'operator'
    || value === 'finance'
    || value === 'collaborator';
}

export function capabilitiesForRole(
  role: OpsRole,
  overrides: unknown,
): OpsCapability[] {
  const allowed = new Set<OpsCapability>(ROLE_CAPABILITIES[role]);
  if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
    for (const capability of ALL_CAPABILITIES) {
      const override = (overrides as Record<string, unknown>)[capability];
      if (override === true) allowed.add(capability);
      if (override === false) allowed.delete(capability);
    }
  }
  return ALL_CAPABILITIES.filter((capability) => allowed.has(capability));
}
