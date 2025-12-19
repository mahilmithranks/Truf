import React from 'react';
import { formatTime } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    isBlocked: boolean;
}

interface SlotCardProps {
    slot: Slot;
    selected: boolean;
    onSelect: (slotId: string) => void;
}

export default function SlotCard({ slot, selected, onSelect }: SlotCardProps) {
    const isAvailable = !slot.isBooked && !slot.isBlocked;

    const handleClick = () => {
        if (isAvailable) {
            onSelect(slot.id);
        }
    };

    const getStatusConfig = () => {
        if (slot.isBlocked) {
            return {
                icon: Lock,
                label: 'Blocked',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-300',
                textColor: 'text-gray-600',
                iconColor: 'text-gray-500',
                cursor: 'cursor-not-allowed',
            };
        }
        if (slot.isBooked) {
            return {
                icon: XCircle,
                label: 'Booked',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-700',
                iconColor: 'text-red-500',
                cursor: 'cursor-not-allowed',
            };
        }
        if (selected) {
            return {
                icon: CheckCircle2,
                label: 'Selected',
                bgColor: 'bg-gradient-to-br from-blue-600 to-purple-600',
                borderColor: 'border-transparent',
                textColor: 'text-white',
                iconColor: 'text-white',
                cursor: 'cursor-pointer',
            };
        }
        return {
            icon: Clock,
            label: 'Available',
            bgColor: 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50',
            borderColor: 'border-gray-200 hover:border-blue-300',
            textColor: 'text-gray-900',
            iconColor: 'text-green-500',
            cursor: 'cursor-pointer',
        };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div
            onClick={handleClick}
            className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300',
                config.bgColor,
                config.borderColor,
                config.cursor,
                isAvailable && 'hover:shadow-lg hover:scale-105',
                selected && 'shadow-xl scale-105 ring-4 ring-blue-200 animate-pulse'
            )}>
            {/* Status Icon */}
            <div className="flex items-center justify-between mb-3">
                <Icon className={cn('w-5 h-5', config.iconColor)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wide', config.textColor)}>
                    {config.label}
                </span>
            </div>

            {/* Time Display */}
            <div className={cn('text-center', config.textColor)}>
                <div className="text-lg font-bold mb-1">
                    {formatTime(slot.startTime)}
                </div>
                <div className="text-xs opacity-75">to</div>
                <div className="text-lg font-bold mt-1">
                    {formatTime(slot.endTime)}
                </div>
            </div>

            {/* Selected Indicator */}
            {selected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
            )}
        </div>
    );
}
