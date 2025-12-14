'use client';

export type Tone = 'professional' | 'friendly' | 'technical' | 'marketing';

const TONES: { value: Tone; label: string; description: string; emoji: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Clear and business-appropriate', emoji: '💼' },
    { value: 'friendly', label: 'Friendly', description: 'Welcoming and approachable', emoji: '👋' },
    { value: 'technical', label: 'Technical', description: 'Detailed and precise', emoji: '🔧' },
    { value: 'marketing', label: 'Marketing', description: 'Highlights benefits and value', emoji: '🚀' },
];

interface ToneSelectorProps {
    value: Tone;
    onChange: (value: Tone) => void;
    disabled?: boolean;
}

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
                Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
                {TONES.map(tone => (
                    <button
                        key={tone.value}
                        type="button"
                        onClick={() => onChange(tone.value)}
                        disabled={disabled}
                        className={`
              p-3 rounded-lg text-left
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${value === tone.value
                                ? 'bg-purple-900/30 border border-purple-500/50'
                                : 'bg-gray-800/30 border border-gray-700 hover:border-gray-600'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            <span>{tone.emoji}</span>
                            <span className="text-sm font-medium text-gray-200">{tone.label}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{tone.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
