import { useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import Modal from '../components/Modal';
import RavelryCard from '../components/RavelryCard';
import type { ProjectListEndpointResult, ProjectSmall, QueueCreateEndpointResult, QueuedProjectFull } from '../types';
import { buildQueueURL, get, post, USERNAME } from '../utils';

import './ProjectToQueuePage.scss';

const loader: LoaderFunction = async () => {
  const result = await get(`/projects/${USERNAME}/list.json`, {
    sort: 'status completed_ status_changed_', // WIPs, recent first
  }) as ProjectListEndpointResult;

  return result.projects;
};

const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const patternID = formData.get('patternID')?.toString();
  const firstTag = formData.get('firstTag')?.toString();

  const result = await post(`/people/${USERNAME}/queue/create.json`, {
    pattern_id: patternID || '',
    tag_names: [firstTag || '', 'yarn-needed'],
  }) as QueueCreateEndpointResult;

  return result.queued_project;
};

const shouldRevalidate: ShouldRevalidateFunction = ({ formData, defaultShouldRevalidate }) => {
  const projectDeleted = formData?.get('shouldDelete');
  return projectDeleted?.toString() === 'false' ? false : defaultShouldRevalidate;
}

// TODO: if project is deleted, show packs that were on it so you can manually assign them to the queue entry if needed
// TODO: filter out projects that don't have a pattern? or show an error if attempted?
// or can you add a queue entry with just the name and maybe the URL if present...?
// TODO: only after queue adding is done and stable, add delete/avail tag functionality

export default function ProjectToQueuePage() {
  const projects = useLoaderData() as ProjectSmall[];
  const createdQueueEntry = useActionData() as QueuedProjectFull || null;
  const [deleteProject, setDeleteProject] = useState(false);
  const [addAvailableTag, setAddAvailableTag] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const submit = useSubmit();

  useEffect(() => {
    console.log('Projects:', projects);
  }, [projects]);

  useEffect(() => {
    console.log('Queue entry:', createdQueueEntry);
    if (createdQueueEntry !== null) setShowModal(true);
  }, [createdQueueEntry]);

  const queueEntryURL = createdQueueEntry !== null ? buildQueueURL(createdQueueEntry) : '';

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
                patternID: project.pattern_id,
                firstTag: project.tag_names.length > 0 ? project.tag_names[0] : '',
                shouldDelete: deleteProject,
                shouldAddAvailTag: deleteProject && addAvailableTag, // don't add avail tags if both boxes were checked at some point, but delete was unchecked later
              }, { method: 'post' });
            }}>Transfer</button>
          </div>
        ))}
      </div>
      {showModal && createdQueueEntry && <Modal handleClose={() => setShowModal(false)} confirmButtonText="OK">
        <p>Queue entry created successfully. View it here:</p>
        <p>
          <a href={queueEntryURL} target="_blank" rel="noreferrer">{queueEntryURL}</a>
        </p>
      </Modal>}
    </div>
  )
}

ProjectToQueuePage.loader = loader;
ProjectToQueuePage.action = action;
ProjectToQueuePage.shouldRevalidate = shouldRevalidate;
