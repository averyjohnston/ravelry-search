import { useEffect } from 'react';
import type { LoaderFunction } from 'react-router-dom';
import { Form, useLoaderData } from 'react-router-dom';

import DetailsDisplay from '../components/DetailsDisplay';
import type { ProjectList, ProjectSearchEndpointResult, QueuedProjectFull, QueueListEndpointResult, QueueShowEndPointResult, StashList, StashSearchEndpointResult } from '../types';
import { buildQueueURL, formatDatetime, get, pickRandomItem, USERNAME } from '../utils';

import './RandomPickerPage.scss';

async function loadRandomQueueItem(params?: { [key: string]: string }) {
  const queueSearchResult = await get(`/people/${USERNAME}/queue/list.json`, {
    page_size: '500',
    ...params,
  }) as QueueListEndpointResult;

  const randomItem = pickRandomItem(queueSearchResult.queued_projects);
  const fullResult = await get(`/people/${USERNAME}/queue/${randomItem.id}.json`) as QueueShowEndPointResult;
  return fullResult.queued_project;
}

const loader: LoaderFunction = async ({ request }) => {
  const choice = new URL(request.url).searchParams.get('choice');

  switch(choice) {
    case 'queue': {
      const result = await loadRandomQueueItem();

      return {
        choice,
        randomItem: result,
      };
    }

    case 'queue-ready': {
      const result = await loadRandomQueueItem({
        query_type: 'tags',
        query: 'ready-to-make',
      });

      return {
        choice,
        randomItem: result,
      };
    }

    case 'stash': {
      // stash/list endpoint includes used up yarns, with no way to filter them out
      const stashSearchResult = await get('/stash/search.json', {
        page_size: '500',
        user: USERNAME || '',
        'stash-status': 'stash',
      }) as StashSearchEndpointResult;

      return {
        choice,
        randomItem: pickRandomItem(stashSearchResult.stashes),
      };
    }

    case 'wip': {
      const projectSearchResult = await get('/projects/search.json', {
        page_size: '500',
        by: USERNAME || '',
        status: 'in-progress',
        sort: 'started',
      }) as ProjectSearchEndpointResult;

      return {
        choice,
        randomItem: pickRandomItem(projectSearchResult.projects),
      }
    }

    default: return null;
  }
};

function buildQueueEntryDisplay(queueEntry: QueuedProjectFull) {
  return (
    <DetailsDisplay
      photoURL={queueEntry.best_photo?.small2_url}
      linkURL={buildQueueURL(queueEntry)}
      name={queueEntry.pattern?.name || queueEntry.name}
      details={[
        {
          label: 'Queued on:',
          value: formatDatetime(queueEntry.created_at),
        },
        {
          label: 'Craft:',
          value: queueEntry.pattern?.craft.name || 'Unknown',
        },
        {
          label: 'Yarn weight:',
          value: queueEntry.pattern?.yarn_weight?.name || 'Unknown',
        },
        {
          label: 'Yarn assigned?',
          value: queueEntry.queued_stashes.length > 0 ? '✔️' : '❌',
        },
      ]}
    />
  );
}

function buildStashEntryDisplay(stashEntry: StashList) {
  return (
    <DetailsDisplay
      photoURL={stashEntry.first_photo?.small2_url}
      linkURL={`https://www.ravelry.com/people/${USERNAME}/stash/${stashEntry.permalink}`}
      name={stashEntry.name}
      details={[
        {
          label: 'Stashed on:',
          value: formatDatetime(stashEntry.created_at),
        },
        {
          label: 'Yarn weight:',
          value: stashEntry.yarn_weight_name,
        },
        {
          label: 'Available?',
          value: stashEntry.tag_names.includes('available') ? '✔️' : '❌',
        },
      ]}
    />
  );
}

function buildProjectDisplay(project: ProjectList) {
  let projectType = 'Unknown';
  if (project.tag_names.length > 0) {
    const firstTag = project.tag_names[0];
    projectType = (firstTag.charAt(0).toUpperCase() + firstTag.slice(1)).replace('-k', '').replace('-', ' ');
  }

  return (
    <DetailsDisplay
      photoURL={project.first_photo?.small2_url}
      linkURL={`https://www.ravelry.com/projects/${USERNAME}/${project.permalink}`}
      name={project.name}
      details={[
        {
          label: 'Created on:',
          value: formatDatetime(project.created_at),
        },
        {
          label: 'Craft:',
          value: project.craft_name || 'Unknown',
        },
        {
          label: 'Project type:',
          value: projectType,
        },
      ]}
    />
  );
}

export default function RandomPickerPage() {
  const result = useLoaderData() as {
    choice: 'queue' | 'queue-ready',
    randomItem: QueuedProjectFull,
  } | {
    choice: 'stash',
    randomItem: StashList,
  } | {
    choice: 'wip',
    randomItem: ProjectList,
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div id="random-picker-page" className="page">
      <Form className="header">
        <button name="choice" value="queue">Random Queue Entry</button>
        <button name="choice" value="queue-ready">Random Queue Entry (Ready to Make)</button>
        <button name="choice" value="stash">Random Stash Entry</button>
        <button name="choice" value="wip">Random WIP Project</button>
      </Form>
      <div className="content">
        {result === null && 'Click a button above!'}
        {(result?.choice === 'queue' || result?.choice === 'queue-ready') && buildQueueEntryDisplay(result.randomItem)}
        {result?.choice === 'stash' && buildStashEntryDisplay(result.randomItem)}
        {result?.choice === 'wip' && buildProjectDisplay(result.randomItem)}
      </div>
    </div>
  )
}

RandomPickerPage.loader = loader;
