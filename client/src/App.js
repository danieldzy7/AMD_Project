import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectTable from './components/ProjectTable';
import ProjectForm from './components/ProjectForm';
import Timeline from './components/Timeline';
import ResourcePlanning from './components/ResourcePlanning';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
              <div className="container mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<ProjectTable />} />
                  <Route path="/projects/new" element={<ProjectForm />} />
                  <Route path="/projects/edit/:id" element={<ProjectForm />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/resources" element={<ResourcePlanning />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App; 