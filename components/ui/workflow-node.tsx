import { NodeToolbar, Position } from '@xyflow/react';
import React, { ReactNode } from 'react'
import { Button } from './button';
import { SettingsIcon, TrashIcon } from 'lucide-react';


interface WorkflowNodeProps {
    children?: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

const WorkflowNode = ({
    children,
    showToolbar = true,
    onDelete,
    onSettings,
    name,
    description,
}: WorkflowNodeProps) => {
    return (
        <>
            {
                showToolbar && (
                    <NodeToolbar>
                        <Button
                            variant="ghost"
                            size='sm'
                            onClick={onSettings}
                        >
                            <SettingsIcon
                                className='size-4'
                            />
                        </Button>

                        <Button
                            variant="ghost"
                            size='sm'
                            onClick={onDelete}
                        >
                            <TrashIcon
                                className='size-4'
                            />
                        </Button>
                    </NodeToolbar>
                )
            }

            {children}
            
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className='max-w-[200px] text-center'
                >
                    <p className='font-medium'>
                        {name}
                    </p>
                    {
                        description && (
                            <p className='text-sm truncate text-muted-foreground'>
                                {description}
                            </p>
                        )
                    }
                </NodeToolbar>
            )}
        </>
    )
}

export default WorkflowNode