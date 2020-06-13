import React, { useState } from "react";
import styled from "styled-components";
import { PlayCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { Button, Popconfirm, Popover } from "antd";
import EditIcon from "assets/edit-tools.svg";
import TrashIcon from "assets/send-to-trash.svg";
import { _delete, _post } from "../../axios";

const Event = ({ event, onVideoModalOpen, lifeGuard, fetchEvents }) => {
  const {
    videoUrl,
    telemtryURL,
    thumbnailURL,
    _id,
    startTime,
    endTime,
  } = event;
  const [notePopOverVisible, setNotePopOverVisible] = useState(false);
  const [visibleNoteKey, setVisibleNoteKey] = useState(null);
  const [note, setNote] = useState(event.note);

  const onAddEventNote = async (eventId) => {
    setNotePopOverVisible(false);
    setVisibleNoteKey(null);
    await _post("/addEventNote", {
      note,
      eventId,
    });
    setNote(null);
    fetchEvents();
  };

  const removeEvent = async (eventId) => {
    await _delete(`/removeEvent/${eventId}`);
    fetchEvents();
  };

  const getDurationInMinutes = (startTime, endTime) => {
    return moment
      .duration(
        moment(endTime, "YYYY/MM/DD HH:mm").diff(
          moment(startTime, "YYYY/MM/DD HH:mm")
        )
      )
      .asMinutes();
  };

  return (
    <EventContainer>
      <LeftPart>
        <Thumbnail onClick={() => onVideoModalOpen(videoUrl, telemtryURL)}>
          <ThumbnailImage src={thumbnailURL} />
          <PlayCircleOutlined />
        </Thumbnail>
        <TextContainer>
          <StyledText>Life Guard - {lifeGuard && lifeGuard.name}</StyledText>
          <h3>Date - {moment(event.startTime).format("MMM DD, YYYY")}</h3>
          <h3>
            Duration - {getDurationInMinutes(startTime, endTime)} Minutes (
            {moment(startTime).format("HH:mm")}-
            {moment(endTime).format("HH:mm")})
          </h3>
          <h3>{note ? "Note - " + note : "No note available"}</h3>
        </TextContainer>
      </LeftPart>
      <ButtonsContainer>
        <Popover
          trigger="click"
          title={note ? "Edit note" : "Add note to event"}
          visible={visibleNoteKey === _id && notePopOverVisible}
          placement={"left"}
          content={
            <NoteContainer>
              <TextArea onChange={(e) => setNote(e.target.value)}>
                {note}
              </TextArea>
              <StyledButton onClick={() => onAddEventNote(_id)}>
                save note
              </StyledButton>
            </NoteContainer>
          }
          onVisibleChange={() =>
            visibleNoteKey === _id && setNotePopOverVisible(!notePopOverVisible)
          }
        >
          <StyledImage
            src={EditIcon}
            onClick={() => {
              setNotePopOverVisible(true);
              setVisibleNoteKey(_id);
            }}
          />
        </Popover>

        <Popconfirm
          title={"are you sure you want to remove this event?"}
          onConfirm={() => removeEvent(_id)}
        >
          <StyledImage src={TrashIcon} />
        </Popconfirm>
      </ButtonsContainer>
    </EventContainer>
  );
};

const Thumbnail = styled.div`
  background-size: cover;
  height: 140px;
  width: 250px;
  cursor: pointer;
  position: relative;

  svg {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    position: absolute;
    opacity: 0.7;

    path {
      fill: #fff;
    }
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
`;

const EventContainer = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  justify-content: space-between;
`;

const StyledText = styled.h1`
  font-size: 17px;
`;

const TextArea = styled.textarea`
  resize: none;
`;

const NoteContainer = styled.div`
  width: 280px;
  height: 160px;
  display: flex;
  flex-direction: column;

  textarea {
    height: 100px;
    border-radius: 4px;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100px;
  align-self: flex-end;
  border-radius: 4px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const StyledImage = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
  //margin-top: 5px;
`;

const TextContainer = styled.div`
  margin-left: 30px;
  margin-top: 5px;
`;

const LeftPart = styled.div`
  display: flex;
`;

export default Event;