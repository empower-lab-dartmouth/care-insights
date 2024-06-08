import React from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from
    './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, pageContextState } from '../../state/recoil';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';

const SummaryInsights = () => {
    const pageContext = useRecoilValue(pageContextState);
    return (
        <>
            <Nav />
            <div className='container'>
                <div className='childContainer'>
                    <br />
                    <br />
                    <br />
                    <CommonCRActions page={'care-insights'} />
                    {
                        pageContext.loadingCRInfo ?
                            <CircularProgress /> :
                            pageContext.selectedCR === NO_CR_SELECTED ?
                                <></> :
                                <QuestionAndAnswerPanel />
                    }
                </div>
            </div >
        </>
    );
};

export default SummaryInsights;
