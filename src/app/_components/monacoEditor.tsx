// components/Editor.tsx
import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface EditorProps {
    language: string;
    value: string;
    onChange: (value: string) => void;
}



const Editor: React.FC<EditorProps> = ({ language, value, onChange }) => {
    return (
        <MonacoEditor
            height="400px"
            language={language}
            value={value}
            onChange={onChange}
        />
    );
};

export default Editor;

