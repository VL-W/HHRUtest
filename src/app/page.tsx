"use client";
import { useState } from 'react';
import Editor from './_components/monacoEditor';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

const Home = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const compile = api.code.compile.useMutation({
    onSuccess: (data) => {
      setOutput(data.output);
      setError(null);
      setIsRunning(false);
    },
    onError: (err) => {
      setError(err.message);
      setOutput('');
      setIsRunning(false);
    },
  });

  const handleRunCode = () => {
    setIsRunning(true);
    compile.mutate({ language, code });
  };

  return (
    <div className="h-screen w-screen p-0 m-0 overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        <ResizablePanel defaultSize={70}>
          <Editor language={language} value={code} onChange={setCode} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={20}>
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleRunCode}>
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
                <h1>TASK EXAMPLE:</h1>
                <p>Create hello world app using python</p>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <div className="p-4 overflow-auto">
                {output && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <h2>Output:</h2>
                    <pre>{output}</pre>
                  </div>
                )}
                {error && (
                  <div style={{ color: 'red' }}>
                    <h2>Error:</h2>
                    <pre>{error}</pre>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Home;

