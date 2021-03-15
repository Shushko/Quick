import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import classes from './InterlocutorInfo.module.sass';
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { setLastVisitListener } from "../../../redux/dialogs/dialogsActions";
import defaultAvatar from '../../../assets/defaultAvatar/defaultAvatar.jpg'

const InterlocutorInfo = (props) => {
    const currentDialogId = props.match.params.dialogId;
    const getCurrentChat = () => props.dialogsData.dialogs.find(d => d.dialogId === currentDialogId);
    const getInterlocutor = (currentChat) => currentChat.members.find(member => member.id !== props.currentUser.id);

    const [interlocutor, setInterlocutor] = useState(getInterlocutor(getCurrentChat()));
    const [interlocutorLastVisit, setInterlocutorLastVisit] = useState(moment(interlocutor.lastVisit).fromNow());

    useEffect(() => {
        if (currentDialogId) {
            const currentChat = getCurrentChat();
            const currentInterlocutor = getInterlocutor(currentChat);
            setInterlocutor(currentInterlocutor);
            props.setLastVisitListener(currentInterlocutor.id)
        }
    }, [props.match.params.dialogId]);

    useEffect(() => {
        setInterlocutorLastVisit(moment(props.lastVisitCurrentInterlocutor).fromNow())
    }, [props.lastVisitCurrentInterlocutor]);

    return (
        <div className={ classes.container }>
            { props.isMobileVersion ?
                <img
                    src={ interlocutor.avatar ? interlocutor.avatar : defaultAvatar }
                    className={ classes.avatar }
                    alt="avatar" /> :
                <div/> }
            <div className={ classes.interlocutor_info }>
                <span className={ classes.interlocutor_info_name }>{ interlocutor.name }</span>
                <span className={ classes.interlocutor_info_last_time_visit }>{ `last seen ${ interlocutorLastVisit }` }</span>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    currentUser: state.userProfile.currentUser,
    dialogsData: state.dialogsReducer,
    lastVisitCurrentInterlocutor: state.dialogsReducer.lastVisitCurrentInterlocutor
});

const mapDispatchToProps = (dispatch) => ({
    setLastVisitListener: (interlocutorId) => dispatch(setLastVisitListener(interlocutorId))
});

InterlocutorInfo.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentUser: PropTypes.object,
    dialogsData: PropTypes.object,
    setLastVisitListener: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(InterlocutorInfo)