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

const SupportPage = () => {
    return (<UserShell>
        <div className='relative min-h-[82vh]'>
            <Card className='mt-[30px] border border-gray-200' shadow='xs' p='lg'>
                <Title order={5}>Welcome to Care Insights</Title>
                <Text >Please see the following video for help getting started. If you have any questions, would like to enroll other folks in the study, need additional help, or run into any isseus using the app please contact <a href="mailto:christina@memcara.com">christina@memcara.com</a> and our team will get back to you ASAP. Thank you!</Text>
                <LiteYouTubeEmbed
                    id="PlxN5leqdwo"
                    title="Care Insights Onboarding Intro"
                />
                <Text >If you have not yet done so, please complete the onboarding questionnaire, it's very important for our questionnaire. The link for the survey is: <a href="https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK">https://dartmouth.co1.qualtrics.com/jfe/form/SV_3NSoPNEZuUJ50UK</a></Text>
                <Text >For more information about the study, see the following video: </Text>
                <LiteYouTubeEmbed
                    id="xzXpYwPHkKU"
                    title="Care Insights Onboarding Intro"
                />
            </Card>
        </div>
    </UserShell>)
}

export default SupportPage;
