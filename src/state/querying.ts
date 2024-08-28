import { v4 } from 'uuid';
import { QueryRecord } from './queryingTypes';
import { timeout } from './sampleData';
import { CRProgramEvents, ExtendedAttributes, FeedbackContent, FeedbackEventTypes, FeedbackModifier, ProgramEvent } from './types';
import { setRemoteQueryRecord } from './setting';
import OpenAI from 'openai';
import { formatExtendedAttributesAsInfoBox } from '../screens/summaryInsights/CareInsights';
import { reportTrackingEvent, reportTrackingEventNoPageContext } from './tracking';
import { DEEP_LINKS_TO_PROGRAM_EVENTS_FLAG } from './globals';

// Access the variable
const openAPIKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openAPIKey,
  dangerouslyAllowBrowser: true,
});

// TODO: Bansharee (helper function)
export async function getRelevantQueries(
  inputQuery: string,
  allCRQueries: Record<string, QueryRecord>
) {
  // Filter out unapproved queries.
  const approvedQueries: QueryRecord[] = Object.values(allCRQueries).filter(
    q => q.dateApproved !== undefined
  );

  const relevantQueries: QueryRecord[] = approvedQueries;

  for (const q of approvedQueries) {
    // get gpt to figure out relevance
    const prompt = `Query 1 = "${q.query}" 
            Query 2 = "${inputQuery}"
            Can an answer to Query 1 help us answer Query 2? Or, are query 1 and 2 similar in any way?
            Respond Y for yes, N for no.`;

    const res = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    // console.log(q.query);
    // console.log(res.choices[0]);

    // if res == Y, append it to relevantQueries
    if (res.choices[0].message.content == 'Y') {
      relevantQueries.push(q);
    }
  }

  // console.log('here are the relevant queries:');
  // console.log(relevantQueries);
  return relevantQueries;
}

const getDescriptionOfEvent: (programEvent: ProgramEvent) => string = (p) => {
  if (p.type == 'manual-entry-event') {
    return p.description;
  } else if (p.type === 'music-event') {
    if (Object.values(p.meaningfulMoments).length > 0) {
      return '';
    } else {
      const description = 'In this session, the following happened: '
      return description + Object.values(p.meaningfulMoments).map((m) => {
        m.description
      }).join(' ');
    }
  } else {
    return p.description;
  }
}


// TODO: Bansharee (helper function)
export function getRelevantRecords(
  inputQuery: string,
  allCREvents: CRProgramEvents,
  longform: boolean,
) {
  // const relevantEvents: string[] = [];
  const hasEvents = Object.values(allCREvents).length > 0;
  const prefix = hasEvents ? 'Each record is formatted with the schema: <Record start> Record ID=... Record content=... <Record end> ' : '';
  const suffix = hasEvents ? ' <End of all records> Whenever relevant, add citations to relevant record IDs in your reponse. Cite records in line where appropriate by adding \\cite{RecordID}, where RecordID is a variable that is specified earlier for each record (see Record ID = ...).' : ''
  return prefix + Object.values(allCREvents).filter((e) => {
    if (e.type === 'manual-entry-event') {
      return true;
    }
    if (e.type === 'music-event' && Object.values(e.meaningfulMoments).length > 0) {
      return true;
    } else {
      return true;
    }
  }).map((e) => {
    if (e.type === 'music-event') {
      return Object.values(e.meaningfulMoments)
        .sort((a, b) => a.startTime - b.startTime)
        .map((v) => {
          if (!hasEvents) {
            return v.description;
          }
          return '<Record start.> Record ID=' + v.uuid + ' Record content="' + v.description + '" <Record end>'
        }).join('\n\n');
    }
    if (!hasEvents) {
      return e.description;
    } else {
      return '<Record start.> Record ID=' + e.uuid + ' Record content="' + e.description + '" <Record end>'
    }
  }).join(' ') + suffix;

  // for (const e of Object.values(allCREvents)) {
  //   const eventDescription = getDescriptionOfEvent(e);
  //   if (eventDescription == '') {
  //     continue;
  //   }
  //   // get gpt to figure out relevance
  //   const prompt = `You are the assistant to a therapist.
  //           The therapist takes notes during sessions with the patient.
  //           These notes are meant to aid interactions with the patient during future sessions. We assume that each 
  //           note or description is trustworthy and meaningful; that is, the information within each note is significant.
  //           Here is a description of a therapy session event for this patient, written by the therapist: ${e.description}.
  //           Can the aforementioned descrition be used, even slightly, to answer the question "${inputQuery}"?

  //           Respond Y for yes or N for no, following with your reasoning.`;

  //   // console.log(prompt)
  //   // console.log(e.description);
  //   const res = await openai.chat.completions.create({
  //     messages: [{ role: 'user', content: prompt }],
  //     model: 'gpt-3.5-turbo',
  //   });

  //   // console.log(res.choices[0]);
  //   // console.log(res.choices[0].message.content);
  //   if (res.choices[0].message.content == 'Y') {
  //     relevantEvents.push(eventDescription);
  //   }
  // }

  // // console.log('here are the relevant events:');
  // // console.log(relevantEvents);
  // return relevantEvents;
}

