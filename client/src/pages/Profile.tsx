import { useEffect, useState } from 'react';
import { userService, type FullProfile } from '../services/userService';

export default function Profile() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const update = (field: keyof FullProfile, value: string) => {
    setProfile((p) => (p ? { ...p, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await userService.updateProfile({
        name: profile.name,
        education: profile.education,
        experience: profile.experience,
        skills: profile.skills,
        portfolio: profile.portfolio,
        linkedin: profile.linkedin,
        github: profile.github,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--color-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              Keep your career info up to date
            </p>
          </div>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : saved ? '✅ Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="card space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="input-field" value={profile.name} onChange={(e) => update('name', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input-field" value={profile.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <input
              className="input-field"
              placeholder="e.g. BS Computer Science, LUMS"
              value={profile.education || ''}
              onChange={(e) => update('education', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. 2 years as Frontend Developer at XYZ"
              value={profile.experience || ''}
              onChange={(e) => update('experience', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <input
              className="input-field"
              placeholder="React, TypeScript, Node.js, MongoDB"
              value={profile.skills || ''}
              onChange={(e) => update('skills', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Portfolio</label>
              <input
                className="input-field"
                placeholder="https://..."
                value={profile.portfolio || ''}
                onChange={(e) => update('portfolio', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                className="input-field"
                placeholder="https://linkedin.com/in/..."
                value={profile.linkedin || ''}
                onChange={(e) => update('linkedin', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <input
                className="input-field"
                placeholder="https://github.com/..."
                value={profile.github || ''}
                onChange={(e) => update('github', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}