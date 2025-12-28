import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ManagedKey {
  id: number
  name: string
  type: 'symmetric' | 'asymmetric'
  algorithm: string
  createdAt: string
  expiresAt: string
  status: 'active' | 'expiring' | 'expired' | 'rotated'
  environment: 'production' | 'staging' | 'development'
  notes: string
}

export default function EncryptionKeyManager() {
  const { t } = useTranslation()
  const [keys, setKeys] = useState<ManagedKey[]>([
    {
      id: 1,
      name: 'Database Encryption Key',
      type: 'symmetric',
      algorithm: 'AES-256-GCM',
      createdAt: '2024-01-15',
      expiresAt: '2025-01-15',
      status: 'active',
      environment: 'production',
      notes: 'Main database encryption',
    },
    {
      id: 2,
      name: 'API Signing Key',
      type: 'asymmetric',
      algorithm: 'RSA-2048',
      createdAt: '2024-06-01',
      expiresAt: '2024-12-01',
      status: 'expiring',
      environment: 'production',
      notes: 'JWT signing',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState<ManagedKey | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all')

  const addOrUpdateKey = (key: Omit<ManagedKey, 'id'>) => {
    if (editingKey) {
      setKeys(keys.map(k => k.id === editingKey.id ? { ...key, id: editingKey.id } : k))
    } else {
      setKeys([...keys, { ...key, id: Date.now() }])
    }
    setShowForm(false)
    setEditingKey(null)
  }

  const deleteKey = (id: number) => {
    setKeys(keys.filter(k => k.id !== id))
  }

  const rotateKey = (id: number) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        return {
          ...k,
          status: 'rotated' as const,
          notes: k.notes + ` | Rotated on ${new Date().toLocaleDateString()}`,
        }
      }
      return k
    }))
    // Add new key
    const oldKey = keys.find(k => k.id === id)
    if (oldKey) {
      const newKey: ManagedKey = {
        ...oldKey,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        notes: `Rotated from ${oldKey.name}`,
        name: `${oldKey.name} (v2)`,
      }
      setKeys(prev => [...prev, newKey])
    }
  }

  const getStatusColor = (status: ManagedKey['status']): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'expiring': return 'bg-yellow-100 text-yellow-700'
      case 'expired': return 'bg-red-100 text-red-700'
      case 'rotated': return 'bg-slate-100 text-slate-500'
    }
  }

  const filteredKeys = keys.filter(k => filter === 'all' || k.status === filter)

  const KeyForm = () => {
    const [form, setForm] = useState<Omit<ManagedKey, 'id'>>(
      editingKey || {
        name: '',
        type: 'symmetric',
        algorithm: 'AES-256-GCM',
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        environment: 'production',
        notes: '',
      }
    )

    const algorithms = form.type === 'symmetric'
      ? ['AES-256-GCM', 'AES-256-CBC', 'ChaCha20-Poly1305']
      : ['RSA-2048', 'RSA-4096', 'ECDSA P-256', 'ECDSA P-384', 'Ed25519']

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{editingKey ? 'Edit Key' : 'Add New Key'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Key Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Database Encryption Key"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'symmetric' | 'asymmetric', algorithm: e.target.value === 'symmetric' ? 'AES-256-GCM' : 'RSA-2048' })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="symmetric">Symmetric</option>
                <option value="asymmetric">Asymmetric</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Algorithm</label>
              <select
                value={form.algorithm}
                onChange={(e) => setForm({ ...form, algorithm: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {algorithms.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Created</label>
              <input
                type="date"
                value={form.createdAt}
                onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Expires</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Environment</label>
              <select
                value={form.environment}
                onChange={(e) => setForm({ ...form, environment: e.target.value as ManagedKey['environment'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ManagedKey['status'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="rotated">Rotated</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Purpose, rotation schedule, etc."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addOrUpdateKey(form)}
              disabled={!form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              {editingKey ? 'Update' : 'Add Key'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingKey(null) }}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.encryptionKeyManager.keys')}</h3>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            + Add Key
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          {(['all', 'active', 'expiring', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {showForm && <KeyForm />}

      <div className="space-y-2">
        {filteredKeys.map((key) => (
          <div key={key.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{key.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(key.status)}`}>
                    {key.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 rounded">
                    {key.environment}
                  </span>
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {key.algorithm} • Created: {key.createdAt} • Expires: {key.expiresAt}
                </div>
              </div>
              <div className="flex gap-1">
                {key.status !== 'rotated' && (
                  <button
                    onClick={() => rotateKey(key.id)}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Rotate
                  </button>
                )}
                <button
                  onClick={() => { setEditingKey(key); setShowForm(true) }}
                  className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteKey(key.id)}
                  className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            {key.notes && (
              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{key.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.encryptionKeyManager.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Rotate keys annually or when compromised</li>
          <li>• Use different keys for different environments</li>
          <li>• Store actual keys in a secure vault (AWS KMS, HashiCorp Vault)</li>
          <li>• This tool tracks metadata only, not actual key material</li>
        </ul>
      </div>
    </div>
  )
}
