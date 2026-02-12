
import React, { useState } from 'react';
import { ProjectNode } from '../types';
import { ARCHITECTURE_STRUCTURE } from '../constants';

const NodeItem: React.FC<{ node: ProjectNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors
          ${depth === 0 ? 'bg-slate-100 font-bold' : 'hover:bg-slate-100'}
        `}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-400 w-4">
          {hasChildren ? (isOpen ? '▼' : '▶') : ''}
        </span>
        <span className="text-xl">
          {node.type === 'folder' ? '📁' : '📄'}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{node.name}</span>
          {node.description && <span className="text-[10px] text-slate-400 italic font-normal">{node.description}</span>}
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="animate-fadeIn">
          {node.children!.map((child) => (
            <NodeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderTree: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Blueprint</h2>
          <p className="text-slate-500">Enterprise Full-Stack Architecture Structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-h-[70vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">File Explorer</h3>
          {ARCHITECTURE_STRUCTURE.map((root) => (
            <NodeItem key={root.id} node={root} depth={0} />
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 space-y-6 border border-slate-800 shadow-2xl">
            <h3 className="text-emerald-400 font-bold text-xl flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Architectural Design Decisions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-white font-bold">Frontend Stack</h4>
                <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                  <li>React 18 with TypeScript</li>
                  <li>Vite for fast bundling</li>
                  <li>Tailwind for atomic styling</li>
                  <li>Lucide-react for iconography</li>
                  <li>Zustand/Redux for state mgmt</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold">Backend Stack</h4>
                <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                  <li>Python FastAPI (Async)</li>
                  <li>PostgreSQL with SQLAlchemy</li>
                  <li>JWT (OAuth2) Security</li>
                  <li>Pydantic for Data Validation</li>
                  <li>Dockerized deployment</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold">AI/ML Layer</h4>
                <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                  <li>TensorFlow/Keras integration</li>
                  <li>REST-based Inference API</li>
                  <li>Scalable Worker Nodes (Celery)</li>
                  <li>Preprocessing pipeline scripts</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold">Infrastructure</h4>
                <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                  <li>Docker Compose orchestration</li>
                  <li>Nginx Reverse Proxy</li>
                  <li>CI/CD ready structure</li>
                  <li>Structured logging (ELK stack)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
             <h4 className="text-emerald-900 font-bold mb-2">Production Deployment Ready</h4>
             <p className="text-emerald-700 text-sm leading-relaxed">
               This folder structure follows the <strong>Separation of Concerns</strong> principle, ensuring that AI model training and inference are decoupled from the web application's business logic, allowing for independent scaling of compute-intensive detection services.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderTree;
