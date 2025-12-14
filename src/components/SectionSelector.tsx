'use client';

import { CheckSquare, Square, ToggleLeft, ToggleRight } from 'lucide-react';

export interface SectionSelection {
    title_description: boolean;
    installation: boolean;
    usage: boolean;
    features: boolean;
    tech_stack: boolean;
    configuration: boolean;
    api_documentation: boolean;
    contributing: boolean;
    license: boolean;
    badges: boolean;
}

const SECTION_INFO: { key: keyof SectionSelection; label: string; description: string; category: 'essential' | 'optional' | 'advanced' }[] = [
    { key: 'title_description', label: 'Title & Description', description: 'Project name and overview', category: 'essential' },
    { key: 'badges', label: 'Badges', description: 'Shields.io badges for language, license, etc.', category: 'essential' },
    { key: 'installation', label: 'Installation', description: 'How to install the project', category: 'essential' },
    { key: 'usage', label: 'Usage', description: 'Getting started guide', category: 'essential' },
    { key: 'features', label: 'Features', description: 'Key features list', category: 'optional' },
    { key: 'tech_stack', label: 'Tech Stack', description: 'Technologies used', category: 'optional' },
    { key: 'configuration', label: 'Configuration', description: 'Environment variables and config', category: 'optional' },
    { key: 'api_documentation', label: 'API Documentation', description: 'API endpoints and usage', category: 'advanced' },
    { key: 'contributing', label: 'Contributing', description: 'How to contribute', category: 'advanced' },
    { key: 'license', label: 'License', description: 'License information', category: 'essential' },
];

interface SectionSelectorProps {
    value: SectionSelection;
    onChange: (value: SectionSelection) => void;
    disabled?: boolean;
}

export function SectionSelector({ value, onChange, disabled }: SectionSelectorProps) {
    const allSelected = Object.values(value).every(v => v);
    const noneSelected = Object.values(value).every(v => !v);

    const toggleAll = () => {
        const newState = !allSelected;
        const newValue: SectionSelection = {
            title_description: newState,
            installation: newState,
            usage: newState,
            features: newState,
            tech_stack: newState,
            configuration: newState,
            api_documentation: newState,
            contributing: newState,
            license: newState,
            badges: newState,
        };
        onChange(newValue);
    };

    const toggleSection = (key: keyof SectionSelection) => {
        onChange({ ...value, [key]: !value[key] });
    };

    const categories = ['essential', 'optional', 'advanced'] as const;
    const categoryLabels = {
        essential: 'Essential',
        optional: 'Optional',
        advanced: 'Advanced',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-200">
                    README Sections
                </label>
                <button
                    type="button"
                    onClick={toggleAll}
                    disabled={disabled}
                    className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {allSelected ? (
                        <>
                            <ToggleRight className="h-4 w-4" />
                            Deselect All
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="h-4 w-4" />
                            Select All
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {categories.map(category => (
                    <div key={category} className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {categoryLabels[category]}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {SECTION_INFO.filter(s => s.category === category).map(section => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => toggleSection(section.key)}
                                    disabled={disabled}
                                    className={`
                    flex items-start gap-3 p-3 rounded-lg text-left
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${value[section.key]
                                            ? 'bg-purple-900/30 border border-purple-500/50'
                                            : 'bg-gray-800/30 border border-gray-700 hover:border-gray-600'
                                        }
                  `}
                                >
                                    <div className="mt-0.5">
                                        {value[section.key] ? (
                                            <CheckSquare className="h-4 w-4 text-purple-400" />
                                        ) : (
                                            <Square className="h-4 w-4 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-200">
                                            {section.label}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {section.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const DEFAULT_SECTIONS: SectionSelection = {
    title_description: true,
    installation: true,
    usage: true,
    features: false,
    tech_stack: true,
    configuration: false,
    api_documentation: false,
    contributing: true,
    license: true,
    badges: true,
};
