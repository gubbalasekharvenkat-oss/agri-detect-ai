
import { ProjectNode } from './types';

export const ARCHITECTURE_STRUCTURE: ProjectNode[] = [
  {
    id: 'root',
    name: 'agri-detect-ai',
    type: 'folder',
    children: [
      {
        id: 'frontend',
        name: 'frontend',
        type: 'folder',
        description: 'React + Vite + Tailwind SPA',
        children: [
          { id: 'f-src', name: 'src', type: 'folder', children: [
            { id: 'f-api', name: 'api', type: 'folder', children: [{ id: 'f-client', name: 'client.ts', type: 'file' }] },
            { id: 'f-comp', name: 'components', type: 'folder' },
            { id: 'f-hooks', name: 'hooks', type: 'folder' },
            { id: 'f-store', name: 'store', type: 'folder' },
            { id: 'f-types', name: 'types', type: 'folder' }
          ]},
          { id: 'f-vite', name: 'vite.config.ts', type: 'file' },
          { id: 'f-tw', name: 'tailwind.config.js', type: 'file' }
        ]
      },
      {
        id: 'backend',
        name: 'backend',
        type: 'folder',
        description: 'FastAPI REST API',
        children: [
          { id: 'b-app', name: 'app', type: 'folder', children: [
            { id: 'b-api', name: 'api', type: 'folder', children: [
              { id: 'b-v1', name: 'v1', type: 'folder', children: [
                { id: 'b-auth', name: 'auth.py', type: 'file' },
                { id: 'b-detect', name: 'detection.py', type: 'file' }
              ]}
            ]},
            { id: 'b-core', name: 'core', type: 'folder', description: 'JWT, Config, Security' },
            { id: 'b-db', name: 'db', type: 'folder', description: 'SQLAlchemy/PostgreSQL models' },
            { id: 'b-schemas', name: 'schemas', type: 'folder', description: 'Pydantic models' },
            { id: 'b-serv', name: 'services', type: 'folder', description: 'Business logic' }
          ]},
          { id: 'b-main', name: 'main.py', type: 'file' },
          { id: 'b-req', name: 'requirements.txt', type: 'file' }
        ]
      },
      {
        id: 'ai-model',
        name: 'ai-model',
        type: 'folder',
        description: 'TensorFlow/Keras model service',
        children: [
          { id: 'ai-train', name: 'training', type: 'folder' },
          { id: 'ai-weights', name: 'weights', type: 'folder' },
          { id: 'ai-infer', name: 'inference.py', type: 'file' },
          { id: 'ai-proc', name: 'preprocessing.py', type: 'file' }
        ]
      },
      {
        id: 'docker',
        name: 'docker',
        type: 'folder',
        description: 'Infrastructure as Code',
        children: [
          { id: 'd-comp', name: 'docker-compose.yml', type: 'file' },
          { id: 'd-api', name: 'Dockerfile.api', type: 'file' },
          { id: 'd-web', name: 'Dockerfile.web', type: 'file' },
          { id: 'd-nginx', name: 'nginx.conf', type: 'file' }
        ]
      }
    ]
  }
];
