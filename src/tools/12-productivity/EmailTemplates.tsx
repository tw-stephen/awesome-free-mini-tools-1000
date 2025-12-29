import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Template {
  id: string
  name: string
  subject: string
  body: string
  category: string
}

export default function EmailTemplates() {
  const { t } = useTranslation()
  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'Meeting Request',
      subject: 'Meeting Request: [Topic]',
      body: `Dear [Name],

I hope this email finds you well. I would like to schedule a meeting to discuss [topic].

Would you be available on [date] at [time]? The meeting should take approximately [duration].

Please let me know if this works for you or suggest an alternative time.

Best regards,
[Your Name]`,
      category: 'business'
    },
    {
      id: '2',
      name: 'Follow Up',
      subject: 'Following Up: [Previous Topic]',
      body: `Hi [Name],

I wanted to follow up on our previous conversation about [topic].

[Add your follow-up content here]

Please let me know if you have any questions or need any additional information.

Best regards,
[Your Name]`,
      category: 'business'
    },
    {
      id: '3',
      name: 'Thank You',
      subject: 'Thank You',
      body: `Dear [Name],

I wanted to take a moment to thank you for [reason].

Your [support/help/guidance] has been invaluable, and I truly appreciate it.

Thank you again for everything.

Warm regards,
[Your Name]`,
      category: 'personal'
    },
    {
      id: '4',
      name: 'Project Update',
      subject: 'Project Update: [Project Name]',
      body: `Hi Team,

Here's a quick update on [Project Name]:

Progress:
- [Completed task 1]
- [Completed task 2]

Next Steps:
- [Upcoming task 1]
- [Upcoming task 2]

Timeline: [Current status]

Please let me know if you have any questions.

Best,
[Your Name]`,
      category: 'business'
    },
    {
      id: '5',
      name: 'Introduction',
      subject: 'Introduction: [Your Name] - [Context]',
      body: `Dear [Name],

My name is [Your Name], and I am reaching out because [reason].

[Brief background about yourself]

I would love the opportunity to [purpose of contact].

Would you be available for a brief call or meeting?

Best regards,
[Your Name]
[Your Title]
[Contact Information]`,
      category: 'networking'
    },
    {
      id: '6',
      name: 'Apology',
      subject: 'Apology for [Issue]',
      body: `Dear [Name],

I want to sincerely apologize for [issue/mistake].

[Explanation without making excuses]

I am taking the following steps to ensure this doesn't happen again:
- [Action 1]
- [Action 2]

I value our relationship and hope we can move forward.

Sincerely,
[Your Name]`,
      category: 'personal'
    },
    {
      id: '7',
      name: 'Job Application',
      subject: 'Application for [Position] - [Your Name]',
      body: `Dear Hiring Manager,

I am writing to express my interest in the [Position] role at [Company Name].

[Why you're interested in this role and company]

My relevant experience includes:
- [Experience 1]
- [Experience 2]
- [Experience 3]

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills align with your needs.

Thank you for your consideration.

Best regards,
[Your Name]
[Phone Number]
[LinkedIn Profile]`,
      category: 'career'
    },
    {
      id: '8',
      name: 'Out of Office',
      subject: 'Out of Office: [Dates]',
      body: `Thank you for your email. I am currently out of the office from [start date] to [end date] with limited access to email.

For urgent matters, please contact [Alternative Contact Name] at [email/phone].

I will respond to your email upon my return.

Best regards,
[Your Name]`,
      category: 'business'
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', 'business', 'personal', 'networking', 'career']

  const filteredTemplates = filterCategory === 'all'
    ? templates
    : templates.filter(t => t.category === filterCategory)

  const copyToClipboard = async (text: string, type: 'subject' | 'body') => {
    await navigator.clipboard.writeText(text)
    if (type === 'subject') {
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 2000)
    } else {
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-600 block mb-2">
          {t('tools.emailTemplates.filterCategory')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                filterCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.emailTemplates.categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`card p-3 text-left hover:bg-slate-50 ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-slate-500 capitalize">{template.category}</div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="card p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-600">
                {t('tools.emailTemplates.subject')}
              </label>
              <button
                onClick={() => copyToClipboard(selectedTemplate.subject, 'subject')}
                className="text-xs text-blue-500"
              >
                {copiedSubject ? t('tools.emailTemplates.copied') : t('tools.emailTemplates.copy')}
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded text-sm">
              {selectedTemplate.subject}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-600">
                {t('tools.emailTemplates.body')}
              </label>
              <button
                onClick={() => copyToClipboard(selectedTemplate.body, 'body')}
                className="text-xs text-blue-500"
              >
                {copiedBody ? t('tools.emailTemplates.copied') : t('tools.emailTemplates.copy')}
              </button>
            </div>
            <pre className="p-3 bg-slate-50 rounded text-sm whitespace-pre-wrap font-sans">
              {selectedTemplate.body}
            </pre>
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.emailTemplates.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.emailTemplates.tip1')}</li>
          <li>- {t('tools.emailTemplates.tip2')}</li>
          <li>- {t('tools.emailTemplates.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