const complileExtendedAttributesIntoPrompt = (e: ExtendedAttributes) => {
  const start = formatExtendedAttributesAsInfoBox(e);
  const checkIfReported = (i: string | undefined) => {
    return i !== undefined && i !== '' && i !== 'Not reported';
  }
  const thingsToTalkAbout = checkIfReported(e.thingsToTalkAbout) ? 'Things to talk about: ' + e.thingsToTalkAbout + '. ' : '';
  const activitiesToDo = checkIfReported(e.activitiesToDo) ? 'Activities to do: ' + e.activitiesToDo + '. ' : '';
  const thingsToAvoid = checkIfReported(e.avoid) ? 'Things to avoid: ' + e.avoid + '. ' : '';
  const symptoms = e.symptoms != undefined && e.symptoms.length > 0 ? 'Symptoms to watch for: ' + e.symptoms.join(', ') + '. ' : '';
  const redirect = checkIfReported(e.waysToRedirect) ? 'Ways to redirect: ' + e.waysToRedirect + '. ' : '';
  const hobbies = e.hobbies && e.hobbies.length > 0 ? 'Care recipients hobbies: ' + e.hobbies.join(', ') + '. ' : '';
  const history = checkIfReported(e.historyOfIncidents) ? 'Care recipients history of incidents: ' + e.historyOfIncidents + '. ' : '';
  const music = checkIfReported(e.music) ? 'Music preferences: ' + e.music + '. ' : '';
  const joined = [thingsToTalkAbout, activitiesToDo, thingsToAvoid, symptoms, redirect, hobbies, history, music]
    .filter((v) => v !== '').join('\n\n');
  return 'Details about the care recipient: ' + start.map((v) => v.label + ': ' + v.value + '.').join('\n') + joined;
}

export async function askQuery(
  inputQuery: string,
  handleLocalResponse: (q: QueryRecord) => void,
  allCREvents: CRProgramEvents,
  CGUUID: string,
  CRUUID: string,
  allCRQueries: Record<string, QueryRecord>,
  overwritePrior: boolean,
  careRecipientName: string,
  extendedAttributes: ExtendedAttributes | undefined,
  longForm?: boolean
) {
  // console.log('input query: ', inputQuery);
  const existingQueryMatchesExactly = allCRQueries[inputQuery];
  if (existingQueryMatchesExactly !== undefined) {
    // console.log('queries match exactly');
    // console.log(existingQueryMatchesExactly);
    // console.log(allCRQueries);
    if (!overwritePrior) {
      // console.log('pulling prior response for ' + existingQueryMatchesExactly.query);
      handleLocalResponse(existingQueryMatchesExactly);
      return existingQueryMatchesExactly;
    }
    // console.log('overwriting existing for ' + existingQueryMatchesExactly.query);
  }
  const relevantQueries: QueryRecord[] = [];//(await getRelevantQueries(inputQuery, allCRQueries));
  const relevantQueryResponses: String[] = [];
  const relevantRecords = getRelevantRecords(inputQuery, allCREvents, longForm ?? false);

  // we need query responses, not queries themselves
  for (const q of Object.values(relevantQueries)) {
    relevantQueryResponses.push('Question: ' + q.query + 'Response: ' + q.queryResponse);
  }

  const ext = extendedAttributes ? complileExtendedAttributesIntoPrompt(extendedAttributes) : '';
  // console.log('here are the responses to relevant queries:');
  // console.log(relevantQueryResponses);
  const formatting = longForm !== undefined && longForm ? `Format your response as several short sentences. Don't use generalities, focus on what a caregiver would find actionable. If possible, reference specific info from the care notes, such as songs or family memories. Be specific to this individual. You can also bring in concepts from music based memory loss therapy. Do not use opening statements like "Based on the care notes", just get to the point.` :
    `Format your response as a short list of bullet points, where each bullet is a short sentence or phrase (no more than five words). Again, heavily leverage the care records, reference specific info from the care notes, such as songs or family memories.`;


  const prompt = `you are an expert memory loss therapist with deep knowldge of ${careRecipientName}. A less knowlegable peer caregiver asks you the question:"${inputQuery}" Answer the question. Your response should use information from the following care notes you have, created by yourself or other caregivers. The following list describes important key info, reference this information most of all: ${ext}. 


        The following are records of music based memory loss therapy, including information about what has worked so far: ${relevantRecords}

        ${formatting}
        `;
  console.log('using longform', longForm);
  const queryResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: longForm ? 'gpt-4o' : 'gpt-4o-mini',
  });
  console.log('PROMPT', prompt);
  const ChatGPTResponse = '' + queryResponse.choices[0].message.content;
  const completedQuery: QueryRecord = {
    query: inputQuery,
    queryResponse: ChatGPTResponse,
    queryUUID: v4(),
    CGUUID,
    CRUUID,
  };
  handleLocalResponse(completedQuery);
  if (longForm) {
    reportTrackingEventNoPageContext({
      type: `asking-query`,
      query: completedQuery
    }, CGUUID, CRUUID);
  }
  return completedQuery;
}

