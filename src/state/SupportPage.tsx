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
    return (<UserShell>
        <div className='relative min-h-[82vh]'>
            <Card className='mt-[30px] border border-gray-200' shadow='xs' p='lg'>
                <Title order={5}>Welcome to Care Insights</Title>
                <Text >Please see the following video for help getting started. If you have any questions, would like to enroll other folks in the study, need additional help, or run into any isseus using the app please contact <a href="mailto:christina@memcara.com">christina@memcara.com</a> and our team will get back to you ASAP. Thank you!</Text>
                {/* <Text >If you have any questions, would like to enroll other folks in the study, need additional help, or run into any isseus using the app please contact <a href="mailto:christina@memcara.com">christina@memcara.com</a> and our team will get back to you ASAP. Thank you!</Text> */}
                <iframe src="https://drive.google.com/file/d/1T_-NAUxdY0fryqVVXwJO0r-9_T-2PlUY/preview" width="640" height="480" allow="autoplay"></iframe>
                {/* <ReactPlayer url={'https://drive.google.com/file/d/1MWrVTYFEt9_pegr9nF7ZVNPDqP4rz_ED/view?usp=sharing'} /> */}
                {/* <LiteYouTubeEmbed
                    id="OhlhEOgAjQc" //PlxN5leqdwo" https://youtu.be/
                    title="Care Insights Onboarding Intro"
                    rel="0"
                /> */}
                <Text >If you have not yet done so, please complete the onboarding questionnaire, it's very important for our questionnaire. The link for the survey is: <a href="https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK">https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK</a></Text>
                <Text >For more information about the study, see the following video: </Text>
                {/* <LiteYouTubeEmbed
                    id="xzXpYwPHkKU"
                    rel="0"
                    title="Care Insights Onboarding Intro"
                /> */}
                <iframe src="https://drive.google.com/file/d/1ma_fW7Yz9vwbqwZW4TSJWU9yE_syHAOB/preview" width="auto" height="480" allow="autoplay"></iframe>
            </Card>
        </div>
    </UserShell>)
}

export default SupportPage;
