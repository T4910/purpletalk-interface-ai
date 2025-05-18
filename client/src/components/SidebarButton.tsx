import { PanelLeftIcon } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';

export default function SidebarButton({ offset = false }) {
    const { toggleSidebar, open } = useSidebar();

    // if (offset && open) return null
    
    return (
        <Button
            variant="ghost"
            size="icon"
            className={`w-10 p-0 bg-sidebar rounded-md ${offset && open ? 'lg:hidden' : ''}`}
            onClick={toggleSidebar}
        >
        <PanelLeftIcon className="size-6" />
        </Button>
    );
}