export type PromptReponse = {
  value: FeedbackModifier
  label: string
}

export async function getNegativeFeedbackPrompts(content: FeedbackContent, name: string) {
  const preface = `You have been asked ${content.query.query} about the care recipient ${name}. You know that "${content.targetContent} is not true. Now, `;
  const suffix = ` DO NOT add any citations. Use nine words or fewer`;
  // const opposite = `${preface} saying the exact opposite of the incorrect statement. ${suffix}`;
  const notAccurate = `${preface} briefly summarize that ${content.targetContent} is not a correct response in this context.  Use active tense. CRITICAL: Your response to this prompt should make sense WITHOUT the additional context, that means don't say "question," restate the question. ${suffix}`;
  const notRelevant = `${preface} write a short, standalone phrase that summarizes the idea that ${content.targetContent} is not just relevant in this context. Use active tense. CRITICAL: Your response to this prompt should make sense WITHOUT the additional context! That means, don't say "question" restate the question. ${suffix}`;
  const res = await Promise.all([askGPT(notAccurate, 'not accurate')]);
  // const thirdChoicePrompt = `Four different dementia caregivers were asked ${preface} about the care recipient ${name}. They replied: <Response 1 starts>${content.targetContent}<Response 1 ends>\n\n<Response 2 starts>${res[0].label}<Response 2 ends>\n\n<Response 3 starts>${res[1].label}<Response 3 ends>\n\n<Response 4 starts>${res[2].label}<Response 4 ends>  The first caregiver's response is definitely incorrect, the other three are either not correct or poorly worded. Formulate a better, more CORRECT, and succinct response, please FOCUS on the original question. ${suffix}`;
  // const res2 = await askGPT(thirdChoicePrompt, 'other');
  return [...res, {
    value: 'custom',
    label: 'Other (enter feedback manually)'
  }] as PromptReponse[];
}

export async function getPositivePrompts(content: FeedbackContent, name: string) {
  const preface = `A dementia caregiver was asked ${content.query.query} about the care recipient ${name} and replied: "${content.targetContent}. The feedback is correct, make it more succinct by `;
  const suffix = 'Keep your response very short and DO NOT add any citations.'
  const summarySentence = `${preface} summarizing it in a single VERY, VERY short sentence. Less than seven words! ${suffix}`;
  // const summaryList = `${preface} summarizing in a few words. Less than 10 words! ${suffix}`;
  // const explainedLong = `${preface} summarize the question and the response together using the most succinct wording possible. Less than 10 words! ${suffix}`;
  const res = await Promise.all([askGPT(summarySentence, 'useful')]);
  return [...res, {
    value: 'correct custom',
    label: 'Other (enter feedback manually)'
  }] as PromptReponse[];
}

export async function askGPT(prompt: string, type: string) {
  const queryResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o',
  });
  console.log('PROMPT', prompt);
  const ChatGPTResponse = '' + queryResponse.choices[0].message.content;
  return ({
    value: type,
    label: ChatGPTResponse,
  });
}

// TODO: Bansharee (do this after the above functions are working)
export async function modifyWithFeedback(
  feedback: string,
  query: QueryRecord,
  handleLocalResponse: (q: QueryRecord) => void,
  allCREvents: CRProgramEvents,
  CGUUID: string,
  CRUUID: string,
  allCRQueries: Record<string, QueryRecord>
) {
  // prompt = `you are a memory loss
  // therapist with deep knowldge of ${fakeName}.
  // A more knowlegable peer caregiver just asked you the question:
  // ${query.query}. You replied
  // ${query.queryResponse}. Your peer just told you
  // that your reply was insufficient,
  // and were given a chance to redo your
  // repsponse according to the suggestion
  // ${feedback.suggestion}. Redo the response:`
  // queryResponse = Ask ChatGPT the prompt
  await timeout(1000); // Mocking the delay of calling ChatGPT
  const ChatGPTResponse =
    'Updated response to include feedback "' + feedback + '"';
  const completedQuery: QueryRecord = {
    ...query,
    dateApproved: undefined,
    queryResponse: ChatGPTResponse,
    CGUUID,
    CRUUID,
  };
  handleLocalResponse(completedQuery);
}

export async function respondToApprovalFeedback(query: QueryRecord) {
  setRemoteQueryRecord(query);
  // TODO Dylan — log push
}
