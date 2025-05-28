import { Badge } from '@/components/ui/badge';
import React from 'react'
import SidebarButton from './SidebarButton';
import { TopNavUser } from './TopNavUser';
import { usePropertiesPanel } from '@/hooks/usePropertiesPanel';

export default function Header() {    
    const { isOpen } = usePropertiesPanel();   

    return (
        <div className="min-h-16 sticky top-0 border-b border-border/50 flex items-center px-4 justify-between gap-4">
        <div className="flex items-center gap-4">
            <SidebarButton offset={true} />
            <div className="flex items-center gap-3">
            <span className="font-medium">Realyze</span>
            <Badge
                variant="secondary"
                className="bg-secondary/30 text-xs font-normal rounded-full"
            >
                <a
                href="https://floo.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                >
                By Floo
                </a>
            </Badge>
            </div>
        </div>
        {!isOpen && <TopNavUser />}
        </div>
    );
}
