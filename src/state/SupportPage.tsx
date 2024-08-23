import UserShell from "../components/UserShell"
import {
    Title,
    Text,
    Paper,
    Button,
    TextInput,
    Textarea,
    Card,
    Group,
    Pill,
} from '@mantine/core';
import React from "react";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import ReactPlayer from "react-player";

const SupportPage = () => {
    const video = (url: string) => {
        try {
            return <ReactPlayer controls={true} url={url} />
        } catch {
            <a href={url}><Button>{url}</Button></a>
        }
    }

    return (<UserShell>
        <div className='relative min-h-[82vh]'>
            <Card className='mt-[30px] border border-gray-200' shadow='xs' p='lg'>
                <Title order={5}>Welcome to Care Insights</Title>
                <Text >Please see the following video for help getting started. If you have any questions, would like to enroll other folks in the study, need additional help, or run into any isseus using the app please contact <a href="mailto:christina@memcara.com">christina@memcara.com</a> and our team will get back to you ASAP. Thank you!</Text>
                {/* <Text >If you have any questions, would like to enroll other folks in the study, need additional help, or run into any isseus using the app please contact <a href="mailto:christina@memcara.com">christina@memcara.com</a> and our team will get back to you ASAP. Thank you!</Text> */}
                {/* <iframe src="https://drive.google.com/file/d/1T_-NAUxdY0fryqVVXwJO0r-9_T-2PlUY/preview" width="auto" height="480" allow="autoplay"></iframe> */}
                {video('https://firebasestorage.googleapis.com/v0/b/care-insights.appspot.com/o/CareInsights%20walkthrough.mp4?alt=media&token=684e9067-680c-48bf-84c9-a03eb99941ad')}
                {/* <LiteYouTubeEmbed
                    id="OhlhEOgAjQc" //PlxN5leqdwo" https://youtu.be/
                    title="Care Insights Onboarding Intro"
                    rel="0"
                /> */}
                <Text >If you have not yet done so, please complete the onboarding questionnaire, it's very important for our questionnaire. The link for the survey is: <a href="https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK">https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK</a></Text>
                <Text >For more information about the study, see the following video: </Text>
                {video('https://firebasestorage.googleapis.com/v0/b/care-insights.appspot.com/o/Study-announcment.mp4?alt=media&token=80570323-8914-41fe-a5e1-1eacf46dff08')}
                {/* <LiteYouTubeEmbed
                    id="xzXpYwPHkKU"
                    rel="0"
                    title="Care Insights Onboarding Intro"
                /> */}
                {/* <iframe src="https://drive.google.com/file/d/1ma_fW7Yz9vwbqwZW4TSJWU9yE_syHAOB/preview" width="auto" height="480" allow="autoplay"></iframe> */}
            </Card>
        </div>
    </UserShell>)
}

export default SupportPage;
