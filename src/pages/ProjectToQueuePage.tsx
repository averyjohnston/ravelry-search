import { useState } from 'react';
import type { LoaderFunction } from 'react-router-dom';

import './ProjectToQueuePage.scss';

const loader: LoaderFunction = () => {
  return null;
};

// TODO: if deleteProject is unchecked, do NOT add available tag, even if that one IS checked

export default function ProjectToQueuePage() {
  const [deleteProject, setDeleteProject] = useState(false);
  const [addAvailableTag, setAddAvailableTag] = useState(true);

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
      <div className="content" />
    </div>
  )
}

ProjectToQueuePage.loader = loader;
