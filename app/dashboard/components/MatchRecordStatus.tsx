'use client';

import { Chip } from '@heroui/react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export type MatchStatus = 'checked' | 'unchecked' | 'check-failed';

interface MatchRecordStatusProps {
  status: MatchStatus;
}

export function MatchRecordStatus({ status }: MatchRecordStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'checked':
        return {
          color: 'success' as const,
          variant: 'flat' as const,
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Checked',
        };
      case 'check-failed':
        return {
          color: 'danger' as const,
          variant: 'flat' as const,
          icon: <XCircle className="w-4 h-4" />,
          label: 'Check Failed',
        };
      case 'unchecked':
      default:
        return {
          color: 'warning' as const,
          variant: 'flat' as const,
          icon: <Clock className="w-4 h-4" />,
          label: 'Unchecked',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      color={config.color}
      variant={config.variant}
      size="sm"
      startContent={config.icon}
    >
      {config.label}
    </Chip>
  );
}
