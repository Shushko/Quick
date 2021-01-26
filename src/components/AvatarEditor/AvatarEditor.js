import React, { useState, useRef } from "react";
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import classes from './AvatarEditor.module.sass'
import ReactAvatarEditor from 'react-avatar-editor'
import download from '../../assets/download.png'
import accept from "../../assets/accept.png";
import close from "../../assets/close.png";
import downloadImage from "../../assets/downloadImage.jpg";
import Preloader from "../../common/Preloader/Preloader";
import Notification from "../../common/Notification/Notification";
import { changeUserAvatar } from "../../redux/dialogsData/dialogsDataActions";
import { togglePhotoEditorVisibility } from "../../redux/displayModalElements";
import { togglePhotoEditorPreloader } from "../../redux/preloader";
import { toggleNotificationVisibility } from "../../redux/notification";

const AvatarEditor = (props) => {

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
    const [editor, setEditor] = useState(null);
    const [image, setImage] = useState(null);
    const prevImage = useRef(null);

    const imageWidth = props.isMobileVersion ? props.screenWidth : 490;
    const imageHeight = props.isMobileVersion ? props.screenWidth : 490;
    const editorBorderRadius = 50;
    const editorRotate = '0';
    const editorAllowZoomOut = false;

    const UPLOAD_YOUR_PHOTO = 'Upload your photo';
    const VALID_FORMATS = 'Image can be .jpg .jpeg .png .gif .svg formats';

    const showNotification = (content) => {
        props.toggleNotificationVisibility(true, content);
        setTimeout(() => props.toggleNotificationVisibility(false, ''), 3000)
    };

    const handleImage = e => {
        const imageFile = e.target.files[0];
        const regex = new RegExp(/\.(jpg|jpeg|png|gif|svg)$/);
        regex.test(imageFile.name) ? setImage(imageFile) : showNotification('Invalid file format')
    };

    const handleScale = e => setScale(parseFloat(e.target.value));

    const handlePositionChange = position => setPosition(position);

    const saveResultImage = () => {
        if (editor) {
            if (prevImage.current !== editor.getImage().toDataURL()) {
                prevImage.current = editor.getImage().toDataURL();
                props.togglePhotoEditorPreloader(true);
                const resultImage = editor.getImageScaledToCanvas();
                resultImage.toBlob(blob => props.changeUserAvatar(blob, props.currentUser.id));
            } else {
                showNotification('The image has already been loaded')
            }
        }
    };

    const setEditorRef = editor => setEditor(editor);

    return (
        <div className={ classes.editor_content }>
            <div className={ classes.photo_editor }>
                <div className={ classes.close_button } onClick={ () => props.togglePhotoEditorVisibility(false, false, false) }>
                    <img src={ close } className={ classes.close_button_icon } alt="close"/>
                </div>

                { image ?
                    <ReactAvatarEditor
                        ref={ setEditorRef }
                        scale={ scale }
                        width={ imageWidth }
                        height={ imageHeight }
                        border={ 0 }
                        position={ position }
                        onPositionChange={ handlePositionChange }
                        rotate={ parseFloat(editorRotate) }
                        borderRadius={ imageWidth / (100 / editorBorderRadius) }
                        image={ image }
                    /> :
                    <div className={ classes.upload_photo }>
                        <img className={ classes.upload_photo_image } src={ downloadImage } alt="download image"/>
                        <div className={ classes.upload_photo_text }>
                            <div>{ UPLOAD_YOUR_PHOTO }</div>
                            <div>{ VALID_FORMATS }</div>
                        </div>
                    </div> }

                { props.notification.notificationIsVisible && <Notification content={ props.notification.notificationContent } /> }

            </div>

            <div className={ classes.image_settings }>
                <label htmlFor="file_download">
                    <img src={ download } className={ classes.download } alt="download"/>
                </label>
                <input id="file_download" className={ classes.download_input } type="file" onChange={ handleImage } />

                <input
                    name="scale"
                    type="range"
                    onChange={ handleScale }
                    min={ editorAllowZoomOut ? '0.1' : '1' }
                    max="2"
                    step="0.01"
                    defaultValue="1"
                    className={ classes.scale }
                />

                <label htmlFor="accept_image">
                    { props.preloader ?
                        <Preloader type={ 'photo_editor' } /> :
                        <img src={ accept } className={ classes.accept } alt="download"/> }
                </label>
                <button id="accept_image" className={ classes.accept_image } onClick={ saveResultImage }>Save</button>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    screenWidth: state.appState.screenWidth,
    currentUser: state.dialogsDataReducer.currentUser,
    preloader: state.preloader.photoEditorPreloaderIsVisible,
    notification: state.notification
});

const mapDispatchToProps = (dispatch) => ({
    changeUserAvatar: (file, userID) => dispatch(changeUserAvatar(file, userID)),
    togglePhotoEditorPreloader: (value) => dispatch(togglePhotoEditorPreloader(value)),
    toggleNotificationVisibility: (isVisible, notificationContent) => dispatch(toggleNotificationVisibility(isVisible, notificationContent)),
    togglePhotoEditorVisibility: (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible) => {
        dispatch(togglePhotoEditorVisibility(menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible))
    },
});

AvatarEditor.propTypes = {
    isMobileVersion: PropTypes.bool,
    changeUserAvatar: PropTypes.func,
    currentUser: PropTypes.object,
    togglePhotoEditorVisibility: PropTypes.func,
    preloader: PropTypes.bool,
    togglePhotoEditorPreloader: PropTypes.func,
    notification: PropTypes.object,
    toggleNotificationVisibility: PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(AvatarEditor)
