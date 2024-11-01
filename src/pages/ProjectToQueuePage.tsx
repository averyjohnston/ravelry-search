import { useEffect, useState } from 'react';
import { type LoaderFunction, useLoaderData } from 'react-router-dom';

import RavelryCard from '../components/RavelryCard';
import type { ProjectListEndpointResult, ProjectSmall } from '../types';
import { get, USERNAME } from '../utils';

import './ProjectToQueuePage.scss';

const loader: LoaderFunction = async () => {
  const result = await get(`/projects/${USERNAME}/list.json`, {
    sort: 'status completed_ status_changed_', // WIPs, recent first
  }) as ProjectListEndpointResult;

  return result.projects;
};

// TODO: if deleteProject is unchecked, do NOT add available tag, even if that one IS checked
// TODO: if project is deleted, show packs that were on it so you can manually assign them to the queue entry if needed

export default function ProjectToQueuePage() {
  const projects = useLoaderData() as ProjectSmall[];
  const [deleteProject, setDeleteProject] = useState(false);
  const [addAvailableTag, setAddAvailableTag] = useState(true);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <div id="project-to-queue-page" className="page">
      <div className="header">
        <p>Select a project below to be transferred to the queue.</p>
        <div className="options">
          <label>
            <input type="checkbox" checked={deleteProject} onChange={(e) => setDeleteProject(e.target.checked)} />
            Delete project when done
          </label>
          {deleteProject && <label>
            <input type="checkbox" checked={addAvailableTag} onChange={(e) => setAddAvailableTag(e.target.checked)} />
            Add &quot;available&quot; tag to stash entries
          </label>}
        </div>
      </div>
      <div className="content card-grid">
        {projects.map(project => (
          <RavelryCard
            key={project.id}
            headerText={project.name}
            imageURL={project.first_photo?.small2_url}
            linkURL={`https://www.ravelry.com/projects/${USERNAME}/${project.permalink}`}
          />
        ))}
      </div>
    </div>
  )
}

ProjectToQueuePage.loader = loader;
