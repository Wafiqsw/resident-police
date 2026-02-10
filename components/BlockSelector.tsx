'use client';

import React, { useState } from 'react';

interface Block {
    id: string;
    label: string;
}

interface BlockSelectorProps {
    title?: string;
    blocks?: Block[];
    onBlockSelect?: (blockId: string) => void;
    columns?: number;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({
    title = 'Please select a block',
    blocks = [
        { id: 'A1', label: 'A1' },
        { id: 'A2', label: 'A2' },
        { id: 'B1', label: 'B1' },
        { id: 'B2', label: 'B2' },
        { id: 'C1', label: 'C1' },
        { id: 'C2', label: 'C2' },
        { id: 'D1', label: 'D1' },
        { id: 'D2', label: 'D2' },
        { id: 'E1', label: 'E1' },
        { id: 'E2', label: 'E2' },
        { id: 'F1', label: 'F1' },
        { id: 'F2', label: 'F2' },
        { id: 'G1', label: 'G1' },
        { id: 'G2', label: 'G2' },
        { id: 'H1', label: 'H1' },
        { id: 'H2', label: 'H2' },
    ],
    onBlockSelect,
    columns = 4,
}) => {
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    const handleBlockClick = (blockId: string) => {
        setSelectedBlock(blockId);
        if (onBlockSelect) {
            onBlockSelect(blockId);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm text-gray-600 mb-6">{title}</h3>

            <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {blocks.map((block) => (
                    <button
                        key={block.id}
                        onClick={() => handleBlockClick(block.id)}
                        className={`
              relative px-6 py-8 rounded-xl border-2 transition-all duration-200
              ${selectedBlock === block.id
                                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                            }
            `}
                    >
                        <span
                            className={`text-lg font-semibold ${selectedBlock === block.id ? 'text-indigo-700' : 'text-gray-700'
                                }`}
                        >
                            {block.label}
                        </span>

                        {selectedBlock === block.id && (
                            <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {selectedBlock && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-700">
                        <span className="font-semibold">Selected Block:</span> {selectedBlock}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BlockSelector;
