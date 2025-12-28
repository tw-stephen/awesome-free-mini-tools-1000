import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface License {
  id: string
  name: string
  description: string
  permissions: string[]
  limitations: string[]
  template: string
}

export default function LicenseGenerator() {
  const { t } = useTranslation()
  const [selectedLicense, setSelectedLicense] = useState('mit')
  const [fullName, setFullName] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [projectName, setProjectName] = useState('')
  const { copy, copied } = useClipboard()

  const licenses: License[] = [
    {
      id: 'mit',
      name: 'MIT License',
      description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      limitations: ['Liability', 'Warranty'],
      template: `MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
    },
    {
      id: 'apache-2.0',
      name: 'Apache License 2.0',
      description: 'A permissive license that also provides an express grant of patent rights from contributors to users.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
      limitations: ['Trademark use', 'Liability', 'Warranty'],
      template: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright [year] [fullname]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`
    },
    {
      id: 'gpl-3.0',
      name: 'GNU GPL v3',
      description: 'A strong copyleft license that requires making available complete source code of licensed works and modifications.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
      limitations: ['Liability', 'Warranty'],
      template: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) [year] [fullname]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`
    },
    {
      id: 'bsd-3',
      name: 'BSD 3-Clause',
      description: 'A permissive license similar to the MIT License, but with a clause that prohibits using the name of the project for endorsement.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      limitations: ['Liability', 'Warranty'],
      template: `BSD 3-Clause License

Copyright (c) [year], [fullname]
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`
    },
    {
      id: 'isc',
      name: 'ISC License',
      description: 'A permissive license functionally equivalent to the BSD 2-Clause and MIT licenses, but with simplified language.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      limitations: ['Liability', 'Warranty'],
      template: `ISC License

Copyright (c) [year], [fullname]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`
    },
    {
      id: 'unlicense',
      name: 'The Unlicense',
      description: 'A license with no conditions whatsoever which dedicates works to the public domain.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      limitations: ['Liability', 'Warranty'],
      template: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`
    },
  ]

  const currentLicense = licenses.find(l => l.id === selectedLicense)

  const output = useMemo(() => {
    if (!currentLicense) return ''
    return currentLicense.template
      .replace(/\[year\]/g, year)
      .replace(/\[fullname\]/g, fullName || '[Your Name]')
      .replace(/\[project\]/g, projectName || '[Project Name]')
  }, [currentLicense, year, fullName, projectName])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.licenseGenerator.selectLicense')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {licenses.map(license => (
            <button
              key={license.id}
              onClick={() => setSelectedLicense(license.id)}
              className={`p-3 text-left rounded border ${
                selectedLicense === license.id
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <p className="font-medium text-sm">{license.name}</p>
            </button>
          ))}
        </div>
      </div>

      {currentLicense && (
        <div className="card p-4 bg-blue-50 border border-blue-200">
          <h4 className="font-medium text-blue-700">{currentLicense.name}</h4>
          <p className="text-sm text-blue-600 mt-1">{currentLicense.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-blue-700 font-medium mb-1">{t('tools.licenseGenerator.permissions')}</p>
              <ul className="text-xs text-blue-600 space-y-0.5">
                {currentLicense.permissions.map(p => (
                  <li key={p} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-blue-700 font-medium mb-1">{t('tools.licenseGenerator.limitations')}</p>
              <ul className="text-xs text-blue-600 space-y-0.5">
                {currentLicense.limitations.map(l => (
                  <li key={l} className="flex items-center gap-1">
                    <span className="text-red-500">✕</span> {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.licenseGenerator.details')}
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.licenseGenerator.year')}
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.licenseGenerator.fullName')}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.licenseGenerator.projectName')}
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Project"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            LICENSE
          </h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800 whitespace-pre-wrap">{output}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.licenseGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.licenseGenerator.tip1')}</li>
          <li>{t('tools.licenseGenerator.tip2')}</li>
          <li>{t('tools.licenseGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
