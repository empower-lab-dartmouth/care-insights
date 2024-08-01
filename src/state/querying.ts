import { v4 } from 'uuid';
import { QueryRecord } from './queryingTypes';
import { timeout } from './sampleData';
import { CRProgramEvents, ProgramEvent } from './types';
import { setRemoteQueryRecord } from './setting';
import OpenAI from 'openai';

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

  const relevantQueries: QueryRecord[] = [];

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

// TODO: Bansharee (helper function)
export async function getRelevantRecords(
  inputQuery: string,
  allCREvents: CRProgramEvents
) {
  const relevantEvents: ProgramEvent[] = [];

  for (const e of Object.values(allCREvents)) {
    // get gpt to figure out relevance
    const prompt = `You are the assistant to a therapist.
            The therapist takes notes during sessions with the patient.
            These notes are meant to aid interactions with the patient during future sessions. We assume that each 
            note or description is trustworthy and meaningful; that is, the information within each note is significant.
            Here is a description of a therapy session event for this patient, written by the therapist: ${e.description}.
            Can the aforementioned descrition be used, even slightly, to answer the question "${inputQuery}"?
            
            Respond Y for yes or N for no, following with your reasoning.`;

    // console.log(prompt)
    // console.log(e.description);
    const res = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    // console.log(res.choices[0]);
    // console.log(res.choices[0].message.content);
    if (res.choices[0].message.content == 'Y') {
      relevantEvents.push(e);
    }
  }

  // console.log('here are the relevant events:');
  // console.log(relevantEvents);
  return relevantEvents;
}

// TODO: Bansharee
export async function askQuery(
  inputQuery: string,
  handleLocalResponse: (q: QueryRecord) => void,
  allCREvents: CRProgramEvents,
  CGUUID: string,
  CRUUID: string,
  allCRQueries: Record<string, QueryRecord>,
  overwritePrior: boolean,
) {
  console.log('input query: ', inputQuery);
  const existingQueryMatchesExactly = allCRQueries[inputQuery];
  if (existingQueryMatchesExactly !== undefined) {
    console.log('queries match exactly');
    console.log(existingQueryMatchesExactly);
    console.log(allCRQueries);
    if (!overwritePrior) {
      console.log('pulling prior response for ' + existingQueryMatchesExactly.query);
      handleLocalResponse(existingQueryMatchesExactly);
      return existingQueryMatchesExactly;
    }
    console.log('overwriting existing for ' + existingQueryMatchesExactly.query);
  }
  const relevantQueries = await getRelevantQueries(inputQuery, allCRQueries);
  const relevantQueryResponses: String[] = [];
  const relevantRecords = getRelevantRecords(inputQuery, allCREvents);

  // we need query responses, not queries themselves
  for (const q of Object.values(relevantQueries)) {
    relevantQueryResponses.push(q.queryResponse);
  }

  // console.log('here are the responses to relevant queries:');
  // console.log(relevantQueryResponses);

  const fakeName = CRUUID;
  const prompt = `you are an expert memory loss therapist
        with deep knowldge of ${fakeName}. A less knowlegable
        peer caregiver asks you the question:
        ${inputQuery}. Answer the question. Your response
        should use information from past responses,
        namely: ${relevantQueryResponses}. You can also draw on the following records you have, ${relevantRecords} 
        Format your response as a short list of bullet points, 
        where each bullet is a short sentence or phrase (no more than eight words).`;

  const queryResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  const ChatGPTResponse = '' + queryResponse.choices[0].message.content;
  const completedQuery: QueryRecord = {
    query: inputQuery,
    queryResponse: ChatGPTResponse,
    queryUUID: v4(),
    CGUUID,
    CRUUID,
  };
  handleLocalResponse(completedQuery);
  return completedQuery;
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
