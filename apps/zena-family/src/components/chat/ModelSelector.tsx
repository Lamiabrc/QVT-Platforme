import React from 'react';
import { AIModel } from '@/hooks/useZenaChat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (model: AIModel) => void;
  disabled?: boolean;
}

const modelInfo: Record<AIModel, { label: string; description: string; icon: any }> = {
  'google/gemini-2.5-flash': {
    label: 'Gemini Flash',
    description: 'Rapide et équilibré',
    icon: Zap
  },
  'google/gemini-2.5-pro': {
    label: 'Gemini Pro',
    description: 'Plus puissant',
    icon: Brain
  },
  'google/gemini-2.5-flash-lite': {
    label: 'Gemini Lite',
    description: 'Ultra rapide',
    icon: Sparkles
  },
  'openai/gpt-5': {
    label: 'GPT-5',
    description: 'Très puissant',
    icon: Brain
  },
  'openai/gpt-5-mini': {
    label: 'GPT-5 Mini',
    description: 'Équilibré',
    icon: Zap
  },
  'openai/gpt-5-nano': {
    label: 'GPT-5 Nano',
    description: 'Très rapide',
    icon: Sparkles
  }
};

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px] bg-background/50 border-border">
        <SelectValue>
          <div className="flex items-center gap-2">
            {React.createElement(modelInfo[value].icon, { className: "h-4 w-4" })}
            <span className="text-sm">{modelInfo[value].label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(modelInfo).map(([model, info]) => {
          const Icon = info.icon;
          return (
            <SelectItem key={model} value={model}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{info.label}</div>
                  <div className="text-xs text-muted-foreground">{info.description}</div>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
