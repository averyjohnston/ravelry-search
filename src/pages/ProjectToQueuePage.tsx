import { useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { useLoaderData, useSubmit } from 'react-router-dom';

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

const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const projectID = formData.get('projectID');
  console.log(projectID);

  return null;
};

// TODO: if deleteProject is unchecked, do NOT add available tag, even if that one IS checked
// TODO: if project is deleted, show packs that were on it so you can manually assign them to the queue entry if needed
// TODO: filter out projects that don't have a pattern? or show an error if attempted?
// or can you add a queue entry with just the name and maybe the URL if present...?

export default function ProjectToQueuePage() {
  const projects = useLoaderData() as ProjectSmall[];
  const [deleteProject, setDeleteProject] = useState(false);
  const [addAvailableTag, setAddAvailableTag] = useState(true);
  const submit = useSubmit();

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <div id="project-to-queue-page" className="page">
      <div className="header header--sticky">
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
          <div className="card-wrapper" key={project.id}>
            <RavelryCard
              headerText={project.name}
              imageURL={project.first_photo?.small2_url}
              linkURL={`https://www.ravelry.com/projects/${USERNAME}/${project.permalink}`}
            />
            <button onClick={() => {
              const result = confirm(`Are you sure you want to transfer the project "${project.name}" to the queue? The original project will ${deleteProject ? '' : 'NOT '}be deleted${deleteProject ? ' and cannot be recovered!' : '.'}`);
              if (!result) return;
              submit({
                projectID: project.id,
                shouldDelete: deleteProject,
                shouldAddAvailTag: addAvailableTag,
              }, { method: 'post' });
            }}>Transfer</button>
          </div>
        ))}
      </div>
    </div>
  )
}

ProjectToQueuePage.loader = loader;
ProjectToQueuePage.action = action;
