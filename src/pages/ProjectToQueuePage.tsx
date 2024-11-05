import { Fragment, useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import Modal from '../components/Modal';
import RavelryCard from '../components/RavelryCard';
import type { ProjectListEndpointResult, ProjectShowEndpointResult, ProjectSmall, QueueCreateEndpointResult, QueuedProjectFull } from '../types';
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
  const projectID = formData.get('projectID')?.toString();
  const patternID = formData.get('patternID')?.toString();
  const firstTag = formData.get('firstTag')?.toString();
  const shouldTransferNotes = formData.get('shouldTransferNotes')?.toString() === 'true';
  const shouldDelete = formData.get('shouldDelete')?.toString() === 'true';
  const shouldAddAvailTag = formData.get('shouldAddAvailTag')?.toString() === 'true';

  // needed for yarn packs and notes, which aren't exposed on the project/list endpoint
  const projectResult = await get(`/projects/${USERNAME}/${projectID}.json`) as ProjectShowEndpointResult;
  const fullProject = projectResult.project;

  console.log('Full project:', fullProject);

  const deletedPacks = shouldDelete ? fullProject.packs.map(pack => ({
    stashID: pack.stash_id || 0,
    yarnName: pack.yarn_name || '',
    colorway: pack.colorway || '',
  })) : undefined;

  // if project has a pattern attached, use that; otherwise only send project's name
  const patternParam: { [key: string]: string } = patternID && patternID !== 'null' ? {
    pattern_id: patternID,
  } : {
    personal_pattern_name: formData.get('projectName')?.toString() || 'My Project',
  };

  const result = await post(`/people/${USERNAME}/queue/create.json`, {
    ...patternParam,
    tag_names: [firstTag || '', 'yarn-needed'],
    notes: shouldTransferNotes ? fullProject.notes + '\n\n' + fullProject.private_notes : '',
  }) as QueueCreateEndpointResult;

  if (shouldAddAvailTag && deletedPacks) {
    const stashUpdates = deletedPacks.map(pack => post(`/people/${USERNAME}/stash/${pack.stashID}.json`, {
      tag_list: ['available'],
    }));

    await Promise.all(stashUpdates);
  }

  return {
    createdQueueEntry: result.queued_project,
    deletedPacks,
  };
};

const shouldRevalidate: ShouldRevalidateFunction = ({ formData, defaultShouldRevalidate }) => {
  const projectDeleted = formData?.get('shouldDelete');
  return projectDeleted?.toString() === 'false' ? false : defaultShouldRevalidate;
}

// TODO: add delete functionality

export default function ProjectToQueuePage() {
  const projects = useLoaderData() as ProjectSmall[];
  const actionResult = useActionData() as ActionResult | undefined;
  const [transferNotes, setTransferNotes] = useState(true);
  const [deleteProject, setDeleteProject] = useState(false);
  const [addAvailableTag, setAddAvailableTag] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const submit = useSubmit();

  useEffect(() => {
    console.log('Projects:', projects);
  }, [projects]);

  useEffect(() => {
    console.log('Action result:', actionResult);
    if (actionResult?.createdQueueEntry) setShowModal(true);
  }, [actionResult]);

  const queueEntryURL = actionResult ? buildQueueURL(actionResult.createdQueueEntry) : '';

  return (
    <div id="project-to-queue-page" className="page">
      <div className="header header--sticky">
        <p>Select a project below to be transferred to the queue.</p>
        <div className="options">
          <label>
            <input type="checkbox" checked={transferNotes} onChange={(e) => setTransferNotes(e.target.checked)} />
            Transfer notes (incl. private)
          </label>
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
              let message = `Are you sure you want to transfer the project "${project.name}" to the queue? The original project will ${deleteProject ? '' : 'NOT '}be deleted${deleteProject ? ' and cannot be recovered!' : '.'}`;

              // doesn't seem like project API has a way to retrieve "pattern from" contents
              if (project.pattern_id === null) {
                message += '\n\n⚠️ This project does not have a Ravelry pattern attached. Links in the "Pattern from" field will NOT be carried over.';
              }

              const result = confirm(message);
              if (!result) return;
              submit({
                patternID: project.pattern_id,
                projectID: project.id,
                projectName: project.name,
                firstTag: project.tag_names.length > 0 ? project.tag_names[0] : '',
                shouldTransferNotes: transferNotes,
                shouldDelete: deleteProject,
                shouldAddAvailTag: deleteProject && addAvailableTag, // don't add avail tags if both boxes were checked at some point, but delete was unchecked later
              }, { method: 'post' });
            }}>Transfer</button>
          </div>
        ))}
      </div>
      {showModal && actionResult && <Modal handleClose={() => setShowModal(false)} confirmButtonText="OK">
        <p>Queue entry created successfully. View it here:</p>
        <p>
          <a href={queueEntryURL} target="_blank" rel="noreferrer">{queueEntryURL}</a>
        </p>
        {actionResult.deletedPacks && actionResult.deletedPacks.length > 0 && <Fragment>
          <p>The following stashed yarns were assigned to the original project. If you want them added to the new queue entry, you will need to do so manually.</p>
          <ul>
            {actionResult.deletedPacks.map(pack => (
              <li key={pack.stashID}>
                <a href={`https://www.ravelry.com/people/${USERNAME}/stash/${pack.stashID}`} target="_blank" rel="noreferrer">
                  {pack.yarnName} ({pack.colorway})
                </a>
              </li>
            ))}
          </ul>
        </Fragment>}
      </Modal>}
    </div>
  )
}

ProjectToQueuePage.loader = loader;
ProjectToQueuePage.action = action;
ProjectToQueuePage.shouldRevalidate = shouldRevalidate;

interface DeletedPack {
  stashID: number,
  yarnName: string,
  colorway: string,
}

interface ActionResult {
  createdQueueEntry: QueuedProjectFull,
  deletedPacks: DeletedPack[] | undefined,
}
