import React, { memo, useState } from 'react'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react';
import { NodeSelector } from './node-selector';

export const AddNodeButton = memo(() => {

    const [selector, setselector] = useState(false)
    return (
        <NodeSelector
            open={selector}
            onOpenChange={setselector}
        >
            <Button
                onClick={() => { }}
                size="icon"
                variant="outline"
                className="bg-background"
            >
                <PlusIcon />
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = 'AddNodeButton';